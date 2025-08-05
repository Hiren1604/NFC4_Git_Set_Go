#!/usr/bin/env python3
"""
Simple test script for the billing agent without external dependencies
"""
import pandas as pd
import json
import sys
from pathlib import Path

def simple_duplicate_check(csv_file_path):
    """Simple duplicate detection without external dependencies"""
    try:
        # Read CSV file
        df = pd.read_csv(csv_file_path)
        
        print(f"Total records: {len(df)}")
        print(f"File: {csv_file_path}")
        
        # Check for duplicates based on key columns
        columns_to_check = ['Resident Name', 'Amount', 'Status', 'Date', 'Comments']
        
        # Clean string columns
        df_clean = df.copy()
        for col in columns_to_check:
            if df_clean[col].dtype == 'object':
                df_clean[col] = df_clean[col].str.strip().str.lower()
        
        # Find duplicates
        duplicate_rows = df[df_clean.duplicated(subset=columns_to_check, keep=False)]
        
        print(f"Duplicate records: {len(duplicate_rows)}")
        print(f"Duplicate percentage: {round((len(duplicate_rows) / len(df)) * 100, 2)}%")
        
        # Create results structure
        results = {
            "analysis_type": "billing_duplicate_detection",
            "csv_file": str(csv_file_path),
            "total_records": int(len(df)),
            "duplicate_records": int(len(duplicate_rows)),
            "duplicate_percentage": round((len(duplicate_rows) / len(df)) * 100, 2),
            "duplicate_details": []
        }
        
        # Add details for each duplicate group
        if not duplicate_rows.empty:
            duplicate_groups = df[df_clean.duplicated(subset=columns_to_check, keep=False)].groupby(columns_to_check)
            
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
                
                print(f"  - {group_key[0]}: {len(group_data)} duplicates (Bill IDs: {group_data['Bill ID'].tolist()})")
        
        return results
        
    except Exception as e:
        print(f"Error: {e}")
        return {
            "error": str(e),
            "analysis_type": "billing_duplicate_detection",
            "csv_file": str(csv_file_path)
        }

def main():
    """Main function"""
    if len(sys.argv) < 2:
        print("Usage: python simple_test.py <csv_file_path>")
        sys.exit(1)
    
    csv_file_path = sys.argv[1]
    
    if not Path(csv_file_path).exists():
        print(f"Error: File {csv_file_path} not found")
        sys.exit(1)
    
    print("Running simple billing analysis...")
    results = simple_duplicate_check(csv_file_path)
    
    # Output results as JSON
    print("\nJSON Output:")
    print(json.dumps(results, indent=2))
    
    if "error" not in results:
        print("\nAnalysis completed successfully!")
    else:
        print("\nAnalysis failed!")
        sys.exit(1)

if __name__ == "__main__":
    main() 