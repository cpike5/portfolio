# Design and Styling Guidelines

This document defines the design system and styling standards for the portfolio Blazor application, based on the existing HTML/CSS implementation.

## Design Tokens

All design tokens are defined in `tokens.css` and should be referenced using CSS custom properties.

### Color Palette

```css
--color-background: #232933       /* Dark gray background */
--color-primary: #b741fe          /* Purple primary */
--color-primary-hover: #d680ff    /* Lighter purple for hover states */
--color-primary-dark: #9c1fe0     /* Darker purple variant */
--color-accent-pink: #fb4a8b      /* Pink accent (future use) */
--color-accent-blue: #0d5596      /* Blue accent (future use) */
--color-text: #e0e0e0             /* Light gray text */
--color-text-light: #a0a0a0       /* Muted text */
--color-heading: #ffffff          /* White headings */
--color-surface: #2d3440          /* Elevated surface */
--color-border: rgba(255, 255, 255, 0.1)  /* Subtle borders */
```

**Usage Patterns:**
- Primary action elements use `--color-primary`
- Hover states use `--color-primary-hover`
- Body text uses `--color-text`
- Borders and dividers use variations of purple with transparency

### Typography

**Font Family:**
```css
--font-family-base: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif
--font-family-display: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif
```

**Font Sizes:**
```css
--font-size-base: 16px
--font-size-nav: 0.95rem
--font-size-hero: 5rem             /* Responsive: 3.5rem @ 768px, 2.5rem @ 480px */
--font-size-section-title: 2.5rem /* Responsive: 2rem @ 768px, 1.75rem @ 480px */
--font-size-work-title: 1.5rem
--font-size-body: 1.125rem
```

**Font Weights:**
```css
--font-weight-nav: 500
--font-weight-hero: 100            /* Ultra-light for dramatic effect */
--font-weight-section-title: 300   /* Light */
--font-weight-work-title: 400      /* Regular */
```

**Typography Rules:**
- Hero title: Ultra-light (100), large size, primary color
- Section titles: Light (300), small-caps variant, primary color, animated underline
- Navigation: Medium (500), small-caps variant, letter-spacing 0.05em
- Body text: Regular (400), line-height 1.8, text color with slight opacity

### Spacing

```css
--spacing-xs: 0.5rem
--spacing-sm: 0.75rem
--spacing-md: 1rem
--spacing-lg: 1.5rem
--spacing-xl: 2rem
--spacing-2xl: 3rem
--spacing-3xl: 4rem
--spacing-nav-vertical: 2rem
--spacing-nav-horizontal: 2rem
```

**Content Padding:**
- Sections: 4rem vertical, 2rem horizontal (desktop)
- Sections: 3rem vertical, 1.5rem horizontal @ 768px
- Sections: 2.5rem vertical, 1rem horizontal @ 480px

**Max Widths:**
- About/Contact content: 700px
- Skills content: 900px
- Work content: 800px
- Projects content: 1000px

### Borders and Shadows

```css
--border-radius-sm: 4px
--border-radius-md: 8px
--border-radius-lg: 12px

--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3)
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.4)
```

**Border Patterns:**
- Standard border: `1px solid rgba(183, 65, 254, 0.2)`
- Hover border: `1px solid var(--color-primary)`
- Decorative gradients: `linear-gradient(to right, transparent, var(--color-primary), transparent)`

### Transitions

```css
--transition-base: 0.3s ease
```

**Common Animations:**
- Hover states: 0.3s ease
- Fade-in: 0.8s ease-out (opacity and transform)
- Underline animation: 0.8s cubic-bezier(0.4, 0, 0.2, 1)
- Mobile menu slide: 0.3s ease

## Component Design Patterns

### Navigation

**Desktop Navigation:**
- Sticky position at top
- Horizontal centered layout with 3rem gap
- Small-caps font variant
- Underline animation on hover (bottom -4px, expands from 0 to 100% width)
- Active state indicated by color and full underline
- Gradient separator below navbar

**Mobile Navigation:**
- Hamburger button triggers full-screen slide-down menu
- Overlay with blur backdrop (rgba(0, 0, 0, 0.6) + 4px blur)
- Menu slides from top (transform: translateY(-100%) to translateY(0))
- Centered vertical navigation links
- Large touch targets (1.25rem padding)
- Active state with background color and underline

### Cards

**Project Cards:**
- Gradient background: `linear-gradient(135deg, rgba(183, 65, 254, 0.02), rgba(183, 65, 254, 0.05))`
- Border: `1px solid rgba(183, 65, 254, 0.2)`
- Border radius: 8px
- Top gradient accent (3px height, appears on hover)
- Hover effects:
  - Transform: translateY(-5px)
  - Border color changes to solid primary
  - Background gradient intensifies
  - Title shifts right (translateX(5px))

**Skill Items:**
- Similar card pattern with lighter gradient
- Grid layout: auto-fit, minmax(140px, 1fr)
- Top gradient accent (2px height)
- Hover: translateY(-3px)

### Buttons

**Primary Button Pattern (Contact Form):**
- Transparent background
- 2px solid border in primary color
- Small-caps font variant
- Padding: 1rem 2.5rem
- Border radius: 4px
- Min-width: 200px
- Hover: Fills with primary color, text becomes background color
- Active: Removes translateY
- Disabled: 60% opacity, no cursor

**Icon Button Pattern (Back to Top):**
- Fixed position: bottom 2rem, right 2rem
- Circular: 48px × 48px
- Solid primary background
- CSS-drawn arrow icon (12px × 12px rotated border)
- Hover: Darker primary, translateY(-3px)
- Fade in/out with visibility toggle

### Forms

**Input Fields:**
- Background: `rgba(255, 255, 255, 0.05)`
- Border: `1px solid rgba(183, 65, 254, 0.2)`
- Border radius: 4px
- Padding: 1rem 1.25rem
- Focus state:
  - Border color: primary
  - Background: `rgba(255, 255, 255, 0.08)`
  - No outline
- Error state:
  - Border: red
  - Background: `rgba(239, 68, 68, 0.05)`
- Success state:
  - Border: green

**Labels:**
- Small size: 0.875rem
- Medium weight: 500
- Primary color
- Letter-spacing: 0.02em

**Validation:**
- Real-time validation on blur
- Clear validation on focus
- Error messages: 0.8rem, red color, fade in/out
- Character counter for textarea (color changes at thresholds)

### Sections

**Full-Height Sections:**
- min-height: 100vh (desktop)
- min-height: auto (mobile)
- Centered content with flexbox
- Vertical and horizontal padding

**Section Titles:**
- Small-caps variant
- Letter-spacing: 0.08em
- Lowercase text-transform
- Animated underline effect (expands from 0 to 100% on scroll into view)
- Gradient underline: 2px height, positioned -8px below text

### Scroll Animations

**Fade-In Pattern:**
```css
.fade-in {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.fade-in-visible {
    opacity: 1;
    transform: translateY(0);
}
```

**Intersection Observer Settings:**
- Navigation tracking: rootMargin '-20% 0px -70% 0px'
- Fade-in elements: threshold 0.1
- Section titles: threshold 0.5

## Responsive Breakpoints

### Tablet (max-width: 768px)
- Show mobile header, hide desktop navbar
- Hero title: 3.5rem
- Section title: 2rem
- Section padding: 3rem vertical, 1.5rem horizontal
- Project grid: single column
- Skills grid: 2 columns
- Back-to-top button: 44px × 44px

### Mobile (max-width: 480px)
- Hero title: 2.5rem
- Section title: 1.75rem
- Section padding: 2.5rem vertical, 1rem horizontal
- Skills grid: 2 columns
- Form inputs: reduced padding (0.875rem 1rem)
- Back-to-top button: 40px × 40px

## Accessibility Guidelines

**Keyboard Navigation:**
- All interactive elements must be keyboard accessible
- Focus states clearly visible
- Logical tab order

**ARIA Labels:**
- Buttons with icons only require aria-label
- Form inputs use aria-invalid for validation state
- Dynamic content changes announced to screen readers

**Color Contrast:**
- Text on background meets WCAG AA standards
- Primary purple (#b741fe) on dark background has sufficient contrast
- Error states use high-contrast red

**Semantic HTML:**
- Use proper heading hierarchy (h1, h2, h3)
- Use semantic elements (nav, main, section, footer)
- Forms properly labeled

## Animation Performance

**GPU-Accelerated Properties:**
- Use transform and opacity for animations
- Avoid animating layout properties (width, height, padding)

**Reduced Motion:**
Consider adding media query for users who prefer reduced motion:
```css
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

## Design Philosophy

**Minimalism:**
- Clean, uncluttered layouts
- Ample white space
- Focus on content
- Subtle decorative elements

**Consistency:**
- Reuse design tokens across all components
- Consistent hover/focus states
- Uniform spacing rhythm
- Predictable interaction patterns

**Progressive Enhancement:**
- Mobile-first responsive design
- Graceful degradation of animations
- Core functionality works without JavaScript

**Performance:**
- Lightweight CSS (no frameworks)
- Minimal external dependencies
- Efficient animations
- Fast page loads
