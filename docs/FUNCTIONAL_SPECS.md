# Functional Specifications

## Project: Portfolio Website - Blazor Server Migration

**Version:** 1.0
**Date:** 2025-11-03
**Status:** Planning

---

## Table of Contents

1. [Overview](#overview)
2. [User Workflows](#user-workflows)
3. [Feature Specifications](#feature-specifications)
4. [UI/UX Requirements](#uiux-requirements)
5. [Validation Rules](#validation-rules)
6. [Error Handling](#error-handling)
7. [Success States](#success-states)
8. [Accessibility Requirements](#accessibility-requirements)
9. [Browser Compatibility](#browser-compatibility)
10. [Performance Requirements](#performance-requirements)

---

## 1. Overview

This document describes the functional behavior of the Portfolio Website Blazor Server application from a user's perspective. It details how features should work, what users see, and how the system responds to various inputs and actions.

---

## 2. User Workflows

### 2.1 Visitor Journey - Browsing Portfolio

**Scenario:** First-time visitor exploring the portfolio

**Steps:**
1. Visitor lands on homepage (hero section)
2. Sees site name "cpike.ca" prominently displayed
3. Notices scroll indicator arrow bouncing at bottom
4. Scrolls down or clicks arrow to view About section
5. Reads professional summary
6. Continues scrolling through Skills, Projects, Work sections
7. Sees smooth fade-in animations as sections appear
8. Navigation bar remains sticky at top
9. Active section is highlighted in navigation
10. On mobile, uses hamburger menu to jump between sections

**Expected Outcome:** Visitor gains understanding of professional background and skills

---

### 2.2 Visitor Journey - Submitting Contact Form

**Scenario:** Visitor wants to get in touch

**Steps:**
1. Visitor navigates to Contact section (via scroll or nav link)
2. Sees contact form with three fields: Name, Email, Message
3. Fills in name field
   - If invalid: sees error message below field
4. Fills in email field
   - If invalid format: sees "Invalid email format" error
5. Fills in message field
   - Character counter shows remaining characters (500 max)
   - If too short: sees "Message must be at least 10 characters" error
6. Clicks "Send Message" button
   - Button shows loading state ("Sending...")
   - Button is disabled during submission
7. On success:
   - Form is replaced with success message
   - Green checkmark icon appears with animation
   - "Thank You!" message displays
   - Confirmation text: "Your message has been sent successfully. I'll get back to you soon."
8. Form data is stored in database
9. Visitor cannot resubmit immediately (form cleared)

**Expected Outcome:** Message successfully submitted and visitor feels confident it was received

**Alternative Flow (Validation Errors):**
- If visitor clicks submit with empty fields: all required field errors show
- If visitor enters invalid email: email field shows error, form doesn't submit
- If message too long: character counter turns red, submission prevented

**Alternative Flow (Server Error):**
- If database error occurs: error message displays
- Form data is preserved
- Visitor can retry submission

---

### 2.3 Admin Journey - Viewing Contact Submissions

**Scenario:** Site owner checks new contact form submissions

**Steps:**
1. Admin navigates to `/admin` URL
2. If not logged in: redirected to `/admin/login`
3. Enters email and password
4. Clicks "Log In" button
5. On success: redirected to admin dashboard
6. Dashboard displays:
   - Total submissions count
   - Unread submissions count (highlighted)
   - List of recent submissions (newest first)
7. Each submission shows:
   - Name
   - Email
   - Submission date/time
   - Read/Unread status badge
8. Admin clicks on submission to view full message
9. Message displays in modal or expanded view
10. Admin sees full details:
    - Name
    - Email
    - Full message text
    - Submission timestamp
11. Admin can:
    - Mark as read/unread (toggle button)
    - Delete submission (with confirmation)

**Expected Outcome:** Admin successfully reviews contact submissions

**Alternative Flow (Invalid Login):**
- Wrong password: "Invalid email or password" error displays
- Account locked after 5 failed attempts
- Error message: "Account locked due to too many failed attempts. Try again in 15 minutes."

---

### 2.4 Admin Journey - Managing Submissions

**Scenario:** Admin marks submission as read and deletes old spam

**Steps:**
1. Admin is on dashboard viewing submissions
2. Clicks unread submission to view details
3. Submission automatically marked as read (or manual toggle)
4. Unread badge changes to "Read" badge
5. Unread count decreases by 1
6. Admin identifies spam submission
7. Clicks "Delete" button
8. Confirmation dialog appears:
   - "Are you sure you want to delete this submission?"
   - "Delete" and "Cancel" buttons
9. Admin clicks "Delete"
10. Submission removed from list
11. Success message: "Submission deleted successfully"
12. Total count decreases

**Expected Outcome:** Admin successfully manages and organizes submissions

**Alternative Flow (Cancel Delete):**
- Admin clicks "Cancel" in confirmation dialog
- Dialog closes, submission remains

---

## 3. Feature Specifications

### 3.1 Navigation System

#### Desktop Navigation
- **Location:** Sticky at top of page
- **Behavior:**
  - Remains visible while scrolling
  - Semi-transparent background with purple gradient line below
  - Links: Home, About, Skills, Projects, Work, Contact
  - If admin logged in: additional "Admin" link appears
- **Active State:**
  - Current section link is highlighted (lighter purple)
  - Underline animation appears below active link
- **Hover State:**
  - Link color changes to lighter purple
  - Underline animates from left to right
- **Click Behavior:**
  - Smooth scroll to target section
  - URL hash updates (#about, #skills, etc.)
  - No page reload

#### Mobile Navigation
- **Trigger:** Hamburger menu button in top-left
- **Header:**
  - Site name "cpike.ca" centered
  - Hamburger icon (three horizontal lines)
  - Sticky at top when scrolling
- **Menu Open State:**
  - Full-screen overlay appears (dark translucent)
  - Menu slides down from top
  - Menu items centered vertically and horizontally
  - Each item: large text (1.5rem), centered
  - Close button (X icon) in top-right
- **Menu Close:**
  - Clicking any menu item closes menu and scrolls to section
  - Clicking overlay closes menu
  - Clicking X button closes menu
  - Menu slides up out of view
- **Transition:** Smooth 300ms animation

---

### 3.2 Back to Top Button

- **Appearance Condition:** Visible after scrolling past hero section
- **Position:** Fixed bottom-right corner
- **Visual:**
  - Circular button with purple background
  - White upward arrow icon
  - Drop shadow
- **Behavior:**
  - Fades in when condition met
  - Fades out when at top of page
  - Hover: lifts slightly (translateY -3px)
  - Click: smooth scroll to top
- **Mobile Adjustments:**
  - Smaller size on mobile
  - Positioned to avoid blocking content

---

### 3.3 Hero Section

- **Content:**
  - Site name: "cpike.ca" in large thin font (5rem desktop, 2.5rem mobile)
  - Purple color matching design tokens
  - Centered horizontally and vertically
- **Scroll Indicator:**
  - Downward arrow icon at bottom center
  - Bouncing animation (continuous loop)
  - Clicking arrow scrolls to About section
  - Hover: arrow becomes fully opaque, color lightens

---

### 3.4 About Section

- **Layout:** Centered content, max-width 700px
- **Content:**
  - Section title: "About" with animated underline
  - Three paragraphs of professional summary
  - Text: 1.125rem, line-height 1.8
  - Color: light gray (#e0e0e0)
- **Animation:**
  - Section fades in when scrolling into view
  - Title underline animates from left to right
- **Mobile:** Same content, responsive text sizing

---

### 3.5 Skills Section

- **Layout:** Centered content, max-width 900px
- **Content:**
  - Section title: "Skills"
  - Introductory paragraph
  - Three skill groups:
    1. Core Technologies (7 items)
    2. Tools & Monitoring (4 items)
    3. Infrastructure (5 items)
- **Skill Group Display:**
  - Group title in purple, small-caps
  - Grid layout: auto-fit, min 140px per item
  - Each skill in bordered card
  - Gradient background
  - Hover effect: lift up, border glows, top line appears
- **Mobile:**
  - 2-column grid
  - Smaller text and padding

---

### 3.6 Projects Section

- **Layout:** Centered content, max-width 1000px
- **Content:**
  - Section title: "Projects"
  - Introductory paragraph
  - Grid of project cards (2 initially)
- **Project Card:**
  - Image (or placeholder with checkered pattern)
  - Project title
  - Description (2-3 sentences)
  - "View on GitHub →" link
- **Card Behavior:**
  - Hover: lifts up (-5px), border glows
  - Top gradient line appears
  - Title shifts right slightly
  - Arrow in link moves right
- **Mobile:**
  - Single column layout
  - Cards stack vertically

---

### 3.7 Work Section

- **Layout:** Centered content, max-width 800px
- **Content:**
  - Section title: "Work"
  - Role and date range subtitle
  - Four work highlight items:
    1. Application Modernization
    2. Enterprise Monitoring
    3. Manufacturing Integration
    4. Custom Applications
- **Work Item Display:**
  - Title in purple
  - Description paragraph
  - Rounded corners
  - Bottom border (purple, semi-transparent)
  - Hover: background color changes, lifts slightly
- **Mobile:** Same structure, responsive padding

---

### 3.8 Contact Form Section

#### Form Layout
- **Location:** Contact section of homepage
- **Visual Design:**
  - Centered, max-width 600px
  - Section title: "Contact"
  - Introductory text: "Looking to get in touch? Send me a message."
  - Three form fields vertically stacked
  - Submit button centered below fields

#### Form Fields

**Name Field:**
- Label: "Name"
- Input type: Text
- Placeholder: "Name"
- Required: Yes
- Max length: 100 characters
- Validation:
  - Required field error: "Name is required"
  - Max length error: "Name cannot exceed 100 characters"

**Email Field:**
- Label: "Email"
- Input type: Email
- Placeholder: "Email"
- Required: Yes
- Max length: 255 characters
- Validation:
  - Required field error: "Email is required"
  - Format error: "Invalid email format"
  - Max length error: "Email cannot exceed 255 characters"

**Message Field:**
- Label: "Message"
- Input type: Textarea
- Placeholder: "Message"
- Rows: 6
- Required: Yes
- Min length: 10 characters
- Max length: 500 characters
- Character counter displays below field
- Validation:
  - Required field error: "Message is required"
  - Min length error: "Message must be at least 10 characters"
  - Max length error: "Message cannot exceed 500 characters"

**Character Counter:**
- Format: "X characters remaining"
- Updates in real-time as user types
- Color states:
  - Normal: gray (#a0a0a0)
  - Warning (< 50 remaining): yellow
  - Limit reached (0 remaining): red

#### Submit Button
- Text: "Send Message" (idle)
- Text: "Sending..." (during submission)
- Style: Outlined button, purple border
- Hover: Filled purple background, white text, lifts up
- Disabled states:
  - During submission
  - If form has validation errors
- Loading indicator: Text changes, button disabled

#### Form Submission Flow

**Validation (Client-side):**
1. User fills form and clicks "Send Message"
2. Blazor DataAnnotations validation runs
3. If errors: error messages display below fields, red border on invalid fields
4. If valid: proceed to submission

**Submission Process:**
5. Submit button disabled
6. Button text changes to "Sending..."
7. Optional: Loading overlay appears over form
8. Form data sent to server
9. Server validates again (server-side validation)
10. Data saved to database with timestamp

**Success State:**
11. Form hidden
12. Success message appears with animation
13. Green checkmark icon (circular, gradient background)
14. "Thank You!" title
15. Confirmation message
16. Form resets in background (ready if user wants to send another)

**Error State:**
- If server error: error message banner appears above form
- Error text: "An error occurred. Please try again."
- Form remains filled
- Submit button re-enabled
- User can retry

#### Form Security
- All inputs sanitized server-side
- SQL injection prevention via EF Core
- XSS prevention (Blazor auto-escapes)
- Rate limiting: Optional future enhancement
- IP address and User-Agent captured server-side (not shown to user)

---

### 3.9 Admin Login

#### Login Page
- **URL:** `/admin/login`
- **Layout:** Centered form, max-width 400px
- **Content:**
  - Page title: "Admin Login"
  - Email field
  - Password field
  - "Log In" button
  - Error message area (hidden by default)

#### Fields
**Email:**
- Label: "Email"
- Input type: Email
- Required: Yes
- Autocomplete: email

**Password:**
- Label: "Password"
- Input type: Password
- Required: Yes
- Autocomplete: current-password

#### Login Button
- Text: "Log In"
- Full width
- Disabled during login attempt
- Loading state shows spinner

#### Login Flow
1. User enters email and password
2. Clicks "Log In"
3. Button shows loading state
4. Server validates credentials
5. If valid:
   - User authenticated
   - Session cookie created
   - Redirect to `/admin` dashboard
6. If invalid:
   - Error message: "Invalid email or password"
   - Form clears password field
   - Email field retains value
   - Focus returns to password field

#### Account Lockout
- After 5 failed attempts: account locked for 15 minutes
- Error message: "Account locked due to too many failed login attempts. Please try again in 15 minutes."
- Lockout timer resets after successful login or timeout

#### Security
- Password not visible (masked input)
- No password hints
- HTTPS enforced in production
- Secure cookie (HttpOnly, SameSite)

---

### 3.10 Admin Dashboard

#### Dashboard Layout
- **URL:** `/admin` (requires authentication)
- **Protection:** Redirects to login if not authenticated
- **Layout:**
  - Header with logout button
  - Statistics cards
  - Submissions list

#### Header
- Text: "Admin Dashboard"
- Logout button in top-right
- Clicking logout:
  - Clears session
  - Redirects to homepage

#### Statistics Section
- **Total Submissions Card:**
  - Label: "Total Submissions"
  - Count: Large number
  - Icon: Envelope
- **Unread Submissions Card:**
  - Label: "Unread"
  - Count: Large number (highlighted if > 0)
  - Color: Purple/accent when unread exist
  - Icon: Envelope with badge

#### Submissions List
- **Header:** "Recent Submissions"
- **Filter Options:**
  - All (default)
  - Unread only
  - Read only
- **Sort:** Most recent first (by SubmittedAt DESC)

#### Submission List Item
- **Display:**
  - Name (bold)
  - Email (smaller, gray)
  - Date/time (relative: "2 hours ago", "Yesterday", "Jan 5")
  - Message preview (first 100 chars with ellipsis)
  - Read/Unread badge
- **Layout:**
  - Card-style with border
  - Unread items have purple left border accent
  - Hover: background color changes
- **Click Behavior:**
  - Expands to show full message (or opens modal)

#### Submission Detail View

**Displayed Information:**
- Name
- Email (clickable mailto: link)
- Full message text
- Submitted date and time (full format)
- Read status badge

**Actions:**
- **Mark as Read/Unread Button:**
  - Toggle functionality
  - Updates in real-time
  - Badge changes immediately
  - Unread count updates
- **Delete Button:**
  - Red/danger color
  - Confirmation dialog required
  - Dialog text: "Are you sure you want to delete this submission from {Name}? This cannot be undone."
  - Buttons: "Cancel" (gray), "Delete" (red)
  - On confirm: submission deleted, list updates, success message appears

#### Empty States
- **No submissions:**
  - Message: "No contact submissions yet."
  - Icon: Empty inbox
- **No unread (when filtered):**
  - Message: "All caught up! No unread submissions."
  - Icon: Checkmark

---

## 4. UI/UX Requirements

### 4.1 Visual Design Consistency

- **Color Palette:** Match existing design tokens
  - Primary: #b741fe (purple)
  - Hover: #d680ff (lighter purple)
  - Background: #232933 (dark blue-gray)
  - Text: #e0e0e0 (light gray)
  - Borders: rgba(255, 255, 255, 0.1)

- **Typography:**
  - Font family: Inter (all weights)
  - Base size: 16px
  - Headings: Lighter weights (100-400)
  - Body: 400 weight
  - Nav: 500 weight, small-caps

- **Spacing:**
  - Consistent use of design tokens
  - Vertical rhythm maintained
  - Generous whitespace

### 4.2 Responsive Design

**Breakpoints:**
- Desktop: > 768px
- Tablet: 481px - 768px
- Mobile: ≤ 480px

**Mobile Adaptations:**
- Navigation: Hamburger menu
- Hero title: Smaller font (2.5rem)
- Sections: Reduced padding
- Skills grid: 2 columns
- Projects grid: 1 column
- Form: Full width
- Admin: Simplified dashboard layout

### 4.3 Animations & Transitions

**Scroll Animations:**
- Sections fade in when entering viewport
- Intersection Observer used for detection
- Timing: 0.8s ease-out
- Transform: translateY(30px) → translateY(0)

**Hover Effects:**
- Duration: 0.3s ease
- Cards: lift (-3px to -5px)
- Links: color change + underline animate
- Buttons: background fill + lift

**Loading States:**
- Spinner animations: smooth rotation
- Button state changes: text swap
- Overlays: fade in/out

**Page Transitions:**
- No hard reloads (SPA behavior)
- Smooth scrolling enabled
- SignalR reconnection: subtle indicator

### 4.4 Micro-interactions

- Character counter updates on keypress
- Form field focus: border color change
- Submit button: disabled state during processing
- Success checkmark: pop animation (scale 0 → 1.1 → 1)
- Scroll indicator: continuous bounce
- Back to top: fade in/out based on scroll position

---

## 5. Validation Rules

### 5.1 Contact Form Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| Name | Required | "Name is required" |
| Name | Max 100 chars | "Name cannot exceed 100 characters" |
| Email | Required | "Email is required" |
| Email | Valid format | "Invalid email format" |
| Email | Max 255 chars | "Email cannot exceed 255 characters" |
| Message | Required | "Message is required" |
| Message | Min 10 chars | "Message must be at least 10 characters" |
| Message | Max 500 chars | "Message cannot exceed 500 characters" |

**Validation Timing:**
- On blur (field loses focus)
- On submit attempt
- Real-time for character counter

### 5.2 Login Form Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| Email | Required | "Email is required" |
| Email | Valid format | "Invalid email format" |
| Password | Required | "Password is required" |
| Credentials | Valid combo | "Invalid email or password" |

### 5.3 Server-side Validation

All client-side validations are **re-validated server-side** to prevent tampering.

Additional server-side checks:
- Input sanitization
- Maximum request size
- Rate limiting (future)

---

## 6. Error Handling

### 6.1 User-facing Errors

**Form Validation Errors:**
- Display: Below field, red text
- Icon: Optional warning icon
- Behavior: Appears on validation failure, disappears when corrected

**Submission Errors:**
- Display: Banner above form, red background
- Message: Generic user-friendly text
- Details: Logged server-side for debugging
- Example: "An error occurred while submitting your message. Please try again."

**Login Errors:**
- Display: Below login button, red text
- Messages:
  - "Invalid email or password"
  - "Account locked. Try again in X minutes."
- Behavior: Clears on next attempt

**Database Errors:**
- User sees: "A technical error occurred. Please try again later."
- Admin sees (in logs): Full error details
- No sensitive information exposed to user

**SignalR Disconnection:**
- Automatic reconnection attempted
- If reconnection fails: message appears
- "Connection lost. Attempting to reconnect..."
- Reconnect button available

### 6.2 Error Logging

All errors logged with Serilog:
- Error level: LogError with exception
- Context: User ID (if authenticated), timestamp, request path
- Structured data: All relevant parameters
- No sensitive data in logs (passwords, tokens)

---

## 7. Success States

### 7.1 Form Submission Success

**Visual Feedback:**
1. Form container fades out
2. Success state fades in
3. Checkmark icon animates (pop effect)
4. Success message displays

**Content:**
- Icon: Green checkmark in purple gradient circle
- Title: "Thank You!"
- Message: "Your message has been sent successfully. I'll get back to you soon."

**Behavior:**
- Success state remains visible
- No automatic redirect
- User can navigate away
- Form data cleared in background

### 7.2 Admin Action Success

**Mark as Read:**
- Badge updates immediately
- Unread count decreases
- Subtle confirmation (toast notification or inline message)

**Delete Submission:**
- Item removed from list with fade-out animation
- Success message: "Submission deleted successfully"
- List re-numbers if applicable

**Login Success:**
- Immediate redirect to dashboard
- No success message needed (redirect is confirmation)

---

## 8. Accessibility Requirements

### 8.1 Keyboard Navigation

- **Tab Order:** Logical flow through interactive elements
- **Focus Indicators:** Visible outline on focused elements
- **Skip Links:** "Skip to main content" link for screen readers
- **Form Navigation:**
  - Tab through fields in order
  - Enter to submit form
  - Escape to close modals/menus

### 8.2 Screen Reader Support

- **Semantic HTML:** Proper heading hierarchy (h1 → h2 → h3)
- **ARIA Labels:**
  - `aria-label` on icon buttons
  - `aria-required` on required fields
  - `aria-invalid` on fields with errors
  - `aria-live` for dynamic content (form errors, success messages)
- **Alt Text:** All images have descriptive alt attributes
- **Form Labels:** All inputs have associated label elements

### 8.3 Color Contrast

- **WCAG 2.1 Level AA Compliance:**
  - Body text: 4.5:1 contrast ratio minimum
  - Large text: 3:1 contrast ratio minimum
- **Current Colors:**
  - Text (#e0e0e0) on background (#232933): ✓ Passes
  - Primary (#b741fe) on background: Check needed

### 8.4 Motion & Animation

- **Reduced Motion:** Respect `prefers-reduced-motion` media query
- If user prefers reduced motion:
  - Disable scroll animations
  - Disable hover lift effects
  - Keep essential transitions only

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. Browser Compatibility

### 9.1 Supported Browsers

| Browser | Version | Support Level |
|---------|---------|---------------|
| Chrome | Latest 2 versions | Full |
| Firefox | Latest 2 versions | Full |
| Safari | Latest 2 versions | Full |
| Edge | Latest 2 versions | Full |
| Mobile Safari | iOS 14+ | Full |
| Chrome Android | Latest | Full |

### 9.2 Graceful Degradation

- **No JavaScript:** Site should display content (limited interactivity)
- **Older Browsers:** Basic layout maintained, some effects may not work
- **SignalR Fallback:** If WebSocket fails, fallback to long polling

---

## 10. Performance Requirements

### 10.1 Load Time Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| First Contentful Paint | < 1.5s | Lighthouse |
| Time to Interactive | < 3s | Lighthouse |
| Largest Contentful Paint | < 2.5s | Lighthouse |
| Total Page Load | < 2s | Network tab |

### 10.2 Performance Optimizations

**Images:**
- Lazy loading on project images
- Optimized formats (WebP with fallbacks)
- Appropriate sizing (no oversized images)

**CSS/JS:**
- Minification in production
- CSS scoped to components where possible
- Minimal JavaScript (mostly Blazor-generated)

**Fonts:**
- Preconnect to Google Fonts
- Font-display: swap
- Load only needed weights

**Blazor Specific:**
- Prerendering enabled for faster initial load
- Component caching where appropriate
- Lazy loading for admin components

### 10.3 Database Performance

- Indexed columns: `SubmittedAt`, `IsRead`
- AsNoTracking() for read-only queries
- Pagination if submission list exceeds 50 items
- Query execution time: < 100ms for list queries

---

## Appendix A: User Acceptance Criteria Checklist

### Visitor Features

- [ ] Portfolio sections display correctly on desktop
- [ ] Portfolio sections display correctly on mobile
- [ ] Navigation works on desktop
- [ ] Hamburger menu works on mobile
- [ ] Scroll animations trigger correctly
- [ ] Back to top button appears and functions
- [ ] Contact form accepts valid input
- [ ] Contact form rejects invalid input with clear errors
- [ ] Form submission shows loading state
- [ ] Successful submission shows success message
- [ ] Form clears after successful submission

### Admin Features

- [ ] Login page accessible at /admin/login
- [ ] Invalid credentials show error message
- [ ] Valid credentials grant access to dashboard
- [ ] Dashboard shows accurate submission counts
- [ ] Submissions list displays all entries
- [ ] Submission detail shows full information
- [ ] Mark as read/unread functionality works
- [ ] Delete submission works with confirmation
- [ ] Logout functionality works
- [ ] Unauthorized users cannot access admin pages

### Accessibility

- [ ] All interactive elements keyboard accessible
- [ ] Screen reader can navigate site
- [ ] Color contrast meets WCAG AA standards
- [ ] Form errors announced to screen readers
- [ ] Reduced motion preference respected

### Performance

- [ ] Initial page load under 2 seconds
- [ ] No layout shift during load
- [ ] Smooth 60fps animations
- [ ] Form submission completes in under 1 second

---

**Document Version History**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-03 | cpike | Initial functional specifications |
