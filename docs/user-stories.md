# User Stories

## Project: Portfolio Website - Blazor Server Migration

**Version:** 1.0
**Date:** 2025-11-03
**Status:** Planning

---

## Overview

This document outlines user stories for the portfolio website Blazor Server migration. Stories are organized by user type and prioritized using MoSCoW method (Must Have, Should Have, Could Have, Won't Have).

---

## User Types

### 1. Visitor (Public User)
Anonymous users browsing the portfolio website to learn about professional experience and projects.

### 2. Site Owner (Admin)
Authenticated administrator managing contact submissions and site content.

---

## Phase 1: Must Have (MVP)

### Visitor Stories

#### VS-001: View Portfolio Home Page
**As a** visitor
**I want to** view a professional portfolio home page
**So that** I can learn about the site owner's experience and skills

**Acceptance Criteria:**
- [ ] Hero section displays site name
- [ ] Navigation menu is visible and functional
- [ ] All sections are accessible via smooth scrolling
- [ ] Page is responsive on mobile, tablet, and desktop
- [ ] Design matches existing portfolio aesthetic

**Priority:** Must Have
**Story Points:** 5

---

#### VS-002: Navigate Portfolio Sections
**As a** visitor
**I want to** navigate between different portfolio sections
**So that** I can easily find the information I'm interested in

**Acceptance Criteria:**
- [ ] Clicking nav links scrolls to corresponding section
- [ ] Active section is highlighted in navigation
- [ ] Mobile hamburger menu works correctly
- [ ] Back to top button appears after scrolling
- [ ] Smooth scroll animations work

**Priority:** Must Have
**Story Points:** 3

---

#### VS-003: View About Section
**As a** visitor
**I want to** read about the site owner's background
**So that** I can understand their professional experience

**Acceptance Criteria:**
- [ ] About section displays professional summary
- [ ] Text is readable and well-formatted
- [ ] Section title animates on scroll
- [ ] Content matches existing portfolio

**Priority:** Must Have
**Story Points:** 2

---

#### VS-004: View Skills
**As a** visitor
**I want to** see a list of technical skills organized by category
**So that** I can understand the site owner's technical expertise

**Acceptance Criteria:**
- [ ] Skills are grouped (Core Technologies, Tools & Monitoring, Infrastructure)
- [ ] Each skill displays in a card with hover effect
- [ ] Grid layout adapts to screen size
- [ ] All current skills are displayed

**Priority:** Must Have
**Story Points:** 3

---

#### VS-005: View Projects
**As a** visitor
**I want to** see showcase projects with descriptions
**So that** I can understand the type of work the site owner has done

**Acceptance Criteria:**
- [ ] Projects display in card grid layout
- [ ] Each project shows title, description, and GitHub link
- [ ] Project images display (or placeholder)
- [ ] Cards have hover effects
- [ ] Links open in new tab

**Priority:** Must Have
**Story Points:** 3

---

#### VS-006: View Work Experience
**As a** visitor
**I want to** read about professional work experience
**So that** I can understand the site owner's career history

**Acceptance Criteria:**
- [ ] Work section displays role and date range
- [ ] Multiple work highlights are shown
- [ ] Each item has title and description
- [ ] Content is formatted and readable

**Priority:** Must Have
**Story Points:** 2

---

#### VS-007: Submit Contact Form
**As a** visitor
**I want to** submit a contact form with my information
**So that** I can reach out to the site owner

**Acceptance Criteria:**
- [ ] Form has fields for name, email, and message
- [ ] All fields are required and validated
- [ ] Email format is validated
- [ ] Character limit (500) enforced on message
- [ ] Character counter displays remaining characters
- [ ] Submit button is disabled during submission
- [ ] Success message displays after submission
- [ ] Form clears after successful submission
- [ ] Error messages display for validation failures

**Priority:** Must Have
**Story Points:** 8

---

#### VS-008: Receive Form Submission Feedback
**As a** visitor
**I want to** receive immediate feedback after submitting the contact form
**So that** I know my message was received

**Acceptance Criteria:**
- [ ] Success message displays with confirmation
- [ ] Success icon/animation appears
- [ ] Clear message that owner will respond soon
- [ ] Form cannot be resubmitted immediately (cooldown or disable)

**Priority:** Must Have
**Story Points:** 3

---

#### VS-009: View Mobile Navigation
**As a** visitor on mobile
**I want to** access navigation via hamburger menu
**So that** I can navigate the site on small screens

**Acceptance Criteria:**
- [ ] Hamburger icon visible on mobile
- [ ] Menu slides down when opened
- [ ] Overlay appears behind menu
- [ ] Menu closes when link clicked
- [ ] Menu closes when overlay clicked
- [ ] Close button works correctly

**Priority:** Must Have
**Story Points:** 5

---

### Admin Stories

#### AS-001: Log In to Admin Area
**As a** site owner
**I want to** log in with my credentials
**So that** I can access protected admin features

**Acceptance Criteria:**
- [ ] Login page with email and password fields
- [ ] Validation on required fields
- [ ] Error message for invalid credentials
- [ ] Redirect to admin dashboard after successful login
- [ ] Session persists across page refreshes
- [ ] Logout functionality available

**Priority:** Must Have
**Story Points:** 5

---

## Phase 2: Should Have

### Admin Stories

#### AS-002: View Contact Submissions
**As a** site owner
**I want to** view all contact form submissions in a list
**So that** I can review inquiries from visitors

**Acceptance Criteria:**
- [ ] Admin dashboard displays all submissions
- [ ] List shows name, email, date, and read status
- [ ] Most recent submissions appear first
- [ ] Submission count displays
- [ ] Unread submissions are highlighted
- [ ] Clicking submission shows full message

**Priority:** Should Have
**Story Points:** 8

---

#### AS-003: Mark Submissions as Read
**As a** site owner
**I want to** mark contact submissions as read or unread
**So that** I can track which inquiries I've addressed

**Acceptance Criteria:**
- [ ] Toggle button to mark as read/unread
- [ ] Visual indicator shows read status
- [ ] Status persists in database
- [ ] Unread count updates in UI

**Priority:** Should Have
**Story Points:** 3

---

#### AS-004: Delete Contact Submissions
**As a** site owner
**I want to** delete contact submissions
**So that** I can remove spam or old inquiries

**Acceptance Criteria:**
- [ ] Delete button on each submission
- [ ] Confirmation dialog before deletion
- [ ] Submission removed from database
- [ ] List updates after deletion
- [ ] Cannot undo deletion (hard delete)

**Priority:** Should Have
**Story Points:** 3

---

#### AS-005: Search Contact Submissions
**As a** site owner
**I want to** search submissions by name, email, or message content
**So that** I can quickly find specific inquiries

**Acceptance Criteria:**
- [ ] Search input field in admin dashboard
- [ ] Real-time filtering as user types
- [ ] Search matches name, email, and message
- [ ] Clear search button
- [ ] Search results count displays

**Priority:** Should Have
**Story Points:** 5

---

#### AS-006: Filter Submissions by Status
**As a** site owner
**I want to** filter submissions by read/unread status
**So that** I can focus on new inquiries

**Acceptance Criteria:**
- [ ] Filter dropdown (All, Read, Unread)
- [ ] List updates based on selected filter
- [ ] Filter selection persists during session
- [ ] Count displays for each filter option

**Priority:** Should Have
**Story Points:** 3

---

## Phase 3: Could Have (Future Enhancements)

### Admin Stories

#### AS-007: Receive Email Notifications
**As a** site owner
**I want to** receive email notifications for new contact submissions
**So that** I can respond quickly without checking the admin dashboard

**Acceptance Criteria:**
- [ ] Email sent when new submission received
- [ ] Email includes sender name, email, and message preview
- [ ] Link to admin dashboard in email
- [ ] Email sending can be toggled in settings
- [ ] Email template is professional and branded

**Priority:** Could Have
**Story Points:** 8

---

#### AS-008: Export Submissions
**As a** site owner
**I want to** export contact submissions to CSV
**So that** I can analyze inquiries or backup data

**Acceptance Criteria:**
- [ ] Export button in admin dashboard
- [ ] CSV includes all submission fields
- [ ] Filename includes date of export
- [ ] Downloads directly to browser

**Priority:** Could Have
**Story Points:** 5

---

#### AS-009: Manage Portfolio Content
**As a** site owner
**I want to** edit portfolio content via admin interface
**So that** I can update my portfolio without editing code

**Acceptance Criteria:**
- [ ] Admin section for content management
- [ ] Edit about section text
- [ ] Add/edit/delete skills
- [ ] Add/edit/delete projects
- [ ] Add/edit/delete work experience
- [ ] Changes reflect immediately on public site
- [ ] Changes persist in database

**Priority:** Could Have
**Story Points:** 21

---

#### AS-010: Upload Project Images
**As a** site owner
**I want to** upload images for my projects
**So that** I can showcase visual examples of my work

**Acceptance Criteria:**
- [ ] Image upload field in project management
- [ ] Validation for file type and size
- [ ] Images stored in appropriate location
- [ ] Thumbnails generated automatically
- [ ] Old images deleted when replaced

**Priority:** Could Have
**Story Points:** 8

---

#### AS-011: View Analytics Dashboard
**As a** site owner
**I want to** view site analytics
**So that** I can understand visitor engagement

**Acceptance Criteria:**
- [ ] Dashboard shows page views
- [ ] Submission count over time chart
- [ ] Most viewed sections
- [ ] Traffic sources (if available)
- [ ] Date range filter

**Priority:** Could Have
**Story Points:** 13

---

### Visitor Stories

#### VS-010: Read Blog Posts
**As a** visitor
**I want to** read blog posts
**So that** I can learn from the site owner's insights and experiences

**Acceptance Criteria:**
- [ ] Blog listing page with post previews
- [ ] Individual post pages with full content
- [ ] Posts sorted by date (newest first)
- [ ] Post metadata (date, read time)
- [ ] Responsive design maintained

**Priority:** Could Have
**Story Points:** 13

---

#### VS-011: Filter Projects by Technology
**As a** visitor
**I want to** filter projects by technology or category
**So that** I can find projects relevant to my interests

**Acceptance Criteria:**
- [ ] Filter buttons/dropdown for technologies
- [ ] Projects filter in real-time
- [ ] Multiple filters can be applied
- [ ] Clear filters button
- [ ] URL updates with filter state

**Priority:** Could Have
**Story Points:** 5

---

## Phase 4: Won't Have (Out of Scope)

### WH-001: Public User Registration
**As a** visitor
**I want to** create an account
**So that** I can save favorite projects or subscribe to updates

**Reason:** Out of scope for initial release. Site is informational only.

---

### WH-002: Real-time Chat
**As a** visitor
**I want to** chat with the site owner in real-time
**So that** I can get immediate responses

**Reason:** Contact form is sufficient. Real-time chat adds complexity without clear benefit.

---

### WH-003: Social Media Integration
**As a** visitor
**I want to** share projects on social media
**So that** I can show interesting projects to my network

**Reason:** Low priority. Can be added later if demand exists.

---

### WH-004: Multi-language Support
**As a** visitor
**I want to** view the site in multiple languages
**So that** I can read content in my preferred language

**Reason:** Target audience is English-speaking. Unnecessary complexity for initial release.

---

## Story Summary

### By Phase

| Phase | Must Have | Should Have | Could Have | Won't Have |
|-------|-----------|-------------|------------|------------|
| Stories | 10 | 6 | 6 | 4 |
| Story Points | 39 | 30 | 73 | N/A |

### By User Type

| User Type | Story Count | Total Points |
|-----------|-------------|--------------|
| Visitor | 11 | 52 |
| Admin | 11 | 90 |

---

## Notes

- Story points use Fibonacci sequence (1, 2, 3, 5, 8, 13, 21)
- Estimates are rough and may change during implementation
- Dependencies between stories should be considered during sprint planning
- Phase 1 (Must Have) represents the MVP
- Phases 2-3 can be implemented iteratively based on priority
