# Product Requirements Document (PRD)

## Project: Portfolio Website - Blazor Server Migration

**Version:** 1.0
**Date:** 2025-11-03
**Author:** cpike
**Status:** Planning

---

## 1. Executive Summary

This document outlines the requirements for migrating the existing static HTML/CSS/JavaScript portfolio website to a Blazor Server application. The migration will maintain all existing functionality while adding server-side rendering capabilities, user authentication, and a backend database for contact form submissions.

### Purpose
Convert the static portfolio site to a dynamic Blazor Server application to enable:
- Contact form data persistence
- Future content management capabilities
- Enhanced interactivity
- Server-side rendering benefits
- Foundation for future feature expansion

### Success Criteria
- All existing portfolio content and styling preserved
- Contact form successfully captures and stores submissions
- Site performance comparable to or better than static version
- Mobile responsiveness maintained
- Authentication system in place for future admin features
- Deployable to existing infrastructure

---

## 2. Background & Context

### Current State
- Static HTML/CSS/JavaScript portfolio site
- Responsive design with mobile navigation
- Contact form (UI only, no backend)
- Deployed via shell script to web server
- Uses vanilla JavaScript for interactivity

### Problems to Solve
1. Contact form submissions are not captured or stored
2. No ability to manage content without manual HTML editing
3. Limited interactivity without complex JavaScript
4. No user authentication or admin capabilities

### Why Blazor Server?
- **Full-stack C#**: Leverage existing .NET expertise
- **Component-based**: Better code organization and reusability
- **Server-side rendering**: Good SEO, reduced client payload
- **Real-time capabilities**: SignalR built-in for future features
- **Strong typing**: Compile-time safety vs JavaScript
- **Easy integration**: .NET ecosystem (EF Core, Identity, logging)

---

## 3. Target Audience

### Primary Users
1. **Visitors** (Public)
   - Viewing professional portfolio
   - Learning about skills and experience
   - Submitting contact inquiries

2. **Site Owner** (Admin)
   - Managing contact form submissions
   - Future: Content management
   - Future: Analytics review

---

## 4. Requirements

### 4.1 Functional Requirements

#### Must Have (Phase 1)
- [ ] Display all existing portfolio sections (Hero, About, Skills, Projects, Work, Contact)
- [ ] Maintain current visual design and styling
- [ ] Mobile-responsive navigation with hamburger menu
- [ ] Smooth scroll behavior between sections
- [ ] Contact form with client-side validation
- [ ] Store contact submissions in database
- [ ] Confirmation message after form submission
- [ ] User authentication system (Identity)
- [ ] Structured logging with Serilog
- [ ] Back-to-top button functionality

#### Should Have (Phase 2)
- [ ] Admin dashboard to view contact submissions
- [ ] Mark submissions as read/unread
- [ ] Delete contact submissions
- [ ] Search/filter submissions
- [ ] Email notification on new contact submission (optional)

#### Could Have (Future)
- [ ] **UI Showcase**: Interactive component library page demonstrating all UI components
- [ ] Content management system for portfolio sections
- [ ] Project image uploads
- [ ] Blog functionality
- [ ] Analytics dashboard
- [ ] Multi-language support

#### Won't Have (Out of Scope)
- Public user registration (only admin accounts)
- Social media integration
- Real-time chat
- Payment processing

### 4.2 Non-Functional Requirements

#### Performance
- Page load time < 2 seconds on 3G connection
- Time to Interactive (TTI) < 3 seconds
- Lighthouse performance score > 90
- Database queries optimized with indexes

#### Scalability
- Support 1,000+ contact submissions without performance degradation
- Handle 100 concurrent users
- Database schema designed for future expansion

#### Security
- All user input validated and sanitized
- HTTPS enforced in production
- SQL injection prevention via EF Core
- XSS protection built-in to Blazor
- Authentication via ASP.NET Core Identity
- Secure password storage (hashed, salted)
- CSRF protection enabled

#### Reliability
- 99% uptime target
- Graceful error handling with user-friendly messages
- Database connection resilience
- Comprehensive logging for troubleshooting

#### Maintainability
- Clean code architecture
- Component-based design for reusability
- Separation of concerns (UI, Business Logic, Data Access)
- Comprehensive inline documentation
- Consistent naming conventions

#### Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)
- Screen sizes from 320px to 4K
- Keyboard navigation support
- Screen reader compatibility (WCAG 2.1 Level AA goal)

---

## 5. Technical Constraints

### Platform
- .NET 8 or .NET 9
- Blazor Server (not WASM or Blazor Web App initially)
- C# 12

### Database
- SQLite for development and initial production
- SQL Server support as optional configuration override
- EF Core for data access

### Hosting
- Existing web server infrastructure
- Linux-compatible deployment
- Reverse proxy (nginx/apache) support

### Dependencies
- Minimal third-party packages
- Prefer Microsoft-maintained packages
- Serilog for logging
- ASP.NET Core Identity for authentication

---

## 6. Assumptions & Dependencies

### Assumptions
- Server environment supports .NET runtime
- SQLite is acceptable for production scale (initially)
- Current static site styling can be reused as-is
- Admin access will be managed manually (no self-registration)

### Dependencies
- .NET SDK installed on development and deployment machines
- Database file storage permissions on server
- Existing deploy script can be adapted for Blazor deployment

---

## 7. Out of Scope

- Mobile native applications
- Progressive Web App (PWA) features
- Backend API for external integrations
- Third-party authentication providers (Google, Microsoft, etc.)
- Automated email responses to contact form
- File upload capabilities (Phase 1)

---

## 8. Success Metrics

### Launch Criteria
- All existing portfolio content migrated
- Contact form successfully stores submissions
- No visual regression from static site
- Mobile navigation working correctly
- Admin can log in and view submissions
- Logs captured for debugging

### Key Performance Indicators (KPIs)
- Contact form submission success rate > 95%
- Zero critical security vulnerabilities
- Page load performance within 10% of static site
- 100% mobile responsiveness maintained
- Zero data loss for contact submissions

---

## 9. Timeline & Phases

### Phase 1: Foundation (Week 1)
- Project setup and documentation
- Blazor Server project creation
- Basic layout and navigation
- Static portfolio content migration

### Phase 2: Database & Contact Form (Week 2)
- EF Core setup with SQLite
- Contact form backend implementation
- Validation and error handling
- Form submission storage

### Phase 3: Admin Features (Week 3)
- Admin dashboard
- View contact submissions
- Mark as read/delete functionality

### Phase 4: Polish & Deploy (Week 4)
- Testing and bug fixes
- Performance optimization
- Deployment to production
- Documentation updates

### Phase 5: Future Enhancements (Post-Launch)
- **UI Showcase**: Interactive component library demonstrating all UI components
  - Component gallery with live examples
  - Design system documentation
  - Code samples and usage guidelines
  - Accessibility demonstrations
- Content management system
- Blog functionality
- Advanced analytics
- Additional features as identified

---

## 10. Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Performance degradation vs static site | High | Medium | Implement caching, optimize queries, use static SSR where possible |
| SQLite limitations at scale | Medium | Low | Design for easy SQL Server migration, monitor performance |
| SignalR connection issues | High | Medium | Implement reconnection logic, fallback UI states |
| Authentication complexity | Medium | Low | Use built-in Identity, keep simple initially |
| CSS/JS compatibility in Blazor | Medium | Medium | Test thoroughly, use CSS isolation where beneficial |
| Deployment complexity | Medium | Low | Document process, test deployment script updates |

---

## 11. Appendix

### Related Documents
- [User Stories](user-stories.md)
- [Technical Specifications](tech-specs.md)
- [Functional Specifications](functional-specs.md)
- [Implementation Plan](implementation-plan.md)
- [UI Showcase Specification](ui-showcase-spec.md)

### Glossary
- **Blazor Server**: ASP.NET Core framework for building interactive web UIs using C# instead of JavaScript
- **EF Core**: Entity Framework Core, Microsoft's ORM for .NET
- **Identity**: ASP.NET Core's authentication and authorization framework
- **Serilog**: Structured logging library for .NET
- **SQLite**: Lightweight, file-based relational database
- **SSR**: Server-Side Rendering
