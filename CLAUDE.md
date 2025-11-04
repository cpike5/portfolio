# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website currently undergoing migration from a static HTML/CSS/JS site to a Blazor Server application. The project maintains both versions:

- **Static Site (index.html)**: Original production portfolio with vanilla HTML, CSS, and JavaScript
- **Blazor Application (src/Portfolio.Web)**: New .NET-based server-side application with authentication, database integration, and dynamic features

The site uses a minimalist design with a purple/pink color scheme and smooth scroll animations. Migration is following a phased approach (see [Migration Status](#migration-status)).

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
│   ├── prototypes/         # Reusable UI components
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── tabs.html
│   │   ├── auth.css
│   │   ├── auth.js
│   │   ├── tabs.css
│   │   └── tabs.js
│   └── components/         # Standalone component showcase (18+ demos)
│       ├── index.html      # Component gallery
│       ├── button.html
│       ├── card.html
│       ├── text-input.html
│       ├── text-area.html
│       ├── contact-form.html
│       ├── form-overlay.html
│       ├── form-message.html
│       ├── navigation-bar.html
│       ├── mobile-navigation.html
│       ├── hero-section.html
│       ├── page-section.html
│       ├── section-title.html
│       ├── skills-grid.html
│       ├── projects-grid.html
│       ├── back-to-top.html
│       ├── loading-spinner.html
│       └── components.css  # Shared component styles
│
├── src/                    # Blazor Server application (Phase 1.1+)
│   └── Portfolio.Web/
│       ├── Components/     # Blazor components
│       │   ├── App.razor
│       │   ├── Routes.razor
│       │   ├── _Imports.razor
│       │   ├── Layout/     # Layout components
│       │   │   ├── MainLayout.razor
│       │   │   ├── NavMenu.razor
│       │   │   ├── DesktopNav.razor
│       │   │   ├── MobileNav.razor
│       │   │   ├── MobileHeader.razor
│       │   │   ├── BackToTop.razor
│       │   │   └── Footer.razor
│       │   ├── Pages/      # Page components (routable)
│       │   │   ├── Home.razor
│       │   │   ├── Auth.razor
│       │   │   └── Error.razor
│       │   ├── Shared/     # Reusable section components
│       │   │   ├── HeroSection.razor
│       │   │   ├── AboutSection.razor
│       │   │   ├── SkillsSection.razor
│       │   │   ├── SkillGroup.razor
│       │   │   ├── ProjectsSection.razor
│       │   │   ├── ProjectCard.razor
│       │   │   ├── WorkSection.razor
│       │   │   ├── WorkItem.razor
│       │   │   └── ContactSection.razor
│       │   └── Account/    # ASP.NET Identity authentication
│       │       ├── Pages/  # Auth pages (Login, Register, etc.)
│       │       └── Shared/ # Auth components
│       ├── Data/           # EF Core DbContext and models
│       │   ├── ApplicationDbContext.cs
│       │   ├── ApplicationUser.cs
│       │   └── Migrations/ # Database migrations
│       ├── wwwroot/        # Static web assets
│       │   ├── app.css     # Blazor-specific styles
│       │   ├── favicon.png
│       │   ├── css/        # Stylesheets (tokens.css, styles.css)
│       │   ├── js/         # JavaScript files (script.js)
│       │   └── assets/     # Images and media
│       ├── Properties/
│       │   └── launchSettings.json
│       ├── appsettings.json
│       ├── appsettings.Development.json
│       ├── Program.cs
│       └── Portfolio.Web.csproj
│
├── docs/                   # Project documentation
│   ├── prd.md              # Product Requirements Document
│   ├── tech-specs.md       # Technical specifications
│   ├── functional-specs.md # Functional specifications
│   ├── implementation-plan.md # Migration implementation plan
│   ├── user-stories.md     # User stories and requirements
│   ├── blazor-components.md # Blazor component specifications
│   └── design-guidelines.md # Design system guidelines
│
├── infra/                  # Infrastructure and deployment notes (gitignored)
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
- **preview/components/** - Standalone component showcase with 18+ interactive demos

**Blazor Application (src/Portfolio.Web):**
- **Components/Layout/** - Layout components (MainLayout, navigation, footer)
- **Components/Pages/** - Routable pages (Home, Auth, Error)
- **Components/Shared/** - Reusable portfolio sections (Hero, About, Skills, Projects, Work, Contact)
- **Components/Account/** - ASP.NET Identity authentication system
- **Data/** - Entity Framework Core DbContext, models, and migrations
- **wwwroot/** - Static assets (CSS, JS, images)

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

**Static HTML Site:**
1. **Production Version**: Open [index.html](index.html) directly in a browser
2. **Preview Version**: Open [preview/index.html](preview/index.html) for mobile-responsive version
3. **Blog Prototype**: Open [preview/blog/index.html](preview/blog/index.html)
4. **Component Showcase**: Open [preview/components/index.html](preview/components/index.html)
5. **Design Standards**: Open [preview/design-standards.html](preview/design-standards.html)
6. Use a local server (e.g., `python -m http.server` or VS Code Live Server) for full functionality

**Blazor Application:**
```bash
cd src/Portfolio.Web
dotnet restore           # Restore dependencies
dotnet build             # Build the project
dotnet run               # Run the application (https://localhost:5001)
dotnet watch             # Run with hot reload
```

Access the Blazor app at `https://localhost:5001` (or the URL shown in the terminal).

### Making Changes

**Static Site - Style Changes:**
- Modify design tokens in [tokens.css](tokens.css) to affect site-wide appearance
- Edit component-specific styles in [styles.css](styles.css)
- Blog-specific styles are in [preview/blog/blog-styles.css](preview/blog/blog-styles.css)
- Prototype-specific styles are in their respective directories

**Static Site - Content Changes:**
- Production portfolio: Update [index.html](index.html)
- Preview portfolio: Update [preview/index.html](preview/index.html)
- Blog content: Update [preview/blog/index.html](preview/blog/index.html) or [preview/blog/post.html](preview/blog/post.html)

**Static Site - Behavior Changes:**
- Core functionality: Modify [script.js](script.js)
- Blog functionality: Modify [preview/blog/blog-script.js](preview/blog/blog-script.js)
- Prototype functionality: Each prototype has its own JS file

**Blazor Application - Making Changes:**
- **Components**: Edit .razor files in `src/Portfolio.Web/Components/`
- **Styles**: Update CSS files in `src/Portfolio.Web/wwwroot/css/` (tokens.css, styles.css)
- **JavaScript**: Modify files in `src/Portfolio.Web/wwwroot/js/`
- **Database**: Modify models in `Data/`, then run migrations:
  ```bash
  dotnet ef migrations add MigrationName
  dotnet ef database update
  ```
- **Configuration**: Update `appsettings.json` or `appsettings.Development.json`

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

## Migration Status

The project is undergoing a phased migration from static HTML to Blazor Server. See [docs/implementation-plan.md](docs/implementation-plan.md) for full details.

### Phase 1: Foundation Setup (COMPLETED ✅)
- **Phase 1.1**: Blazor Server project initialization with ASP.NET Identity
- **Phase 1.2**: Asset migration (CSS, JavaScript, images to wwwroot)
- **Phase 1.3**: Layout components (MainLayout, Navigation, Footer, BackToTop)
- **Phase 1.4**: Portfolio content implementation with reusable section components

**Completed Components:**
- ✅ Project structure and configuration
- ✅ Layout system (MainLayout, DesktopNav, MobileNav, MobileHeader, Footer, BackToTop)
- ✅ Section components (HeroSection, AboutSection, SkillsSection, ProjectsSection, WorkSection, ContactSection)
- ✅ Reusable components (SkillGroup, WorkItem, ProjectCard)
- ✅ Home page with all portfolio sections
- ✅ ASP.NET Identity authentication system
- ✅ Database setup with SQLite

**Next Phases:**
- **Phase 2**: Database & Contact Form (contact submissions, admin dashboard)
- **Phase 3**: Admin Features (content management, analytics)
- **Phase 4**: Polish & Deploy (testing, optimization, production deployment)

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
- **Component Showcase** (components/) - 18+ standalone component demos with interactive examples
- **Design Standards** (design-standards.html) - Interactive design system documentation

**Blazor Application (src/Portfolio.Web):**
- **Status**: Phase 1 Complete - Foundation ready for Phase 2 development
- **Features**:
  - Complete portfolio content (Hero, About, Skills, Projects, Work, Contact)
  - Responsive navigation (desktop and mobile)
  - ASP.NET Identity authentication (login, register, account management)
  - SQLite database with Entity Framework Core
  - Modular component architecture
- **Tech Stack**: .NET 8, Blazor Server, Entity Framework Core, SQLite, Bootstrap
- **Database**: SQLite (local development), migrations tracked in Data/Migrations/

**Infrastructure:**
- Deployment script for automated server updates
- Server configuration notes in infra/ directory
- Git-based workflow with feature branches
