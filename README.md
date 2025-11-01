# Portfolio Website

A minimalist personal portfolio website showcasing professional experience, skills, and projects. Built with vanilla HTML, CSS, and JavaScript for simplicity and performance.

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
- No frameworks or build tools required

## Getting Started

### Viewing the Site

Since this is a static site with no build process, you can view it in several ways:

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
.
├── index.html      # Main HTML file with all sections
├── styles.css      # Component styles and layouts
├── tokens.css      # Design tokens (colors, typography, spacing)
├── script.js       # JavaScript functionality
└── README.md       # This file
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

## Customization

### Updating Colors
Edit the color tokens in [tokens.css](tokens.css):
```css
:root {
  --color-primary: #b741fe;
  /* ... other tokens */
}
```

### Modifying Content
Update section content directly in [index.html](index.html).

### Changing Behavior
Modify JavaScript functionality in [script.js](script.js).

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This is a personal portfolio project. Feel free to use it as inspiration for your own portfolio.

## Contact

For questions or feedback, use the contact form on the website or reach out via GitHub.
