from crewai.tools import BaseTool
from crewai import Agent, Task, Crew, LLM
import json
import os
import sys
from dotenv import load_dotenv
load_dotenv()

# ---------------------------
# Load Gemini Model
# ---------------------------
llm = LLM(
    model="gemini/gemini-2.0-flash",
    temperature=0.2,
)

# ---------------------------
# Technician Assignment Tool
# ---------------------------
class TechnicianAssignmentTool(BaseTool):
    name: str = "Technician Assignment Tool"
    description: str = "Assigns a technician based on issue category, title, and description using database technicians."

    def _run(self, issue_data: dict) -> str:
        try:
            # Parse the issue data
            if isinstance(issue_data, str):
                issue_data = json.loads(issue_data)
            
            category = issue_data.get("category", "").lower()
            title = issue_data.get("title", "")
            description = issue_data.get("description", "")
            
            # Get technicians from the provided data
            technicians = issue_data.get("technicians", [])
            
            # Find the best technician for the category
            best_technician = None
            best_match_score = 0
            
            for tech in technicians:
                skills = [skill.lower() for skill in tech.get("skills", [])]
                
                # Calculate match score
                match_score = 0
                if category in skills:
                    match_score += 3  # Primary skill match
                elif any(skill in category for skill in skills):
                    match_score += 2  # Partial skill match
                
                # Prefer available technicians
                if tech.get("availability") == "available":
                    match_score += 1
                
                # Prefer technicians with lower hourly rate (cost-effective)
                hourly_rate = tech.get("hourlyRate", 1000)
                if hourly_rate < 600:
                    match_score += 1
                
                if match_score > best_match_score:
                    best_match_score = match_score
                    best_technician = tech
            
            if not best_technician:
                # Fallback to general technician
                for tech in technicians:
                    if "plumbing" in tech.get("skills", []) and "electrical" in tech.get("skills", []):
                        best_technician = tech
                        break
                
                if not best_technician and technicians:
                    best_technician = technicians[0]  # Last resort
            
            if best_technician:
                # Create assignment notification
                notification = {
                    "type": "technician_assignment",
                    "title": f"Technician Assigned: {best_technician['name']}",
                    "message": f"{best_technician['name']} has been assigned to your issue. They specialize in {', '.join(best_technician['skills'])} and charge ₹{best_technician['hourlyRate']}/hour.",
                    "technician": {
                        "id": best_technician.get("_id", best_technician.get("id")),
                        "name": best_technician["name"],
                        "phone": best_technician["phone"],
                        "email": best_technician["email"],
                        "skills": best_technician["skills"],
                        "hourlyRate": best_technician["hourlyRate"],
                        "availability": best_technician["availability"]
                    },
                    "issue": {
                        "title": title,
                        "description": description,
                        "category": category
                    },
                    "estimatedTime": self._get_estimated_time(category, title, description),
                    "estimatedCost": self._get_estimated_cost(category, best_technician["hourlyRate"]),
                    "actions": [
                        {
                            "type": "accept",
                            "label": "Accept Assignment",
                            "description": "Accept this technician for your issue"
                        },
                        {
                            "type": "reschedule",
                            "label": "Request Reschedule",
                            "description": "Request a different time slot"
                        },
                        {
                            "type": "reject",
                            "label": "Reject & Request Another",
                            "description": "Request a different technician"
                        }
                    ]
                }
                
                return json.dumps(notification, indent=2)
            else:
                return json.dumps({
                    "error": "No suitable technician found for this category",
                    "category": category,
                    "available_technicians": len(technicians)
                })
                
        except Exception as e:
            return json.dumps({
                "error": f"Error while processing issue: {str(e)}",
                "issue_data": str(issue_data)
            })
    
    def _get_estimated_time(self, category: str, title: str, description: str) -> str:
        """Estimate completion time based on category and issue details."""
        time_estimates = {
            "plumbing": "2-4 hours",
            "electrical": "1-3 hours", 
            "carpentry": "2-6 hours",
            "cleaning": "1-2 hours",
            "security": "1-2 hours",
            "elevator": "4-8 hours",
            "parking": "1-3 hours",
            "garden": "2-4 hours",
            "other": "2-4 hours"
        }
        
        # Adjust based on urgency keywords
        urgent_keywords = ["emergency", "urgent", "broken", "not working", "leak", "spark"]
        if any(keyword in title.lower() or keyword in description.lower() for keyword in urgent_keywords):
            base_time = time_estimates.get(category, "2-4 hours")
            # Reduce time for urgent issues
            if "hours" in base_time:
                hours = base_time.split()[0]
                return f"{hours} (Urgent)"
        
        return time_estimates.get(category, "2-4 hours")
    
    def _get_estimated_cost(self, category: str, hourly_rate: int) -> dict:
        """Estimate cost based on category and hourly rate."""
        time_multipliers = {
            "plumbing": 2.5,
            "electrical": 2.0,
            "carpentry": 3.0,
            "cleaning": 1.5,
            "security": 1.5,
            "elevator": 6.0,
            "parking": 2.0,
            "garden": 2.5,
            "other": 2.5
        }
        
        multiplier = time_multipliers.get(category, 2.5)
        estimated_hours = multiplier
        estimated_cost = hourly_rate * estimated_hours
        
        return {
            "estimated_hours": estimated_hours,
            "hourly_rate": hourly_rate,
            "total_cost": estimated_cost,
            "currency": "INR"
        }

# ---------------------------
# Agent Setup
# ---------------------------
assignment_tool = TechnicianAssignmentTool()

technician_agent = Agent(
    role="Technician Dispatcher",
    goal="Assign the most suitable technician to maintenance issues based on skills, availability, and cost",
    backstory="You are an expert technician dispatcher with years of experience in maintenance management. You always consider skills, availability, and cost when making assignments.",
    tools=[assignment_tool],
    verbose=True,
    llm=llm
)

# ---------------------------
# Main Function for Backend Integration
# ---------------------------
def assign_technician(issue_data: dict) -> dict:
    """
    Main function to assign a technician to an issue.
    
    Args:
        issue_data: Dictionary containing issue details and available technicians
        
    Returns:
        Dictionary with assignment notification
    """
    try:
        # Create task for the agent
        task = Task(
            description=(
                f"Analyze this issue and assign the best technician:\n\n"
                f"Issue: {issue_data.get('title', '')}\n"
                f"Description: {issue_data.get('description', '')}\n"
                f"Category: {issue_data.get('category', '')}\n\n"
                f"Available Technicians: {len(issue_data.get('technicians', []))} technicians\n\n"
                "Use the Technician Assignment Tool to find the best match."
            ),
            expected_output="JSON notification with technician assignment details",
            agent=technician_agent
        )
        
        # Create crew and run
        crew = Crew(
            agents=[technician_agent],
            tasks=[task],
            verbose=False
        )
        
        # Get the result
        result = crew.kickoff()
        
        # Parse the result
        try:
            return json.loads(result)
        except:
            return {
                "error": "Failed to parse agent result",
                "raw_result": result
            }
            
    except Exception as e:
        return {
            "error": f"Error in technician assignment: {str(e)}"
        }

# ---------------------------
# Backend Integration Function
# ---------------------------
def main():
    """Main function for backend integration - reads from stdin and writes to stdout."""
    try:
        # Read input from stdin
        input_data = sys.stdin.read()
        
        if not input_data.strip():
            print(json.dumps({"error": "No input data provided"}))
            return
        
        # Parse the input data
        issue_data = json.loads(input_data)
        
        # Run the assignment
        result = assign_technician(issue_data)
        
        # Output the result to stdout
        print(json.dumps(result, indent=2))
        
    except json.JSONDecodeError as e:
        print(json.dumps({"error": f"Invalid JSON input: {str(e)}"}))
    except Exception as e:
        print(json.dumps({"error": f"Unexpected error: {str(e)}"}))

# ---------------------------
# Test Function
# ---------------------------
def test_assignment():
    """Test the technician assignment with sample data."""
    sample_issue = {
        "title": "Water leak in kitchen sink",
        "description": "There is a persistent water leak under the kitchen sink. Water is dripping and has started to damage the cabinet.",
        "category": "plumbing",
        "technicians": [
            {
                "_id": "tech1",
                "name": "Rajesh Kumar",
                "phone": "+91 98765 43210",
                "email": "rajesh.plumber@societyhub.com",
                "skills": ["plumbing"],
                "hourlyRate": 800,
                "availability": "available"
            },
            {
                "_id": "tech2", 
                "name": "Sanjay Gupta",
                "phone": "+91 98765 43219",
                "email": "sanjay.general@societyhub.com",
                "skills": ["plumbing", "electrical", "carpentry"],
                "hourlyRate": 750,
                "availability": "available"
            }
        ]
    }
    
    result = assign_technician(sample_issue)
    print("Test Result:")
    print(json.dumps(result, indent=2))

# ---------------------------
# Run if called directly
# ---------------------------
if __name__ == "__main__":
    # Check if we're being called from backend (with stdin data) or for testing
    if not sys.stdin.isatty():
        # Called from backend with stdin data
        main()
    else:
        # Called directly for testing
        test_assignment()