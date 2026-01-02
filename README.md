# Portfolio Website

A personal portfolio website built with plain HTML, CSS, and JavaScript. The site features a minimalist design with a purple/pink color scheme and smooth scroll animations.

## Features

- **Responsive Design** - Fully responsive layout that works on desktop, tablet, and mobile devices
- **Smooth Animations** - Intersection Observer-based scroll animations for engaging user experience
- **Active Navigation** - Sticky navigation bar with active section tracking
- **Design Token System** - Centralized design tokens for consistent theming
- **Back to Top Button** - Convenient navigation for long pages
- **Contact Form** - Clean contact form interface (frontend only)

## Tech Stack

- HTML5
- CSS3 (Custom Properties/CSS Variables)
- Vanilla JavaScript (ES6+)
- No build tools required

## Getting Started

### Prerequisites

- Modern web browser
- (Optional) Local web server for best experience

### Running the Site

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

## Project Structure

```
portfolio/
├── index.html              # Production portfolio page
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
├── docs/                   # Project documentation
│   ├── prd.md
│   ├── functional-specs.md
│   ├── user-stories.md
│   └── design-guidelines.md
│
├── assets/                 # Project assets
├── deploy.sh               # Deployment script
├── CLAUDE.md               # AI assistant guidance
└── README.md               # This file
```

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

### Customization

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

## Deployment

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

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Documentation

Detailed project documentation is available in the [docs/](docs/) directory:

- **[prd.md](docs/prd.md)** - Product Requirements Document
- **[functional-specs.md](docs/functional-specs.md)** - Functional specifications
- **[user-stories.md](docs/user-stories.md)** - User stories and requirements
- **[design-guidelines.md](docs/design-guidelines.md)** - Design system guidelines
- **[CLAUDE.md](CLAUDE.md)** - AI assistant guidance for development

## License

This is a personal portfolio project. Feel free to use it as inspiration for your own portfolio.

## Contact

For questions or feedback, use the contact form on the website or reach out via GitHub.
