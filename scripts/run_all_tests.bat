@echo off
REM Test Report Aggregator Batch Script for Windows
REM Runs all tests and collects reports into a unified report

echo === Unified Test Report Aggregation ===
echo Starting test collection and aggregation...

REM Get the directory where this script is located
set SCRIPT_DIR=%~dp0
set PROJECT_ROOT=%SCRIPT_DIR%..
set REPORTS_DIR=%PROJECT_ROOT%\test-reports

echo Project root: %PROJECT_ROOT%
echo Reports directory: %REPORTS_DIR%

REM Create reports directory if it doesn't exist
if not exist "%REPORTS_DIR%" mkdir "%REPORTS_DIR%"

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not available. Please install Python and ensure it's in your PATH.
    pause
    exit /b 1
)

echo.
echo Running Python test aggregator...

REM Run the Python aggregator
python "%SCRIPT_DIR%aggregate_test_reports.py" --project-root "%PROJECT_ROOT%"
set EXIT_CODE=%ERRORLEVEL%

echo.
echo === Test Report Aggregation Complete ===

if %EXIT_CODE% equ 0 (
    echo All tests passed!
) else (
    echo Some tests failed. Check the reports for details.
)

echo Check the following files for results:
echo   - HTML Summary: %REPORTS_DIR%\unified-test-report.html
echo   - JSON Summary: %REPORTS_DIR%\unified-report.json
echo   - JUnit XML: %REPORTS_DIR%\unified-junit-report.xml
echo   - Individual reports: %REPORTS_DIR%\

REM Open the HTML report in default browser if tests passed
if %EXIT_CODE% equ 0 (
    if exist "%REPORTS_DIR%\unified-test-report.html" (
        echo.
        echo Opening HTML report in default browser...
        start "" "%REPORTS_DIR%\unified-test-report.html"
    )
)

if "%1" neq "nopause" pause
exit /b %EXIT_CODE%
