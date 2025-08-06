from crewai.tools import BaseTool
from crewai import Agent, Task, Crew, LLM
import json
import os
import sys
from dotenv import load_dotenv
load_dotenv()

# ---------------------------
# Load Gemini Model with API Key
# ---------------------------
# Set the API key from environment
google_api_key = os.getenv('GOOGLE_API_KEY')
if google_api_key:
    os.environ['GOOGLE_API_KEY'] = google_api_key

llm = LLM(
    model="gemini/gemini-1.5-flash",  # Using more stable model
    temperature=0.1,  # Lower temperature for more consistent output
    api_key=google_api_key
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

            if not technicians:
                return json.dumps({
                    "error": "No technicians available",
                    "category": category
                })

            # Find the best technician for the category using simple logic
            best_technician = self._find_best_technician(category, technicians)

            if not best_technician:
                return json.dumps({
                    "error": "No suitable technician found for this category",
                    "category": category,
                    "available_technicians": len(technicians)
                })
            
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

    def _find_best_technician(self, category: str, technicians: list) -> dict:
        """Find the best technician using simple matching logic."""
        best_technician = None
        best_match_score = 0

        for tech in technicians:
            skills = [skill.lower() for skill in tech.get("skills", [])]

            # Calculate match score
            match_score = 0
            if category in skills:
                match_score += 3  # Primary skill match
            elif any(skill in category or category in skill for skill in skills):
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

        # Fallback logic
        if not best_technician:
            # Try to find a general technician with multiple skills
            for tech in technicians:
                skills = tech.get("skills", [])
                if len(skills) >= 2:  # Multi-skilled technician
                    best_technician = tech
                    break

            # Last resort - any available technician
            if not best_technician:
                for tech in technicians:
                    if tech.get("availability") == "available":
                        best_technician = tech
                        break

                # Absolute last resort
                if not best_technician and technicians:
                    best_technician = technicians[0]

        return best_technician

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
    backstory="You are an expert technician dispatcher. Assign technicians based on skills match, availability, and cost efficiency.",
    tools=[assignment_tool],
    verbose=False,  # Reduce verbosity to avoid encoding issues
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
        # First try direct assignment without AI agent as fallback
        assignment_tool = TechnicianAssignmentTool()
        result_str = assignment_tool._run(issue_data)

        try:
            result = json.loads(result_str)
            if not result.get("error"):
                return result
        except json.JSONDecodeError:
            pass

        # If direct assignment fails, try with AI agent
        try:
            # Create task for the agent
            task = Task(
                description=(
                    f"Assign the best technician for this {issue_data.get('category', '')} issue. "
                    f"Consider skills, availability, and cost. "
                    f"Issue: {issue_data.get('title', '')} - {issue_data.get('description', '')}"
                ),
                expected_output="JSON notification with technician assignment details",
                agent=technician_agent
            )

            # Create crew and run with minimal verbosity
            crew = Crew(
                agents=[technician_agent],
                tasks=[task],
                verbose=False
            )

            # Get the result
            result = crew.kickoff()

            # Parse the result - convert CrewOutput to string first
            result_str = str(result)
            return json.loads(result_str)

        except Exception as ai_error:
            # If AI agent fails, fall back to direct assignment result
            try:
                return json.loads(result_str)
            except:
                return {
                    "error": f"Both AI agent and direct assignment failed: {str(ai_error)}",
                    "fallback_attempted": True
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
        # Set UTF-8 encoding for stdout to handle Unicode characters
        import codecs
        if hasattr(sys.stdout, 'detach'):
            sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach())

        # Read input from stdin
        input_data = sys.stdin.read()

        if not input_data.strip():
            print(json.dumps({"error": "No input data provided"}, ensure_ascii=False))
            return

        # Parse the input data
        issue_data = json.loads(input_data)

        # Run the assignment
        result = assign_technician(issue_data)

        # Output the result to stdout with proper encoding
        print(json.dumps(result, indent=2, ensure_ascii=False))

    except json.JSONDecodeError as e:
        print(json.dumps({"error": f"Invalid JSON input: {str(e)}"}, ensure_ascii=False))
    except Exception as e:
        print(json.dumps({"error": f"Unexpected error: {str(e)}"}, ensure_ascii=False))

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
    try:
        print(json.dumps(result, indent=2))
    except TypeError as e:
        print(f"Error serializing result: {e}")
        print(f"Result type: {type(result)}")
        print(f"Result: {result}")

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