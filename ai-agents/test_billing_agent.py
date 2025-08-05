#!/usr/bin/env python3
"""
Test script for the billing agent
"""
import os
import sys
import json
from pathlib import Path

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from billingagent import run_analysis

def test_billing_agent():
    """Test the billing agent with the sample CSV file"""
    
    # Get the path to the sample CSV file
    csv_file = Path(__file__).parent / "samplemaintenance.csv"
    
    if not csv_file.exists():
        print(f"❌ Error: CSV file not found at {csv_file}")
        return False
    
    print(f"📁 Testing with CSV file: {csv_file}")
    
    try:
        # Run the analysis
        results = run_analysis(str(csv_file))
        
        # Print results
        print("\n✅ Analysis completed successfully!")
        print(f"📊 Total records: {results.get('total_records', 0)}")
        print(f"🔍 Duplicate records: {results.get('duplicate_records', 0)}")
        print(f"📈 Duplicate percentage: {results.get('duplicate_percentage', 0)}%")
        
        if results.get('duplicate_details'):
            print("\n🔍 Duplicate details:")
            for dup in results['duplicate_details']:
                print(f"  - {dup['resident_name']}: {dup['count']} duplicates (Bill IDs: {dup['bill_ids']})")
        
        # Test JSON output
        json_output = json.dumps(results, indent=2)
        print(f"\n📄 JSON output length: {len(json_output)} characters")
        
        return True
        
    except Exception as e:
        print(f"❌ Error running analysis: {e}")
        return False

if __name__ == "__main__":
    success = test_billing_agent()
    sys.exit(0 if success else 1) 