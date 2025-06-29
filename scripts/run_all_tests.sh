#!/bin/bash

# Test Report Aggregator Script
# Runs all tests and collects reports into a unified report

set -e

echo "=== Unified Test Report Aggregation ==="
echo "Starting test collection and aggregation..."

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Set up reports directory
REPORTS_DIR="$PROJECT_ROOT/test-reports"
mkdir -p "$REPORTS_DIR"

echo "Project root: $PROJECT_ROOT"
echo "Reports directory: $REPORTS_DIR"

# Run the Python aggregator
echo ""
echo "Running Python test aggregator..."
python3 "$SCRIPT_DIR/aggregate_test_reports.py" --project-root "$PROJECT_ROOT"

echo ""
echo "=== Test Report Aggregation Complete ==="
echo "Check the following files for results:"
echo "  - HTML Summary: $REPORTS_DIR/unified-test-report.html"
echo "  - JSON Summary: $REPORTS_DIR/unified-report.json"
echo "  - JUnit XML: $REPORTS_DIR/unified-junit-report.xml"
echo "  - Individual reports: $REPORTS_DIR/"
