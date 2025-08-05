from crewai.tools import BaseTool
import pandas as pd
import os
import sys
import json
from dotenv import load_dotenv
load_dotenv()

from crewai import LLM

# Get API key from environment variable
api_key = os.getenv('GOOGLE_API_KEY')
if not api_key:
    print("Warning: GOOGLE_API_KEY not found in environment variables")
    api_key = "your-gemini-api-key-here"

llm = LLM(
    model="gemini/gemini-2.0-flash",
    temperature=0.1,
    api_key=api_key
)

class DuplicateCheckerTool(BaseTool):
    name: str = "Duplicate Checker Tool"
    description: str = (
        "Identifies rows in a CSV file where all fields except 'Bill ID' match, "
        "ignoring case and leading/trailing spaces."
    )

    def _run(self, file_path: str) -> str:
        if not os.path.exists(file_path):
            return "Error: File not found."

        try:
            df = pd.read_csv(file_path)

            if df.empty:
                return "The CSV file is empty."

            # Columns to compare for duplicates (excluding 'Bill ID')
            columns_to_check = ['Resident Name', 'Amount', 'Status', 'Date', 'Comments']

            # Clean string columns: strip and lowercase
            df_clean = df.copy()
            for col in columns_to_check:
                if df_clean[col].dtype == 'object':
                    df_clean[col] = df_clean[col].str.strip().str.lower()

            # Identify duplicates based on the selected columns
            duplicate_rows = df[df_clean.duplicated(subset=columns_to_check, keep=False)]

            if duplicate_rows.empty:
                return "No duplicate entries found based on Resident Name, Amount, Status, Date, and Comments."

            result = f"Duplicate entries found ({len(duplicate_rows)} rows):\n\n"
            
            # Get all duplicates, not just for a specific resident
            result += duplicate_rows.to_string(index=False, max_rows=100)
            return result

        except Exception as e:
            return f"Error while processing file: {str(e)}"

def run_analysis(csv_file_path):
    """Run the billing analysis and return structured results"""
    try:
        # Initialize the tool
        dt = DuplicateCheckerTool()
        
        # Run the duplicate check
        tool_output = dt.run(csv_file_path)
        
        # Parse the results
        df = pd.read_csv(csv_file_path)
        duplicate_rows = df[df.duplicated(subset=['Resident Name', 'Amount', 'Status', 'Date', 'Comments'], keep=False)]
        
        # Create structured results
        results = {
            "analysis_type": "billing_duplicate_detection",
            "csv_file": csv_file_path,
            "total_records": int(len(df)),
            "duplicate_records": int(len(duplicate_rows)),
            "duplicate_percentage": round((len(duplicate_rows) / len(df)) * 100, 2),
            "raw_output": tool_output,
            "duplicate_details": []
        }
        
        # Add details for each duplicate group
        if not duplicate_rows.empty:
            duplicate_groups = df[df.duplicated(subset=['Resident Name', 'Amount', 'Status', 'Date', 'Comments'], keep=False)].groupby(['Resident Name', 'Amount', 'Status', 'Date', 'Comments'])
            
            for group_key, group_data in duplicate_groups:
                results["duplicate_details"].append({
                    "resident_name": str(group_key[0]),
                    "amount": int(group_key[1]),
                    "status": str(group_key[2]),
                    "date": str(group_key[3]),
                    "comments": str(group_key[4]),
                    "bill_ids": group_data['Bill ID'].tolist(),
                    "count": int(len(group_data))
                })
        
        return results
        
    except Exception as e:
        return {
            "error": str(e),
            "analysis_type": "billing_duplicate_detection",
            "csv_file": csv_file_path
        }

def main():
    """Main function to run when script is executed directly"""
    if len(sys.argv) < 2:
        print("Usage: python billingagent.py <csv_file_path>")
        sys.exit(1)
    
    csv_file_path = sys.argv[1]
    
    if not os.path.exists(csv_file_path):
        print(f"Error: File {csv_file_path} not found")
        sys.exit(1)
    
    # Run analysis
    results = run_analysis(csv_file_path)
    
    # Output results as JSON for Node.js integration
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    main()