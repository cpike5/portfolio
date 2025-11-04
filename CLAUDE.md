# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website built with vanilla HTML, CSS, and JavaScript. It's a static site showcasing professional experience, skills, and projects. The site uses a minimalist design with a purple/pink color scheme and smooth scroll animations.

## Architecture

### Directory Structure

```
portfolio/
├── index.html              # Production portfolio page
├── styles.css              # Shared component styles
├── tokens.css              # Design system tokens (colors, typography, spacing)
├── script.js               # Shared JavaScript functionality
├── index.reference.html    # Reference backup
│
├── preview/                # Experimental mobile-responsive versions
│   ├── index.html          # Mobile-responsive portfolio with hamburger nav
│   ├── design-standards.html
│   ├── blog/               # Blog prototype
│   │   ├── index.html      # Blog listing page
│   │   ├── post.html       # Individual post template
│   │   ├── blog-styles.css
│   │   ├── blog-script.js
│   │   └── post-script.js
│   └── prototypes/         # Reusable UI components
│       ├── login.html
│       ├── register.html
│       ├── tabs.html
│       ├── auth.css
│       ├── auth.js
│       ├── tabs.css
│       └── tabs.js
│
├── src/                    # Blazor Server application (Phase 1.1+)
│   └── Portfolio.Web/
│       ├── Components/     # Blazor components
│       ├── Data/           # EF Core DbContext and models
│       ├── wwwroot/        # Static web assets
│       │   ├── app.css
│       │   ├── css/        # Stylesheets
│       │   ├── js/         # JavaScript files
│       │   ├── assets/     # Images and media
│       │   └── lib/        # Third-party libraries (Bootstrap)
│       ├── Program.cs
│       └── Portfolio.Web.csproj
│
├── docs/                   # Project documentation
│   ├── PRD.md
│   ├── TECH_SPECS.md
│   ├── FUNCTIONAL_SPECS.md
│   ├── IMPLEMENTATION_PLAN.md
│   └── USER_STORIES.md
│
├── infra/                  # Infrastructure and deployment notes
│   ├── cpike.ca.txt
│   ├── elisamtg.ca.txt
│   └── webdock.txt
│
├── assets/                 # Project assets
│   └── preview.png
│
├── deploy.sh               # Automated deployment script
├── CLAUDE.md               # AI assistant guidance
└── README.md               # Project overview
```

### File Structure

**Core Files (Production):**
- **index.html** - Main portfolio page with all sections (hero, about, skills, projects, work, contact)
- **styles.css** - All component styles and layouts
- **tokens.css** - CSS custom properties for design tokens (colors, typography, spacing, transitions)
- **script.js** - JavaScript functionality (active nav state, back-to-top button, scroll animations)

**Preview Directory (Mobile-Responsive Enhanced Version):**
- **preview/index.html** - Mobile-responsive portfolio with hamburger menu navigation
- **preview/design-standards.html** - Interactive design system documentation
- **preview/blog/** - Blog prototype with listing (index.html) and post template (post.html)
- **preview/prototypes/** - Reusable UI component prototypes (login, register, tabs)

**Deployment:**
- **deploy.sh** - Automated deployment script for web server
- **infra/** - Deployment configuration notes and server documentation

### Design System

The site uses a centralized design token system in [tokens.css](tokens.css):
- Color palette with primary purple (#b741fe) and hover states
- Typography scale with Inter font family
- Spacing and transition values

All components reference these tokens via CSS custom properties (e.g., `var(--color-primary)`).

### Key Features

**Core Portfolio (index.html):**
- Sticky navigation with active state tracking
- Smooth scroll behavior between sections
- Intersection Observer-based scroll animations
- "Back to Top" button that appears after scrolling past hero
- Responsive design with mobile breakpoints (768px, 480px)
- Contact form (UI only - no backend)

**Preview Version (preview/index.html):**
- Mobile-first responsive design with hamburger menu
- Slide-out navigation drawer with overlay
- Enhanced mobile header with site branding
- All core features plus mobile-optimized navigation
- Links to blog and design standards pages

## Development Workflow

### Testing/Previewing

Since this is a static site with no build process:
1. **Production Version**: Open [index.html](index.html) directly in a browser
2. **Preview Version**: Open [preview/index.html](preview/index.html) for mobile-responsive version
3. **Blog Prototype**: Open [preview/blog/index.html](preview/blog/index.html)
4. **Design Standards**: Open [preview/design-standards.html](preview/design-standards.html)
5. Use a local server (e.g., `python -m http.server` or VS Code Live Server) for full functionality

### Making Changes

**Style Changes:**
- Modify design tokens in [tokens.css](tokens.css) to affect site-wide appearance across all pages
- Edit component-specific styles in [styles.css](styles.css) (shared by both versions)
- Blog-specific styles are in [preview/blog/blog-styles.css](preview/blog/blog-styles.css)
- Prototype-specific styles are in their respective directories

**Content Changes:**
- Production portfolio: Update [index.html](index.html)
- Preview portfolio: Update [preview/index.html](preview/index.html)
- Blog content: Update [preview/blog/index.html](preview/blog/index.html) or [preview/blog/post.html](preview/blog/post.html)

**Behavior Changes:**
- Core functionality: Modify [script.js](script.js) (shared by both versions)
- Blog functionality: Modify [preview/blog/blog-script.js](preview/blog/blog-script.js)
- Prototype functionality: Each prototype has its own JS file

### Design Philosophy

- Keep it simple and minimalist
- Work incrementally with user feedback
- Don't invent content - build what's requested
- Build one component at a time
- Maintain separation: tokens in tokens.css, functionality in script.js
- Shared assets (tokens.css, styles.css, script.js) are used by both production and preview versions
- Preview directory is for experimentation and mobile enhancements

### Deployment

The project uses [deploy.sh](deploy.sh) for automated deployment:

**Script Actions:**
1. Pulls latest changes from git
2. Copies all portfolio files to the web server directory
3. Removes markdown files from the deployed version

**Configuration:**
- `PORTFOLIO_DIR`: Local repository path (default: `/home/admin/workspace/portfolio`)
- `WEB_DIR`: Web server document root (default: `/var/www/cpike.ca`)
- Must be run with sudo privileges

**Usage:**
```bash
sudo ./deploy.sh
```

The entire project (including preview directory) is deployed, making all pages accessible on the web server.

## Current State

**Production Portfolio (index.html):**
- Hero section with site name
- About section with professional summary
- Skills section organized into groups (Core Technologies, Tools & Monitoring, Infrastructure)
- Projects section with card layout (placeholders for screenshots)
- Work section with experience highlights
- Contact section with form
- Footer with copyright and GitHub link

**Preview Directory (preview/):**
- **Mobile-Responsive Portfolio** (index.html) - Enhanced version with mobile navigation
- **Blog Prototype** (blog/) - Complete blog system with:
  - Blog listing page with post cards
  - Individual post template
  - Blog-specific styling and functionality
- **UI Prototypes** (prototypes/) - Reusable components:
  - Login form
  - Registration form
  - Tabs component
- **Design Standards** (design-standards.html) - Interactive design system documentation

**Infrastructure:**
- Deployment script for automated server updates
- Server configuration notes in infra/ directory
