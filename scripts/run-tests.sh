#!/bin/bash

# Jazz Piano Learning Platform - Test Runner Script
# Usage: ./scripts/run-tests.sh [unit|e2e|all|coverage]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  🎹 Jazz Piano Learning Platform - Test Suite${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

run_unit_tests() {
    echo "🧪 Running Unit Tests (Vitest)..."
    echo ""
    
    if npx vitest run --reporter=verbose; then
        echo ""
        print_success "Unit tests passed!"
        return 0
    else
        echo ""
        print_error "Unit tests failed!"
        return 1
    fi
}

run_e2e_tests() {
    echo "🎭 Running E2E Tests (Playwright)..."
    echo ""
    
    # Check if Playwright browsers are installed
    if ! npx playwright install --with-deps chromium 2>/dev/null; then
        print_warning "Installing Playwright browsers..."
        npx playwright install chromium
    fi
    
    if npx playwright test --reporter=list; then
        echo ""
        print_success "E2E tests passed!"
        return 0
    else
        echo ""
        print_error "E2E tests failed!"
        return 1
    fi
}

run_coverage() {
    echo "📊 Generating Test Coverage Report..."
    echo ""
    
    # Unit test coverage
    npx vitest run --coverage
    
    echo ""
    print_success "Coverage report generated!"
    echo "📁 View report at: coverage/index.html"
}

run_typecheck() {
    echo "🔍 Running TypeScript Type Check..."
    echo ""
    
    if npx tsc --noEmit; then
        echo ""
        print_success "Type check passed!"
        return 0
    else
        echo ""
        print_error "Type check failed!"
        return 1
    fi
}

run_lint() {
    echo "🔬 Running Linter..."
    echo ""
    
    if npm run lint; then
        echo ""
        print_success "Linting passed!"
        return 0
    else
        echo ""
        print_error "Linting failed!"
        return 1
    fi
}

run_all() {
    local exit_code=0
    
    print_header
    
    # Type check first
    if ! run_typecheck; then
        exit_code=1
    fi
    
    echo ""
    
    # Lint
    if ! run_lint; then
        exit_code=1
    fi
    
    echo ""
    
    # Unit tests
    if ! run_unit_tests; then
        exit_code=1
    fi
    
    echo ""
    
    # E2E tests
    if ! run_e2e_tests; then
        exit_code=1
    fi
    
    echo ""
    echo "═══════════════════════════════════════════════════"
    
    if [ $exit_code -eq 0 ]; then
        print_success "All tests passed! 🎉"
    else
        print_error "Some tests failed! 😢"
    fi
    
    echo "═══════════════════════════════════════════════════"
    
    return $exit_code
}

# Main
MODE=${1:-all}

case $MODE in
    unit|u)
        print_header
        run_unit_tests
        ;;
    e2e|e)
        print_header
        run_e2e_tests
        ;;
    coverage|c)
        print_header
        run_coverage
        ;;
    typecheck|t)
        print_header
        run_typecheck
        ;;
    lint|l)
        print_header
        run_lint
        ;;
    all|a|*)
        run_all
        ;;
esac
