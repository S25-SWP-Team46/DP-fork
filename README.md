# Database-Playground

A full-stack web application for database interaction and learning, featuring both PostgreSQL and ChromaDB support.

## Quick Start

To deploy the project locally:
```bash
docker-compose up --build
```

To deploy the project on the server:
```bash
docker-compose build --build-arg REACT_APP_API_URL=http://your-server-ip:8000
docker-compose up
```

If you want to build only frontend:
```bash
docker-compose build --build-arg REACT_APP_API_URL=http://your-server-ip:8000 frontend
# Then with builded backend: 
docker-compose up
```

## Testing

This project includes comprehensive testing with unified reporting across all components.

### Run All Tests

**Windows:**
```powershell
# PowerShell
.\scripts\run_all_tests.ps1

# Command Prompt  
scripts\run_all_tests.bat

# Using Make (if installed)
make test
```

**Linux/Mac:**
```bash
# Bash
./scripts/run_all_tests.sh

# Using Make
make test

# Direct Python
python scripts/aggregate_test_reports.py
```

### Test Components

- **Backend Python Tests**: Pytest for unit tests and database integration tests
- **Django Tests**: Django's built-in test framework for web components  
- **Frontend Tests**: Jest for React component and utility tests

### Test Reports

After running tests, unified reports are generated in `test-reports/`:

- `unified-test-report.html` - Main HTML summary with links to all reports
- `unified-junit-report.xml` - Combined JUnit XML for CI/CD integration
- Individual coverage reports for each component

### CI/CD Integration

The project includes GitHub Actions workflows that automatically:
- Run all test suites on push/PR
- Generate unified test reports  
- Upload test artifacts
- Post test summaries on pull requests

See `.github/workflows/unified-test-reports.yml` for the complete CI configuration.

For more testing details, see [test-reports/README.md](test-reports/README.md).

## Development