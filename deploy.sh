#!/bin/bash

# Portfolio Deployment Script
# This script updates the portfolio from git and deploys it to the web server

set -e  # Exit on error

# Configuration variables
PORTFOLIO_DIR="/home/admin/workspace/portfolio"
WEB_DIR="/var/www/cpike.ca"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root or with sudo"
    exit 1
fi

echo "Starting portfolio deployment..."

# Navigate to portfolio directory
echo "Navigating to $PORTFOLIO_DIR..."
cd "$PORTFOLIO_DIR"

# Update from git
echo "Fetching and pulling latest changes..."
git fetch
git pull

# Remove existing web content
echo "Removing existing content from $WEB_DIR..."
rm -rf "$WEB_DIR"/*

# Copy portfolio to web directory
echo "Copying portfolio files to $WEB_DIR..."
cp -r "$PORTFOLIO_DIR"/* "$WEB_DIR"/

# Remove markdown files from web directory
echo "Removing .md files from web directory..."
find "$WEB_DIR" -type f -name "*.md" -delete

echo "Deployment complete!"
echo "Portfolio deployed from $PORTFOLIO_DIR to $WEB_DIR"
