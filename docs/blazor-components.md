# Blazor Component List

This document outlines the core UI/UX components needed for the Blazor portfolio implementation. Components are kept minimal and focused on reusability.

## Core Layout Components

### 1. NavigationBar
**Purpose:** Desktop sticky navigation with active state tracking
**Features:**
- Horizontal centered navigation links
- Active state based on current section/route
- Smooth scroll behavior
- Gradient separator decoration

**Props:**
- `NavItems` - List of navigation items (text, href/route)
- `ActiveRoute` - Current active route/section

**Styling:** [styles.css:230-296](styles.css#L230-L296)

---

### 2. MobileNavigation
**Purpose:** Mobile hamburger menu with full-screen overlay
**Features:**
- Hamburger button toggle
- Slide-down full-screen menu
- Backdrop overlay with blur
- Large touch-friendly targets
- Auto-close on navigation

**Props:**
- `NavItems` - List of navigation items
- `IsOpen` - Controls menu visibility
- `OnToggle` - Callback for open/close

**Styling:** [styles.css:19-229](styles.css#L19-L229)

---

### 3. PageSection
**Purpose:** Container for full-height page sections with consistent spacing
**Features:**
- Centered content layout
- Configurable max-width
- Responsive padding
- Optional fade-in animation
- Section ID for navigation anchors

**Props:**
- `Id` - Section identifier for navigation
- `MaxWidth` - Content max-width (e.g., "700px", "900px")
- `CssClass` - Additional CSS classes
- `EnableFadeIn` - Toggle scroll animation

**Styling:** [styles.css:297-300](styles.css#L297-L300), section-specific styles

---

### 4. SectionTitle
**Purpose:** Consistent section heading with animated underline
**Features:**
- Small-caps styling
- Gradient underline animation on scroll
- Primary color theme
- Automatic Intersection Observer integration

**Props:**
- `Title` - Section title text
- `EnableAnimation` - Toggle underline animation

**Styling:** [styles.css:371-397](styles.css#L371-L397)

---

## Interactive Components

### 5. Card
**Purpose:** Reusable card container for projects, skills, work items
**Features:**
- Gradient background
- Top accent border (appears on hover)
- Hover elevation effect
- Configurable layout (flex direction)

**Variants:**
- `ProjectCard` - With image, title, description, link
- `SkillCard` - Minimal with centered text
- `WorkCard` - Title and description with hover effect

**Props:**
- `Variant` - "project" | "skill" | "work"
- `Content` - Card content (slot/render fragment)
- `OnClick` - Optional click handler

**Styling:** [styles.css:536-670](styles.css#L536-L670) (project), [styles.css:463-502](styles.css#L463-L502) (skill)

---

### 6. Button
**Purpose:** Primary button with consistent styling
**Features:**
- Outlined variant (transparent with border)
- Filled variant (on hover)
- Small-caps text
- Loading state
- Disabled state

**Props:**
- `Text` - Button text
- `Type` - "button" | "submit"
- `IsLoading` - Show loading spinner
- `IsDisabled` - Disabled state
- `OnClick` - Click handler

**Styling:** [styles.css:904-974](styles.css#L904-L974)

---

### 7. BackToTop
**Purpose:** Floating button to scroll to top of page
**Features:**
- Fixed position (bottom-right)
- Fade in/out based on scroll position
- CSS-drawn arrow icon
- Smooth scroll behavior

**Props:**
- `ScrollThreshold` - Pixels scrolled before showing

**Styling:** [styles.css:1120-1158](styles.css#L1120-L1158)

---

## Form Components

### 8. TextInput
**Purpose:** Form input with validation states
**Features:**
- Label and input pairing
- Real-time validation
- Error message display
- Success/error visual states
- Accessible (aria-invalid, proper labels)

**Props:**
- `Id` - Input identifier
- `Label` - Input label text
- `Type` - "text" | "email"
- `Placeholder` - Placeholder text
- `Value` - Bound value
- `OnChange` - Value change handler
- `OnBlur` - Blur handler for validation
- `ErrorMessage` - Validation error text
- `IsValid` - Validation state

**Styling:** [styles.css:809-878](styles.css#L809-L878)

---

### 9. TextArea
**Purpose:** Multi-line text input with character counter
**Features:**
- Resizable textarea
- Character counter
- Visual feedback at threshold limits
- Validation states

**Props:**
- `Id` - Input identifier
- `Label` - Input label text
- `Placeholder` - Placeholder text
- `Value` - Bound value
- `MaxLength` - Character limit
- `OnChange` - Value change handler
- `OnBlur` - Blur handler
- `ErrorMessage` - Validation error text
- `IsValid` - Validation state

**Styling:** [styles.css:858-903](styles.css#L858-L903)

---

### 10. FormMessage
**Purpose:** Success/error message display for forms
**Features:**
- Success and error variants
- Fade in/out animation
- Auto-dismiss (optional)

**Props:**
- `Message` - Message text
- `Type` - "success" | "error"
- `IsVisible` - Controls visibility
- `AutoDismiss` - Auto-hide after timeout

**Styling:** [styles.css:762-791](styles.css#L762-L791)

---

## Grid Components

### 11. SkillsGrid
**Purpose:** Responsive grid for skill items
**Features:**
- Auto-fit grid layout
- Responsive columns (4 → 2 → 2 on breakpoints)
- Skill groups with titles

**Props:**
- `SkillGroups` - Array of skill groups (title, items)

**Styling:** [styles.css:436-502](styles.css#L436-L502)

---

### 12. ProjectsGrid
**Purpose:** Responsive grid for project cards
**Features:**
- Auto-fit grid layout (min 300px)
- Responsive columns (multi → 1)
- Image placeholders

**Props:**
- `Projects` - Array of project data

**Styling:** [styles.css:529-535](styles.css#L529-L535)

---

## Utility Components

### 13. LoadingSpinner
**Purpose:** Reusable loading indicator
**Features:**
- Circular spinner animation
- Configurable size
- Used in buttons and overlays

**Props:**
- `Size` - "sm" | "md" | "lg"
- `Color` - Spinner color (defaults to primary)

**Styling:** [styles.css:942-974](styles.css#L942-L974), [styles.css:1001-1014](styles.css#L1001-L1014)

---

### 14. FormOverlay
**Purpose:** Full-page overlay for form submission states
**Features:**
- Backdrop blur
- Loading spinner
- Status text
- Fade in/out

**Props:**
- `IsVisible` - Controls visibility
- `Message` - Status message text

**Styling:** [styles.css:976-1023](styles.css#L976-L1023)

---

## Composite Components

### 15. ContactForm
**Purpose:** Complete contact form with validation
**Features:**
- Name, email, message inputs
- Real-time validation
- Character counter
- Loading state
- Success state
- Form overlay during submission

**Props:**
- `OnSubmit` - Submit handler
- `IsSubmitting` - Loading state
- `SubmitSuccess` - Success state

**Styling:** [styles.css:727-1087](styles.css#L727-L1087)

---

### 16. HeroSection
**Purpose:** Landing hero section with title and scroll indicator
**Features:**
- Full viewport height
- Centered title
- Animated scroll arrow
- Ultra-light typography

**Props:**
- `Title` - Hero title text
- `ScrollTarget` - Anchor to scroll to

**Styling:** [styles.css:302-355](styles.css#L302-L355)

---

## Component Organization

```
/Components
  /Layout
    - NavigationBar.razor
    - MobileNavigation.razor
    - PageSection.razor
    - Footer.razor
  /UI
    - Button.razor
    - Card.razor
    - SectionTitle.razor
    - BackToTop.razor
    - LoadingSpinner.razor
  /Forms
    - TextInput.razor
    - TextArea.razor
    - FormMessage.razor
    - FormOverlay.razor
  /Sections
    - HeroSection.razor
    - ContactForm.razor
    - SkillsGrid.razor
    - ProjectsGrid.razor
```

## Implementation Notes

**Blazor Specifics:**
- Use `@code` blocks for component state and logic
- Use `EventCallback<T>` for component events
- Use `RenderFragment` for child content slots
- Use `CascadingParameter` for theme/layout context
- Use `IJSRuntime` for Intersection Observer APIs

**JavaScript Interop Needed:**
- Scroll animations (Intersection Observer)
- Smooth scroll behavior
- Active navigation tracking
- Mobile menu body scroll lock

**CSS Isolation:**
- Consider scoped CSS for component-specific styles
- Keep design tokens in global `tokens.css`
- Share common patterns in global `styles.css`
- Use scoped CSS for component variations

## Priority for Phase 1

**Essential (MVP):**
1. NavigationBar
2. MobileNavigation
3. PageSection
4. SectionTitle
5. HeroSection
6. Card (basic variant)

**Phase 2:**
7. Button
8. BackToTop
9. SkillsGrid
10. ProjectsGrid

**Phase 3:**
11. TextInput
12. TextArea
13. FormMessage
14. ContactForm
15. LoadingSpinner
16. FormOverlay
