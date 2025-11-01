# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website built with vanilla HTML, CSS, and JavaScript. It's a static site showcasing professional experience, skills, and projects. The site uses a minimalist design with a purple/pink color scheme and smooth scroll animations.

## Architecture

### File Structure

- **index.html** - Main portfolio page with all sections (hero, about, skills, projects, work, contact)
- **styles.css** - All component styles and layouts
- **tokens.css** - CSS custom properties for design tokens (colors, typography, spacing, transitions)
- **script.js** - JavaScript functionality (active nav state, back-to-top button, scroll animations)

### Design System

The site uses a centralized design token system in [tokens.css](tokens.css):
- Color palette with primary purple (#b741fe) and hover states
- Typography scale with Inter font family
- Spacing and transition values

All components reference these tokens via CSS custom properties (e.g., `var(--color-primary)`).

### Key Features

- Sticky navigation with active state tracking
- Smooth scroll behavior between sections
- Intersection Observer-based scroll animations
- "Back to Top" button that appears after scrolling past hero
- Responsive design with mobile breakpoints (768px, 480px)
- Contact form (UI only - no backend)

## Development Workflow

### Testing/Previewing

Since this is a static site with no build process:
1. Open [index.html](index.html) directly in a browser
2. Use a local server (e.g., `python -m http.server` or VS Code Live Server) for full functionality

### Making Changes

**Style Changes:**
- Modify design tokens in [tokens.css](tokens.css) to affect site-wide appearance
- Edit component-specific styles in [styles.css](styles.css)

**Content Changes:**
- Update section content directly in [index.html](index.html)

**Behavior Changes:**
- Modify JavaScript in [script.js](script.js)

### Design Philosophy

- Keep it simple and minimalist
- Work incrementally with user feedback
- Don't invent content - build what's requested
- Build one component at a time
- Maintain separation: tokens in tokens.css, functionality in script.js

## Current State

The portfolio includes:
- Hero section with site name
- About section with professional summary
- Skills section organized into groups (Core Technologies, Tools & Monitoring, Infrastructure)
- Projects section with card layout (placeholders for screenshots)
- Work section with experience highlights
- Contact section with form
- Footer with copyright and GitHub link
