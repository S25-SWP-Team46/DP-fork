# Makefile for Unified Test Reports
# Provides simple commands to run tests and generate reports

.PHONY: test test-backend test-frontend test-django install-deps clean help

# Default target
help:
	@echo "Available commands:"
	@echo "  make test          - Run all tests and generate unified reports"
	@echo "  make test-backend  - Run only backend Python tests"
	@echo "  make test-frontend - Run only frontend Jest tests"
	@echo "  make test-django   - Run only Django tests"
	@echo "  make install-deps  - Install all test dependencies"
	@echo "  make clean         - Clean test reports and temporary files"
	@echo "  make setup         - Initial setup for testing environment"

# Run all tests with unified reporting
test:
	@echo "Running unified test suite..."
	python scripts/aggregate_test_reports.py
	@echo "Test reports generated in test-reports/"
	@echo "Open test-reports/unified-test-report.html to view results"

# Backend tests only
test-backend:
	@echo "Running backend tests..."
	cd backend && python -m pytest tests/ -v --cov=core --cov-report=html --cov-report=xml

# Frontend tests only  
test-frontend:
	@echo "Running frontend tests..."
	cd frontend && npm test -- --coverage --watchAll=false

# Django tests only
test-django:
	@echo "Running Django tests..."
	cd backend/core && python manage.py test --verbosity=2

# Install all dependencies
install-deps:
	@echo "Installing Python dependencies..."
	pip install -r backend/core/requirements.txt
	@echo "Installing Node.js dependencies..."
	cd frontend && npm install

# Clean up generated files
clean:
	@echo "Cleaning test reports..."
	rm -rf test-reports/
	rm -rf backend/htmlcov/
	rm -rf backend/.coverage
	rm -rf backend/.pytest_cache/
	rm -rf frontend/coverage/
	find . -name "*.pyc" -delete
	find . -name "__pycache__" -type d -exec rm -rf {} +
	@echo "Clean complete"

# Initial setup
setup: install-deps
	@echo "Setting up testing environment..."
	mkdir -p test-reports
	@echo "Setup complete. Run 'make test' to execute all tests."

# Quick test (skip slow tests)
test-quick:
	@echo "Running quick tests (unit tests only)..."
	cd backend && python -m pytest tests/ -v -k "not integration"
	cd frontend && npm test -- --watchAll=false --passWithNoTests

# Test with coverage only
test-coverage:
	@echo "Running tests with coverage analysis..."
	cd backend && python -m pytest tests/ --cov=core --cov-report=term-missing
	cd frontend && npm test -- --coverage --watchAll=false --coverageReporters=text

# CI mode (for continuous integration)
test-ci:
	@echo "Running tests in CI mode..."
	python scripts/aggregate_test_reports.py
	@echo "CI test run complete"
