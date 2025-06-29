#!/usr/bin/env python3
"""
Test Report Aggregator
Collects and merges test reports from all parts of the project into a unified report.
"""

import os
import json
import xml.etree.ElementTree as ET
from pathlib import Path
from datetime import datetime
import subprocess
import sys
from typing import Dict, List, Any

class TestReportAggregator:
    def __init__(self, project_root: str = None):
        self.project_root = Path(project_root) if project_root else Path(__file__).parent.parent
        self.reports_dir = self.project_root / "test-reports"
        self.reports_dir.mkdir(exist_ok=True)
        
    def run_backend_tests(self) -> Dict[str, Any]:
        """Run pytest tests for backend and collect results."""
        print("Running backend tests...")
        backend_dir = self.project_root / "backend"
        
        # Install requirements if needed
        subprocess.run([
            sys.executable, "-m", "pip", "install", "-r", 
            str(backend_dir / "core" / "requirements.txt")
        ], cwd=backend_dir, capture_output=True)
        
        # Install additional testing packages
        subprocess.run([
            sys.executable, "-m", "pip", "install", 
            "pytest-cov", "pytest-html", "pytest-json-report"
        ], capture_output=True)
        
        # Run pytest with multiple output formats
        pytest_cmd = [
            sys.executable, "-m", "pytest",
            "tests/",
            "-v",
            "--tb=short",
            f"--junitxml={self.reports_dir}/backend-junit.xml",
            f"--html={self.reports_dir}/backend-report.html",
            "--self-contained-html",
            f"--json-report={self.reports_dir}/backend-report.json",
            "--cov=core",
            f"--cov-report=xml:{self.reports_dir}/backend-coverage.xml",
            f"--cov-report=html:{self.reports_dir}/backend-coverage-html",
            "--cov-report=term"
        ]
        
        result = subprocess.run(pytest_cmd, cwd=backend_dir, capture_output=True, text=True)
        
        return {
            "status": "passed" if result.returncode == 0 else "failed",
            "returncode": result.returncode,
            "stdout": result.stdout,
            "stderr": result.stderr,
            "reports": {
                "junit": self.reports_dir / "backend-junit.xml",
                "html": self.reports_dir / "backend-report.html",
                "json": self.reports_dir / "backend-report.json",
                "coverage_xml": self.reports_dir / "backend-coverage.xml",
                "coverage_html": self.reports_dir / "backend-coverage-html"
            }
        }
    
    def run_frontend_tests(self) -> Dict[str, Any]:
        """Run Jest tests for frontend and collect results."""
        print("Running frontend tests...")
        frontend_dir = self.project_root / "frontend"
        
        if not (frontend_dir / "package.json").exists():
            return {
                "status": "skipped",
                "message": "No frontend package.json found"
            }
        
        # Install dependencies
        subprocess.run(["npm", "ci"], cwd=frontend_dir, capture_output=True)
        
        # Run tests with coverage and CI options
        test_cmd = [
            "npm", "test", "--",
            "--coverage",
            "--watchAll=false",
            "--testResultsProcessor=jest-junit",
            f"--outputFile={self.reports_dir}/frontend-junit.xml",
            "--coverageReporters=text",
            "--coverageReporters=lcov",
            "--coverageReporters=cobertura",
            f"--coverageDirectory={self.reports_dir}/frontend-coverage"
        ]
        
        # Set environment variables for CI
        env = os.environ.copy()
        env.update({
            "CI": "true",
            "JEST_JUNIT_OUTPUT_DIR": str(self.reports_dir),
            "JEST_JUNIT_OUTPUT_NAME": "frontend-junit.xml"
        })
        
        result = subprocess.run(test_cmd, cwd=frontend_dir, env=env, capture_output=True, text=True)
        
        return {
            "status": "passed" if result.returncode == 0 else "failed",
            "returncode": result.returncode,
            "stdout": result.stdout,
            "stderr": result.stderr,
            "reports": {
                "junit": self.reports_dir / "frontend-junit.xml",
                "coverage": self.reports_dir / "frontend-coverage"
            }
        }
    
    def run_django_tests(self) -> Dict[str, Any]:
        """Run Django tests and collect results."""
        print("Running Django tests...")
        backend_dir = self.project_root / "backend" / "core"
        
        # Install dependencies
        subprocess.run([
            sys.executable, "-m", "pip", "install", 
            "unittest-xml-reporting", "coverage"
        ], capture_output=True)
        
        # Run Django tests with XML output
        django_cmd = [
            sys.executable, "manage.py", "test",
            "--testrunner=xmlrunner.extra.djangotestrunner.XMLTestRunner",
            "--noinput",
            "--verbosity=2",
            f"--output-dir={self.reports_dir}"
        ]
        
        result = subprocess.run(django_cmd, cwd=backend_dir, capture_output=True, text=True)
        
        return {
            "status": "passed" if result.returncode == 0 else "failed",
            "returncode": result.returncode,
            "stdout": result.stdout,
            "stderr": result.stderr,
            "reports": {
                "junit": self.reports_dir / "TEST-*.xml"
            }
        }
    
    def merge_junit_reports(self, junit_files: List[Path]) -> Path:
        """Merge multiple JUnit XML reports into one."""
        print("Merging JUnit reports...")
        
        # Create root test suites element
        root = ET.Element("testsuites")
        root.set("name", "Unified Test Report")
        root.set("timestamp", datetime.now().isoformat())
        
        total_tests = 0
        total_failures = 0
        total_errors = 0
        total_time = 0.0
        
        for junit_file in junit_files:
            if junit_file.exists():
                try:
                    tree = ET.parse(junit_file)
                    suite_root = tree.getroot()
                    
                    # Handle both <testsuites> and <testsuite> root elements
                    if suite_root.tag == "testsuites":
                        for testsuite in suite_root.findall("testsuite"):
                            root.append(testsuite)
                            total_tests += int(testsuite.get("tests", 0))
                            total_failures += int(testsuite.get("failures", 0))
                            total_errors += int(testsuite.get("errors", 0))
                            total_time += float(testsuite.get("time", 0))
                    elif suite_root.tag == "testsuite":
                        root.append(suite_root)
                        total_tests += int(suite_root.get("tests", 0))
                        total_failures += int(suite_root.get("failures", 0))
                        total_errors += int(suite_root.get("errors", 0))
                        total_time += float(suite_root.get("time", 0))
                        
                except ET.ParseError as e:
                    print(f"Warning: Could not parse {junit_file}: {e}")
        
        # Set totals
        root.set("tests", str(total_tests))
        root.set("failures", str(total_failures))
        root.set("errors", str(total_errors))
        root.set("time", str(total_time))
        
        # Write merged report
        merged_file = self.reports_dir / "unified-junit-report.xml"
        tree = ET.ElementTree(root)
        tree.write(merged_file, encoding="utf-8", xml_declaration=True)
        
        return merged_file
    
    def generate_html_summary(self, results: Dict[str, Any]) -> Path:
        """Generate an HTML summary report."""
        print("Generating HTML summary...")
        
        html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unified Test Report</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 20px; }}
        .header {{ background-color: #f5f5f5; padding: 20px; border-radius: 5px; }}
        .section {{ margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }}
        .passed {{ background-color: #d4edda; border-color: #c3e6cb; }}
        .failed {{ background-color: #f8d7da; border-color: #f5c6cb; }}
        .skipped {{ background-color: #fff3cd; border-color: #ffeaa7; }}
        .details {{ margin-top: 10px; }}
        pre {{ background-color: #f8f9fa; padding: 10px; border-radius: 3px; overflow-x: auto; }}
        .report-links {{ margin: 10px 0; }}
        .report-links a {{ margin-right: 15px; color: #007bff; text-decoration: none; }}
        .report-links a:hover {{ text-decoration: underline; }}
    </style>
</head>
<body>
    <div class="header">
        <h1>Unified Test Report</h1>
        <p>Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
        <p>Project: {self.project_root.name}</p>
    </div>
"""
        
        for test_type, result in results.items():
            if result.get("status") == "skipped":
                continue
                
            status_class = "passed" if result["status"] == "passed" else "failed"
            html_content += f"""
    <div class="section {status_class}">
        <h2>{test_type.title()} Tests - {result["status"].upper()}</h2>
        <div class="details">
            <p><strong>Return Code:</strong> {result.get("returncode", "N/A")}</p>
"""
            
            if "reports" in result:
                html_content += '<div class="report-links"><strong>Reports:</strong><br>'
                for report_type, report_path in result["reports"].items():
                    if isinstance(report_path, Path) and report_path.exists():
                        relative_path = report_path.relative_to(self.reports_dir)
                        html_content += f'<a href="{relative_path}">{report_type.title()}</a>'
                html_content += '</div>'
            
            if result.get("stdout"):
                html_content += f'<details><summary>Output</summary><pre>{result["stdout"]}</pre></details>'
            
            if result.get("stderr"):
                html_content += f'<details><summary>Errors</summary><pre>{result["stderr"]}</pre></details>'
            
            html_content += "</div></div>"
        
        html_content += """
    <div class="section">
        <h2>Additional Reports</h2>
        <div class="report-links">
            <a href="unified-junit-report.xml">Unified JUnit XML</a>
            <a href="unified-report.json">Unified JSON Report</a>
        </div>
    </div>
</body>
</html>
"""
        
        html_file = self.reports_dir / "unified-test-report.html"
        html_file.write_text(html_content, encoding="utf-8")
        
        return html_file
    
    def generate_json_summary(self, results: Dict[str, Any]) -> Path:
        """Generate a JSON summary report."""
        print("Generating JSON summary...")
        
        summary = {
            "generated_at": datetime.now().isoformat(),
            "project_root": str(self.project_root),
            "results": results,
            "overall_status": "passed" if all(
                r.get("status") in ["passed", "skipped"] for r in results.values()
            ) else "failed"
        }
        
        json_file = self.reports_dir / "unified-report.json"
        json_file.write_text(json.dumps(summary, indent=2, default=str), encoding="utf-8")
        
        return json_file
    
    def run_all_tests(self) -> Dict[str, Any]:
        """Run all tests and generate unified reports."""
        print(f"Starting test aggregation for project: {self.project_root}")
        print(f"Reports will be saved to: {self.reports_dir}")
        
        results = {}
        
        # Run all test suites
        results["backend"] = self.run_backend_tests()
        results["frontend"] = self.run_frontend_tests()
        results["django"] = self.run_django_tests()
        
        # Collect all JUnit XML files
        junit_files = []
        for result in results.values():
            if "reports" in result and "junit" in result["reports"]:
                junit_path = result["reports"]["junit"]
                if isinstance(junit_path, Path):
                    junit_files.append(junit_path)
                elif isinstance(junit_path, str) and "*" in junit_path:
                    # Handle glob patterns
                    junit_files.extend(self.reports_dir.glob("TEST-*.xml"))
        
        # Merge JUnit reports
        if junit_files:
            merged_junit = self.merge_junit_reports(junit_files)
            print(f"Merged JUnit report: {merged_junit}")
        
        # Generate summary reports
        html_summary = self.generate_html_summary(results)
        json_summary = self.generate_json_summary(results)
        
        print(f"\nTest aggregation complete!")
        print(f"HTML Summary: {html_summary}")
        print(f"JSON Summary: {json_summary}")
        print(f"All reports in: {self.reports_dir}")
        
        return results

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="Aggregate test reports from all project components")
    parser.add_argument("--project-root", help="Path to project root directory")
    parser.add_argument("--reports-dir", help="Directory to save reports (default: project-root/test-reports)")
    
    args = parser.parse_args()
    
    aggregator = TestReportAggregator(args.project_root)
    if args.reports_dir:
        aggregator.reports_dir = Path(args.reports_dir)
        aggregator.reports_dir.mkdir(exist_ok=True)
    
    try:
        results = aggregator.run_all_tests()
        
        # Exit with appropriate code
        overall_success = all(
            result.get("status") in ["passed", "skipped"] 
            for result in results.values()
        )
        sys.exit(0 if overall_success else 1)
        
    except Exception as e:
        print(f"Error during test aggregation: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
