# Test Report Aggregator Script for Windows PowerShell
# Runs all tests and collects reports into a unified report

param(
    [string]$ProjectRoot = "",
    [string]$ReportsDir = ""
)

Write-Host "=== Unified Test Report Aggregation ===" -ForegroundColor Green
Write-Host "Starting test collection and aggregation..." -ForegroundColor Yellow

# Get the directory where this script is located
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
if (-not $ProjectRoot) {
    $ProjectRoot = Split-Path -Parent $ScriptDir
}

# Set up reports directory
if (-not $ReportsDir) {
    $ReportsDir = Join-Path $ProjectRoot "test-reports"
}

if (-not (Test-Path $ReportsDir)) {
    New-Item -ItemType Directory -Path $ReportsDir -Force | Out-Null
}

Write-Host "Project root: $ProjectRoot" -ForegroundColor Cyan
Write-Host "Reports directory: $ReportsDir" -ForegroundColor Cyan

# Check if Python is available
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Using Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Error "Python is not available. Please install Python and ensure it's in your PATH."
    exit 1
}

# Run the Python aggregator
Write-Host ""
Write-Host "Running Python test aggregator..." -ForegroundColor Yellow

$aggregatorScript = Join-Path $ScriptDir "aggregate_test_reports.py"

try {
    python $aggregatorScript --project-root $ProjectRoot --reports-dir $ReportsDir
    $exitCode = $LASTEXITCODE
} catch {
    Write-Error "Failed to run test aggregator: $_"
    exit 1
}

Write-Host ""
Write-Host "=== Test Report Aggregation Complete ===" -ForegroundColor Green

if ($exitCode -eq 0) {
    Write-Host "All tests passed!" -ForegroundColor Green
} else {
    Write-Host "Some tests failed. Check the reports for details." -ForegroundColor Red
}

Write-Host "Check the following files for results:" -ForegroundColor Cyan
Write-Host "  - HTML Summary: $ReportsDir\unified-test-report.html" -ForegroundColor White
Write-Host "  - JSON Summary: $ReportsDir\unified-report.json" -ForegroundColor White
Write-Host "  - JUnit XML: $ReportsDir\unified-junit-report.xml" -ForegroundColor White
Write-Host "  - Individual reports: $ReportsDir\" -ForegroundColor White

# Open the HTML report in default browser if tests passed
if ($exitCode -eq 0) {
    $htmlReport = Join-Path $ReportsDir "unified-test-report.html"
    if (Test-Path $htmlReport) {
        Write-Host ""
        Write-Host "Opening HTML report in default browser..." -ForegroundColor Yellow
        Start-Process $htmlReport
    }
}

exit $exitCode
