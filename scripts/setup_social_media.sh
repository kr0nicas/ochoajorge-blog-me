#!/bin/bash

# =============================================================================
# SOCIAL MEDIA PUBLISHER - SETUP AND VALIDATION SCRIPT
# =============================================================================
# This script helps set up and validate the social media publisher
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Main setup function
main() {
    echo -e "${BLUE}"
    echo "============================================================================"
    echo "  Social Media Publisher - Setup and Validation"
    echo "============================================================================"
    echo -e "${NC}"
    
    # Check if we're in the scripts directory
    if [[ ! -f "social_media_publisher.py" ]]; then
        print_error "Please run this script from the scripts directory"
        echo "Expected location: ~/workspace-blog/scripts"
        exit 1
    fi
    
    print_info "Step 1: Checking Python installation..."
    if command -v python3 &> /dev/null; then
        PYTHON_VERSION=$(python3 --version)
        print_success "Python found: $PYTHON_VERSION"
        
        # Check Python version (need 3.9+)
        PYTHON_MAJOR=$(python3 -c 'import sys; print(sys.version_info.major)')
        PYTHON_MINOR=$(python3 -c 'import sys; print(sys.version_info.minor)')
        
        if [[ $PYTHON_MAJOR -lt 3 ]] || [[ $PYTHON_MAJOR -eq 3 && $PYTHON_MINOR -lt 9 ]]; then
            print_error "Python 3.9+ required. Found: $PYTHON_VERSION"
            exit 1
        fi
    else
        print_error "Python 3 not found. Please install Python 3.9+"
        exit 1
    fi
    
    print_info "Step 2: Checking virtual environment..."
    if [[ ! -d "venv" ]]; then
        print_warning "Virtual environment not found. Creating..."
        python3 -m venv venv
        print_success "Virtual environment created"
    else
        print_success "Virtual environment exists"
    fi
    
    print_info "Step 3: Activating virtual environment..."
    source venv/bin/activate
    print_success "Virtual environment activated"
    
    print_info "Step 4: Installing dependencies..."
    if [[ -f "requirements.txt" ]]; then
        pip install -q -r requirements.txt
        print_success "Dependencies installed"
    else
        print_error "requirements.txt not found"
        exit 1
    fi
    
    print_info "Step 5: Checking .env file..."
    if [[ ! -f ".env" ]]; then
        if [[ -f ".env.example" ]]; then
            print_warning ".env file not found. Creating from .env.example..."
            cp .env.example .env
            print_warning "Please edit .env and add your API credentials"
            print_warning "Run: nano .env"
        else
            print_error ".env.example not found"
            exit 1
        fi
    else
        print_success ".env file exists"
    fi
    
    print_info "Step 6: Creating log directory..."
    mkdir -p ~/.hermes/logs
    print_success "Log directory ready: ~/.hermes/logs"
    
    print_info "Step 7: Loading environment variables..."
    if [[ -f ".env" ]]; then
        export $(cat .env | grep -v '^#' | xargs)
        print_success "Environment variables loaded"
    fi
    
    print_info "Step 8: Checking environment variables..."
    python3 social_media_publisher.py --check-env
    
    if [[ $? -eq 0 ]]; then
        print_success "All environment variables are set"
    else
        print_warning "Some environment variables are missing"
        print_warning "Please edit .env file and add missing credentials"
    fi
    
    print_info "Step 9: Testing script functionality..."
    python3 social_media_publisher.py --list-posts
    
    if [[ $? -eq 0 ]]; then
        print_success "Script can read blog posts"
    else
        print_warning "Script had issues reading blog posts"
    fi
    
    print_info "Step 10: Testing dry run..."
    python3 social_media_publisher.py --dry-run
    
    if [[ $? -eq 0 ]]; then
        print_success "Dry run completed successfully"
    else
        print_warning "Dry run had some issues"
    fi
    
    echo ""
    echo -e "${BLUE}"
    echo "============================================================================"
    echo "  Setup Complete!"
    echo "============================================================================"
    echo -e "${NC}"
    
    print_info "Next steps:"
    echo "  1. Edit .env and add your API credentials"
    echo "  2. Run: python3 social_media_publisher.py --check-env"
    echo "  3. Test with dry run: python3 social_media_publisher.py --dry-run"
    echo "  4. Publish specific post: python3 social_media_publisher.py --post-slug your-post"
    echo "  5. Setup cron job: See README_SOCIAL_MEDIA.md for instructions"
    echo ""
    
    print_info "Useful commands:"
    echo "  - List posts:         python3 social_media_publisher.py --list-posts"
    echo "  - Check env vars:     python3 social_media_publisher.py --check-env"
    echo "  - Dry run:            python3 social_media_publisher.py --dry-run"
    echo "  - Publish all:        python3 social_media_publisher.py"
    echo "  - View logs:          tail -f ~/.hermes/logs/social_media_publisher.log"
    echo ""
}

# Run main function
main