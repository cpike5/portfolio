# Portfolio Website

A personal portfolio website currently undergoing migration from a static HTML/CSS/JS site to a Blazor Server application. The project maintains both versions during the transition:

- **Static Site**: Original production portfolio with vanilla HTML, CSS, and JavaScript
- **Blazor App**: New .NET-based application with authentication, database integration, and dynamic features

The site features a minimalist design with a purple/pink color scheme and smooth scroll animations.

## Features

### Static Site Features
- **Responsive Design** - Fully responsive layout that works on desktop, tablet, and mobile devices
- **Smooth Animations** - Intersection Observer-based scroll animations for engaging user experience
- **Active Navigation** - Sticky navigation bar with active section tracking
- **Design Token System** - Centralized design tokens for consistent theming
- **Back to Top Button** - Convenient navigation for long pages
- **Contact Form** - Clean contact form interface (frontend only)

### Blazor Application Features (Phase 1 Complete)
- **Server-Side Rendering** - Fast, secure Blazor Server architecture
- **User Authentication** - ASP.NET Identity with login, registration, and account management
- **Database Integration** - Entity Framework Core with SQLite
- **Component Architecture** - Modular, reusable Razor components
- **Responsive Navigation** - Desktop and mobile-optimized navigation components
- **Design Consistency** - Shares design tokens and styles with static site

## Tech Stack

### Static Site
- HTML5
- CSS3 (Custom Properties/CSS Variables)
- Vanilla JavaScript (ES6+)
- No build tools required

### Blazor Application
- **.NET 8** - Latest .NET framework
- **Blazor Server** - Server-side rendering with SignalR
- **ASP.NET Core Identity** - Authentication and authorization
- **Entity Framework Core** - ORM for database access
- **SQLite** - Lightweight database (development)
- **Bootstrap 5** - UI framework

## Getting Started

### Prerequisites

**For Static Site:**
- Modern web browser
- (Optional) Local web server for best experience

**For Blazor Application:**
- [.NET 8 SDK](https://dotnet.microsoft.com/download) or later
- Code editor (VS Code, Visual Studio, or Rider recommended)

### Running the Static Site

**Option 1: Direct File Opening**
```bash
# Simply open index.html in your browser
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

**Option 2: Local Server (Recommended)**
```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using VS Code Live Server extension
# Right-click index.html and select "Open with Live Server"
```

Then navigate to `http://localhost:8000` in your browser.

### Running the Blazor Application

```bash
# Navigate to the Blazor project directory
cd src/Portfolio.Web

# Restore dependencies (first time only)
dotnet restore

# Run the application
dotnet run

# OR run with hot reload (recommended for development)
dotnet watch
```

The application will be available at `https://localhost:5001` (or the URL shown in the terminal).

**Note:** The first run may take longer as it restores packages and builds the project.

## Project Structure

```
portfolio/
├── index.html              # Production static portfolio page
├── styles.css              # Shared component styles
├── tokens.css              # Design system tokens
├── script.js               # Shared JavaScript functionality
├── index.reference.html    # Reference backup
│
├── preview/                # Experimental versions and prototypes
│   ├── index.html          # Mobile-responsive portfolio
│   ├── design-standards.html
│   ├── blog/               # Blog prototype
│   │   ├── index.html
│   │   ├── post.html
│   │   ├── blog-styles.css
│   │   ├── blog-script.js
│   │   └── post-script.js
│   ├── prototypes/         # UI component prototypes
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── tabs.html
│   │   └── *.css, *.js
│   └── components/         # Component showcase (18+ demos)
│       ├── index.html
│       ├── button.html
│       ├── card.html
│       └── ... (more component demos)
│
├── src/                    # Blazor Server application
│   └── Portfolio.Web/
│       ├── Components/     # Blazor components
│       │   ├── Layout/     # Layout components
│       │   ├── Pages/      # Routable pages
│       │   ├── Shared/     # Reusable sections
│       │   └── Account/    # Authentication
│       ├── Data/           # EF Core DbContext and models
│       ├── wwwroot/        # Static web assets
│       │   ├── css/        # Stylesheets
│       │   ├── js/         # JavaScript files
│       │   └── assets/     # Images and media
│       ├── Program.cs
│       ├── appsettings.json
│       └── Portfolio.Web.csproj
│
├── docs/                   # Project documentation
│   ├── prd.md
│   ├── tech-specs.md
│   ├── functional-specs.md
│   ├── implementation-plan.md
│   ├── user-stories.md
│   ├── blazor-components.md
│   └── design-guidelines.md
│
├── assets/                 # Project assets
├── deploy.sh               # Deployment script
├── CLAUDE.md               # AI assistant guidance
└── README.md               # This file
```

## Migration Status

The project is undergoing a phased migration from static HTML to Blazor Server. See [docs/implementation-plan.md](docs/implementation-plan.md) for details.

**Phase 1: Foundation Setup** ✅ **COMPLETE**
- Blazor Server project initialization
- Asset migration and layout components
- Portfolio content implementation
- ASP.NET Identity authentication

**Next Phases:**
- Phase 2: Database & Contact Form
- Phase 3: Admin Features
- Phase 4: Polish & Deploy

## Design System

The site uses a centralized design token system defined in [tokens.css](tokens.css):

- **Colors** - Primary purple (#b741fe) with complementary hover states
- **Typography** - Inter font family with responsive sizing
- **Spacing** - Consistent spacing scale
- **Transitions** - Smooth animation timings

All components reference these tokens via CSS custom properties (e.g., `var(--color-primary)`).

## Sections

- **Hero** - Landing section with site introduction
- **About** - Professional summary and background
- **Skills** - Organized skill groups (Core Technologies, Tools & Monitoring, Infrastructure)
- **Projects** - Project showcase with card layout
- **Work** - Professional experience highlights
- **Contact** - Contact form for reaching out
- **Footer** - Copyright and social links

## Development

### Static Site Customization

**Updating Colors:**
Edit the color tokens in [tokens.css](tokens.css):
```css
:root {
  --color-primary: #b741fe;
  /* ... other tokens */
}
```

**Modifying Content:**
Update section content directly in [index.html](index.html).

**Changing Behavior:**
Modify JavaScript functionality in [script.js](script.js).

### Blazor Application Development

**Modifying Components:**
```bash
# Edit Razor components
src/Portfolio.Web/Components/Pages/Home.razor
src/Portfolio.Web/Components/Shared/HeroSection.razor
# ... etc
```

**Updating Styles:**
```bash
# Shared design tokens
src/Portfolio.Web/wwwroot/css/tokens.css

# Component styles
src/Portfolio.Web/wwwroot/css/styles.css

# Blazor-specific styles
src/Portfolio.Web/wwwroot/app.css
```

**Database Changes:**
```bash
cd src/Portfolio.Web

# Add migration
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update

# Remove last migration (if needed)
dotnet ef migrations remove
```

**Running Tests:**
```bash
cd src/Portfolio.Web
dotnet test
```

## Deployment

### Static Site Deployment

The project includes a deployment script ([deploy.sh](deploy.sh)) for automated deployment to a web server.

**Usage:**
```bash
sudo ./deploy.sh
```

The script:
1. Updates the local repository from git
2. Copies portfolio files to the web directory
3. Removes markdown files from the deployed version

**Configuration:**
Edit the script variables to match your environment:
- `PORTFOLIO_DIR` - Local repository path
- `WEB_DIR` - Web server document root

### Blazor Application Deployment

For deploying the Blazor Server application:

**Development:**
```bash
cd src/Portfolio.Web
dotnet run
```

**Production:**
```bash
cd src/Portfolio.Web
dotnet publish -c Release -o ./publish
```

The published files in `./publish` can be deployed to:
- IIS (Windows)
- Nginx/Apache with Kestrel (Linux)
- Docker containers
- Azure App Service
- Other .NET hosting platforms

**Note:** Update `appsettings.json` for production (connection strings, logging, etc.)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Documentation

Detailed project documentation is available in the [docs/](docs/) directory:

- **[prd.md](docs/prd.md)** - Product Requirements Document
- **[tech-specs.md](docs/tech-specs.md)** - Technical specifications and architecture
- **[functional-specs.md](docs/functional-specs.md)** - Functional specifications
- **[implementation-plan.md](docs/implementation-plan.md)** - Migration implementation plan
- **[user-stories.md](docs/user-stories.md)** - User stories and requirements
- **[blazor-components.md](docs/blazor-components.md)** - Blazor component specifications
- **[design-guidelines.md](docs/design-guidelines.md)** - Design system guidelines
- **[CLAUDE.md](CLAUDE.md)** - AI assistant guidance for development

## License

This is a personal portfolio project. Feel free to use it as inspiration for your own portfolio.

## Contact

For questions or feedback, use the contact form on the website or reach out via GitHub.
