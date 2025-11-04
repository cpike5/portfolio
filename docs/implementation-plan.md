# Implementation Plan

## Project: Portfolio Website - Blazor Server Migration

**Version:** 1.0
**Date:** 2025-11-03
**Status:** Planning

---

## Table of Contents

1. [Overview](#overview)
2. [Phase 1: Foundation Setup](#phase-1-foundation-setup)
3. [Phase 2: Database & Contact Form](#phase-2-database--contact-form)
4. [Phase 3: Admin Features](#phase-3-admin-features)
5. [Phase 4: Polish & Deploy](#phase-4-polish--deploy)
6. [Testing Strategy](#testing-strategy)
7. [Deployment Strategy](#deployment-strategy)
8. [Rollback Plan](#rollback-plan)
9. [Success Criteria](#success-criteria)

---

## 1. Overview

This document provides a detailed, step-by-step implementation plan for migrating the static portfolio website to a Blazor Server application. The plan is divided into four phases, each with specific tasks, dependencies, and acceptance criteria.

### Timeline Summary

| Phase | Duration | Focus |
|-------|----------|-------|
| Phase 1 | 3-5 days | Foundation Setup |
| Phase 2 | 3-4 days | Database & Contact Form |
| Phase 3 | 2-3 days | Admin Features |
| Phase 4 | 2-3 days | Polish & Deploy |
| **Total** | **10-15 days** | **Full Implementation** |

### Prerequisites

- [x] Documentation complete (PRD, User Stories, Tech Specs, Functional Specs)
- [ ] .NET 8/9 SDK installed
- [ ] Development environment configured
- [ ] Git repository ready
- [ ] SQLite tools available (optional, for database inspection)

---

## 2. Phase 1: Foundation Setup

**Goal:** Create Blazor Server project with basic layout and static portfolio content

**Duration:** 3-5 days

### 2.1 Project Initialization

#### Task 1.1: Create Blazor Server Project
**Estimated Time:** 30 minutes

**Steps:**
```bash
# Create src directory if not exists
mkdir -p src
cd src

# Create Blazor Server app with Individual Authentication
dotnet new blazor -n Portfolio.Web -au Individual

# Navigate to project
cd Portfolio.Web

# Verify project structure
ls -la
```

**Acceptance Criteria:**
- [ ] Project created successfully
- [ ] Project builds without errors: `dotnet build`
- [ ] Project runs: `dotnet run`
- [ ] Can access site at localhost:5000

**Files Created:**
- `Portfolio.Web.csproj`
- `Program.cs`
- `App.razor`
- `Components/` directory structure
- `Data/ApplicationDbContext.cs`

---

#### Task 1.2: Install NuGet Packages
**Estimated Time:** 15 minutes

**Steps:**
```bash
# Navigate to project directory
cd src/Portfolio.Web

# Install Serilog packages
dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Sinks.Console
dotnet add package Serilog.Sinks.File

# Install EF Core packages (SQLite)
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.EntityFrameworkCore.Tools

# Optional: SQL Server support
dotnet add package Microsoft.EntityFrameworkCore.SqlServer

# Verify packages installed
dotnet list package
```

**Acceptance Criteria:**
- [ ] All packages installed without errors
- [ ] Package versions compatible with .NET version
- [ ] Project still builds: `dotnet build`

---

#### Task 1.3: Configure Serilog
**Estimated Time:** 45 minutes

**Steps:**

1. **Update Program.cs:**
```csharp
using Serilog;

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.Hosting.Lifetime", LogEventLevel.Information)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File(
        path: "logs/portfolio-.log",
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 30)
    .CreateLogger();

try
{
    Log.Information("Starting Portfolio application");

    var builder = WebApplication.CreateBuilder(args);

    // Add Serilog
    builder.Host.UseSerilog();

    // ... rest of configuration

    var app = builder.Build();

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
```

2. **Add appsettings.json Serilog section:**
```json
{
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft": "Warning",
        "Microsoft.Hosting.Lifetime": "Information"
      }
    }
  }
}
```

3. **Create logs directory:**
```bash
mkdir logs
echo "logs/" >> .gitignore
```

**Acceptance Criteria:**
- [ ] Application starts without errors
- [ ] Logs appear in console
- [ ] Log files created in `logs/` directory
- [ ] Log entries are structured and readable

**Testing:**
```bash
dotnet run
# Check console for log output
# Check logs/ directory for log files
```

---

#### Task 1.4: Clean Up Default Components
**Estimated Time:** 30 minutes

**Steps:**

1. **Delete sample pages:**
```bash
cd Components/Pages
rm Weather.razor Counter.razor
```

2. **Remove sample code from Home.razor:**
- Keep the file but clear content (we'll replace it later)

3. **Update NavMenu.razor:**
- Remove links to Weather and Counter

4. **Clean up project references:**
- Check for any references to deleted components
- Remove from imports if necessary

**Acceptance Criteria:**
- [ ] No broken references
- [ ] Project builds successfully
- [ ] No 404 errors when navigating

---

### 2.2 Static Asset Migration

#### Task 1.5: Copy CSS Files
**Estimated Time:** 30 minutes

**Steps:**

1. **Create CSS directory structure:**
```bash
cd wwwroot
mkdir -p css
```

2. **Copy existing CSS files:**
```bash
# From portfolio root
cp tokens.css src/Portfolio.Web/wwwroot/css/
cp styles.css src/Portfolio.Web/wwwroot/css/
```

3. **Create app.css for Blazor-specific styles:**
```bash
touch wwwroot/css/app.css
```

4. **Update App.razor head section:**
```razor
<head>
    <!-- ... existing head content ... -->
    <link rel="stylesheet" href="css/tokens.css" />
    <link rel="stylesheet" href="css/styles.css" />
    <link rel="stylesheet" href="css/app.css" />
</head>
```

**Acceptance Criteria:**
- [ ] CSS files accessible at `/css/tokens.css` and `/css/styles.css`
- [ ] Styles applied correctly when viewing site
- [ ] No broken CSS references

---

#### Task 1.6: Copy JavaScript Files
**Estimated Time:** 20 minutes

**Steps:**

1. **Create JS directory:**
```bash
mkdir -p wwwroot/js
```

2. **Copy script.js:**
```bash
cp script.js src/Portfolio.Web/wwwroot/js/site.js
```

3. **Update script for Blazor compatibility:**
- Review script.js for DOM-ready events
- Adjust for Blazor lifecycle if needed
- Consider moving some logic to Blazor components

4. **Reference in App.razor:**
```razor
<script src="js/site.js"></script>
```

**Acceptance Criteria:**
- [ ] JavaScript loads without errors
- [ ] Console shows no JS errors
- [ ] Scroll effects and interactions work

---

#### Task 1.7: Copy Assets
**Estimated Time:** 15 minutes

**Steps:**

1. **Create assets directory:**
```bash
mkdir -p wwwroot/assets
```

2. **Copy images:**
```bash
cp assets/preview.png src/Portfolio.Web/wwwroot/assets/
```

3. **Verify image paths in code:**
- Update any hardcoded paths to use `/assets/`

**Acceptance Criteria:**
- [ ] Images accessible via browser
- [ ] No 404 errors for assets

---

### 2.3 Layout Components

#### Task 1.8: Create MainLayout Component
**Estimated Time:** 1 hour

**Steps:**

1. **Update Components/Layout/MainLayout.razor:**
```razor
@inherits LayoutComponentBase

<div class="page">
    <NavMenu />
    <MobileNav />

    <main class="main-content">
        @Body
    </main>

    <Footer />
    <BackToTop />
</div>
```

2. **Create supporting CSS if needed:**
- Use existing styles.css
- Add any Blazor-specific layout styles to MainLayout.razor.css

**Acceptance Criteria:**
- [ ] Layout renders correctly
- [ ] Body content appears in correct location
- [ ] No layout shifts

---

#### Task 1.9: Create NavMenu Component
**Estimated Time:** 1.5 hours

**Steps:**

1. **Create Components/Layout/NavMenu.razor:**
```razor
<nav class="navbar">
    <ul class="nav-links">
        <li><a href="#home" @onclick="NavigateToSection">Home</a></li>
        <li><a href="#about" @onclick="NavigateToSection">About</a></li>
        <li><a href="#skills" @onclick="NavigateToSection">Skills</a></li>
        <li><a href="#projects" @onclick="NavigateToSection">Projects</a></li>
        <li><a href="#work" @onclick="NavigateToSection">Work</a></li>
        <li><a href="#contact" @onclick="NavigateToSection">Contact</a></li>

        <AuthorizeView>
            <Authorized>
                <li><NavLink href="/admin">Admin</NavLink></li>
            </Authorized>
        </AuthorizeView>
    </ul>
</nav>

@code {
    [Inject] private IJSRuntime JS { get; set; } = default!;

    private async Task NavigateToSection(MouseEventArgs e)
    {
        // Smooth scroll to section via JavaScript interop
        var href = ((e.Target as dynamic)?.getAttribute("href")) ?? "";
        if (!string.IsNullOrEmpty(href) && href.StartsWith("#"))
        {
            await JS.InvokeVoidAsync("scrollToSection", href);
        }
    }
}
```

2. **Add JavaScript helper in site.js:**
```javascript
window.scrollToSection = function(sectionId) {
    const element = document.querySelector(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}
```

**Acceptance Criteria:**
- [ ] Desktop navigation displays correctly
- [ ] Links scroll to sections smoothly
- [ ] Active state updates on scroll (future enhancement)
- [ ] Admin link only visible when authenticated

---

#### Task 1.10: Create MobileNav Component
**Estimated Time:** 2 hours

**Steps:**

1. **Create Components/Layout/MobileNav.razor:**
```razor
<header class="mobile-header">
    <button class="mobile-menu-button" @onclick="ToggleMenu" aria-label="Menu">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
             stroke-width="1.5" stroke="currentColor" class="menu-icon">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
        </svg>
    </button>
    <div class="mobile-title">cpike.ca</div>
</header>

<div class="mobile-menu-overlay @(isMenuOpen ? "active" : "")"
     @onclick="CloseMenu"></div>

<nav class="mobile-menu @(isMenuOpen ? "active" : "")">
    <div class="mobile-menu-header">
        <span class="mobile-menu-title">Menu</span>
        <button class="mobile-menu-close" @onclick="CloseMenu" aria-label="Close menu">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke-width="1.5" stroke="currentColor" class="close-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
    <ul class="mobile-nav-links">
        <li><a href="#home" class="mobile-nav-link" @onclick="NavigateAndClose">Home</a></li>
        <li><a href="#about" class="mobile-nav-link" @onclick="NavigateAndClose">About</a></li>
        <li><a href="#skills" class="mobile-nav-link" @onclick="NavigateAndClose">Skills</a></li>
        <li><a href="#projects" class="mobile-nav-link" @onclick="NavigateAndClose">Projects</a></li>
        <li><a href="#work" class="mobile-nav-link" @onclick="NavigateAndClose">Work</a></li>
        <li><a href="#contact" class="mobile-nav-link" @onclick="NavigateAndClose">Contact</a></li>
    </ul>
</nav>

@code {
    private bool isMenuOpen = false;

    [Inject] private IJSRuntime JS { get; set; } = default!;

    private void ToggleMenu()
    {
        isMenuOpen = !isMenuOpen;
    }

    private void CloseMenu()
    {
        isMenuOpen = false;
    }

    private async Task NavigateAndClose(MouseEventArgs e)
    {
        CloseMenu();
        var href = ((e.Target as dynamic)?.getAttribute("href")) ?? "";
        if (!string.IsNullOrEmpty(href) && href.StartsWith("#"))
        {
            await JS.InvokeVoidAsync("scrollToSection", href);
        }
    }
}
```

**Acceptance Criteria:**
- [ ] Mobile menu toggles open/close
- [ ] Overlay appears when menu open
- [ ] Clicking overlay closes menu
- [ ] Clicking menu item closes menu and scrolls
- [ ] Smooth animations work

---

#### Task 1.11: Create Footer Component
**Estimated Time:** 30 minutes

**Steps:**

1. **Create Components/Layout/Footer.razor:**
```razor
<footer class="footer">
    <p class="footer-text">© @DateTime.Now.Year cpike</p>
    <a href="https://github.com/cpike5" class="footer-link"
       target="_blank" rel="noopener noreferrer">GitHub</a>
</footer>

@code {
    // Footer logic if needed
}
```

**Acceptance Criteria:**
- [ ] Footer displays at bottom
- [ ] Year updates dynamically
- [ ] GitHub link works

---

#### Task 1.12: Create BackToTop Component
**Estimated Time:** 45 minutes

**Steps:**

1. **Create Components/Shared/BackToTop.razor:**
```razor
<button id="backToTop" class="back-to-top @(isVisible ? "visible" : "")"
        @onclick="ScrollToTop" aria-label="Back to top"></button>

@code {
    private bool isVisible = false;

    [Inject] private IJSRuntime JS { get; set; } = default!;

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            await JS.InvokeVoidAsync("initBackToTopButton",
                DotNetObjectReference.Create(this));
        }
    }

    [JSInvokable]
    public void UpdateVisibility(bool visible)
    {
        isVisible = visible;
        StateHasChanged();
    }

    private async Task ScrollToTop()
    {
        await JS.InvokeVoidAsync("scrollToTop");
    }
}
```

2. **Add JavaScript in site.js:**
```javascript
window.initBackToTopButton = function(dotNetHelper) {
    window.addEventListener('scroll', () => {
        const heroHeight = document.querySelector('.hero')?.offsetHeight || 800;
        const shouldShow = window.scrollY > heroHeight;
        dotNetHelper.invokeMethodAsync('UpdateVisibility', shouldShow);
    });
}

window.scrollToTop = function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
```

**Acceptance Criteria:**
- [ ] Button hidden initially
- [ ] Button appears after scrolling past hero
- [ ] Clicking button scrolls to top smoothly
- [ ] Button has hover effect

---

### 2.4 Home Page Content

#### Task 1.13: Create Home Page with All Sections
**Estimated Time:** 3-4 hours

**Steps:**

1. **Update Components/Pages/Home.razor:**
- Copy HTML structure from existing index.html
- Convert to Razor syntax
- Use existing CSS classes
- Break into logical sections

**Sections to implement:**
- Hero section
- About section
- Skills section (using existing structure)
- Projects section (using existing structure)
- Work section
- Contact section (form in Phase 2)

2. **Example structure:**
```razor
@page "/"

<PageTitle>Portfolio - cpike.ca</PageTitle>

<section id="home" class="hero">
    <h1 class="hero-title">cpike.ca</h1>
    <a href="#about" class="scroll-indicator">
        <span class="arrow-down"></span>
    </a>
</section>

<section id="about" class="about-section fade-in">
    <div class="about-content">
        <h2 class="section-title">About</h2>
        <p class="about-text">
            I'm a Full Stack .NET Developer with over 12 years of experience...
        </p>
        <!-- ... more paragraphs ... -->
    </div>
</section>

<!-- ... more sections ... -->

@code {
    // Page logic
}
```

**Acceptance Criteria:**
- [ ] All sections display correctly
- [ ] Content matches existing portfolio
- [ ] Styling preserved
- [ ] Responsive on mobile
- [ ] No console errors

---

#### Task 1.14: Create Reusable Components
**Estimated Time:** 2 hours

**Steps:**

1. **Create Components/Shared/ProjectCard.razor:**
```razor
<div class="project-card">
    @if (!string.IsNullOrEmpty(ImageUrl))
    {
        <img src="@ImageUrl" alt="@Title screenshot" class="project-image">
    }
    else
    {
        <div class="project-image-placeholder">
            <span class="placeholder-text">Project Screenshot</span>
        </div>
    }
    <h3 class="project-title">@Title</h3>
    <p class="project-description">@Description</p>
    <a href="@Link" class="project-link" target="_blank" rel="noopener noreferrer">
        View on GitHub →
    </a>
</div>

@code {
    [Parameter] public string Title { get; set; } = string.Empty;
    [Parameter] public string Description { get; set; } = string.Empty;
    [Parameter] public string Link { get; set; } = string.Empty;
    [Parameter] public string? ImageUrl { get; set; }
}
```

2. **Create Components/Shared/SkillGroup.razor:**
```razor
<div class="skill-group">
    <h3 class="skill-group-title">@GroupTitle</h3>
    <div class="skills-grid">
        @foreach (var skill in Skills)
        {
            <div class="skill-item">@skill</div>
        }
    </div>
</div>

@code {
    [Parameter] public string GroupTitle { get; set; } = string.Empty;
    [Parameter] public List<string> Skills { get; set; } = new();
}
```

3. **Create Components/Shared/WorkItem.razor:**
```razor
<div class="work-item">
    <h3 class="work-title">@Title</h3>
    <p class="work-description">@Description</p>
</div>

@code {
    [Parameter] public string Title { get; set; } = string.Empty;
    [Parameter] public string Description { get; set; } = string.Empty;
}
```

4. **Update Home.razor to use components:**
```razor
<!-- Projects Section -->
<div class="projects-grid">
    <ProjectCard
        Title="Discord Bot Framework"
        Description="ASP.NET Core Discord bot framework..."
        Link="https://github.com/cpike5/discord-bot-dotnet"
        ImageUrl="/assets/preview.png" />

    <ProjectCard
        Title="Portfolio Site"
        Description="Minimalist portfolio..."
        Link="https://github.com/cpike5/portfolio"
        ImageUrl="/assets/preview.png" />
</div>

<!-- Skills Section -->
<SkillGroup
    GroupTitle="Core Technologies"
    Skills="@(new List<string> { "C#", "JavaScript", "SQL", "HTML/CSS", ".NET Core", "Blazor", "ASP.NET" })" />
```

**Acceptance Criteria:**
- [ ] Components render correctly
- [ ] Data passed via parameters
- [ ] Components reusable
- [ ] Styling maintained

---

### 2.5 Phase 1 Testing & Validation

#### Task 1.15: Manual Testing
**Estimated Time:** 1-2 hours

**Test Checklist:**
- [ ] Site loads without errors
- [ ] All sections visible
- [ ] Navigation works (desktop)
- [ ] Mobile menu works
- [ ] Scroll animations work
- [ ] Back to top button works
- [ ] All links work
- [ ] Images load
- [ ] Styling matches original
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] No browser warnings

**Devices to Test:**
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

---

#### Task 1.16: Phase 1 Documentation Update
**Estimated Time:** 30 minutes

**Steps:**
1. Update README.md with Blazor setup instructions
2. Update CLAUDE.md with new project structure
3. Document any deviations from plan
4. Note any issues for future phases

**Acceptance Criteria:**
- [ ] Documentation reflects current state
- [ ] Setup instructions accurate
- [ ] Known issues documented

---

### Phase 1 Completion Criteria

- [x] Blazor Server project created
- [ ] Serilog configured and logging
- [ ] All static assets migrated
- [ ] Layout components created and functional
- [ ] Home page displays all portfolio sections
- [ ] Reusable components created
- [ ] Desktop navigation works
- [ ] Mobile navigation works
- [ ] Site looks identical to static version
- [ ] No console errors
- [ ] Documentation updated

---

## 3. Phase 2: Database & Contact Form

**Goal:** Implement database with EF Core and functional contact form

**Duration:** 3-4 days

### 3.1 Database Setup

#### Task 2.1: Configure Database Options
**Estimated Time:** 1 hour

**Steps:**

1. **Create Options/DatabaseOptions.cs:**
```csharp
namespace Portfolio.Web.Options;

public class DatabaseOptions
{
    public const string SectionName = "Database";

    public DatabaseProvider Provider { get; set; } = DatabaseProvider.SQLite;
    public bool EnableSensitiveDataLogging { get; set; } = false;
}

public enum DatabaseProvider
{
    SQLite,
    SqlServer
}
```

2. **Add to appsettings.json:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=portfolio.db"
  },
  "Database": {
    "Provider": "SQLite",
    "EnableSensitiveDataLogging": false
  }
}
```

3. **Register options in Program.cs:**
```csharp
builder.Services.Configure<DatabaseOptions>(
    builder.Configuration.GetSection(DatabaseOptions.SectionName));
```

**Acceptance Criteria:**
- [ ] Options class created
- [ ] Configuration section added
- [ ] Options registered in DI

---

#### Task 2.2: Update ApplicationDbContext
**Estimated Time:** 2 hours

**Steps:**

1. **Update Data/ApplicationDbContext.cs:**
```csharp
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Portfolio.Web.Models.Entities;

namespace Portfolio.Web.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<ContactSubmission> ContactSubmissions => Set<ContactSubmission>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Contact Submission configuration
        builder.Entity<ContactSubmission>(entity =>
        {
            entity.ToTable("ContactSubmissions");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(255);

            entity.Property(e => e.Message)
                .IsRequired()
                .HasMaxLength(500);

            entity.Property(e => e.SubmittedAt)
                .IsRequired();

            entity.HasIndex(e => e.SubmittedAt);
            entity.HasIndex(e => e.IsRead);
        });

        // SQLite-specific configuration
        if (Database.IsSqlite())
        {
            // Adjust Identity schema for SQLite compatibility
            foreach (var entityType in builder.Model.GetEntityTypes())
            {
                var properties = entityType.GetProperties()
                    .Where(p => p.ClrType == typeof(string) && p.GetMaxLength() == null);

                foreach (var property in properties)
                {
                    property.SetMaxLength(4000);
                }
            }
        }
    }
}
```

2. **Configure DbContext in Program.cs:**
```csharp
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

var databaseOptions = builder.Configuration
    .GetSection(DatabaseOptions.SectionName)
    .Get<DatabaseOptions>() ?? new DatabaseOptions();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    if (databaseOptions.Provider == DatabaseProvider.SQLite)
    {
        options.UseSqlite(connectionString);
    }
    else
    {
        options.UseSqlServer(connectionString);
    }

    if (databaseOptions.EnableSensitiveDataLogging)
    {
        options.EnableSensitiveDataLogging();
    }
});
```

**Acceptance Criteria:**
- [ ] DbContext updated with ContactSubmission
- [ ] SQLite configuration added
- [ ] DbContext registered in DI
- [ ] Project builds successfully

---

#### Task 2.3: Create Entity Models
**Estimated Time:** 1 hour

**Steps:**

1. **Create Models/Entities/ directory:**
```bash
mkdir -p Models/Entities
```

2. **Create Models/Entities/ContactSubmission.cs:**
```csharp
namespace Portfolio.Web.Models.Entities;

public class ContactSubmission
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Message { get; set; } = string.Empty;

    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

    public bool IsRead { get; set; } = false;

    public string? IpAddress { get; set; }

    public string? UserAgent { get; set; }
}
```

3. **Create Models/Entities/ApplicationUser.cs:**
```csharp
using Microsoft.AspNetCore.Identity;

namespace Portfolio.Web.Models.Entities;

public class ApplicationUser : IdentityUser
{
    public string? DisplayName { get; set; }
}
```

**Acceptance Criteria:**
- [ ] Entity models created
- [ ] Data annotations added
- [ ] Project builds

---

#### Task 2.4: Create DTOs
**Estimated Time:** 45 minutes

**Steps:**

1. **Create Models/DTOs/ directory:**
```bash
mkdir -p Models/DTOs
```

2. **Create Models/DTOs/ContactFormModel.cs:**
```csharp
using System.ComponentModel.DataAnnotations;

namespace Portfolio.Web.Models.DTOs;

public class ContactFormModel
{
    [Required(ErrorMessage = "Name is required")]
    [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    [StringLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Message is required")]
    [StringLength(500, ErrorMessage = "Message cannot exceed 500 characters")]
    [MinLength(10, ErrorMessage = "Message must be at least 10 characters")]
    public string Message { get; set; } = string.Empty;
}
```

3. **Create Models/DTOs/ContactSubmissionDto.cs:**
```csharp
namespace Portfolio.Web.Models.DTOs;

public class ContactSubmissionDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; }
    public bool IsRead { get; set; }
}
```

**Acceptance Criteria:**
- [ ] DTOs created
- [ ] Validation attributes added
- [ ] Project builds

---

#### Task 2.5: Create and Apply Initial Migration
**Estimated Time:** 1 hour

**Steps:**

1. **Remove default migration if exists:**
```bash
dotnet ef migrations remove
```

2. **Create initial migration:**
```bash
dotnet ef migrations add InitialCreate
```

3. **Review migration file:**
- Check that ContactSubmissions table is included
- Verify Identity tables are SQLite-compatible
- Ensure indexes are created

4. **Apply migration:**
```bash
dotnet ef database update
```

5. **Verify database created:**
```bash
ls -la portfolio.db
```

6. **Optional: Inspect database:**
```bash
sqlite3 portfolio.db
.schema ContactSubmissions
.quit
```

**Acceptance Criteria:**
- [ ] Migration created successfully
- [ ] Database file created
- [ ] Tables exist in database
- [ ] No migration errors

**Troubleshooting:**
- If migration fails, check entity configurations
- Verify connection string
- Check EF Core tools version

---

### 3.2 Service Layer Implementation

#### Task 2.6: Create Service Interface
**Estimated Time:** 30 minutes

**Steps:**

1. **Create Services/Interfaces/ directory:**
```bash
mkdir -p Services/Interfaces
```

2. **Create Services/Interfaces/IContactService.cs:**
```csharp
using Portfolio.Web.Models.DTOs;

namespace Portfolio.Web.Services.Interfaces;

public interface IContactService
{
    Task<int> SubmitContactFormAsync(ContactFormModel model,
        string? ipAddress = null, string? userAgent = null);

    Task<List<ContactSubmissionDto>> GetAllSubmissionsAsync();

    Task<List<ContactSubmissionDto>> GetUnreadSubmissionsAsync();

    Task<ContactSubmissionDto?> GetSubmissionByIdAsync(int id);

    Task MarkAsReadAsync(int id, bool isRead = true);

    Task DeleteSubmissionAsync(int id);

    Task<int> GetUnreadCountAsync();
}
```

**Acceptance Criteria:**
- [ ] Interface created
- [ ] All CRUD methods defined
- [ ] Async signatures used

---

#### Task 2.7: Implement Contact Service
**Estimated Time:** 2 hours

**Steps:**

1. **Create Services/ContactService.cs:**
```csharp
using Microsoft.EntityFrameworkCore;
using Portfolio.Web.Data;
using Portfolio.Web.Models.DTOs;
using Portfolio.Web.Models.Entities;
using Portfolio.Web.Services.Interfaces;

namespace Portfolio.Web.Services;

public class ContactService : IContactService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ContactService> _logger;

    public ContactService(
        ApplicationDbContext context,
        ILogger<ContactService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<int> SubmitContactFormAsync(
        ContactFormModel model,
        string? ipAddress = null,
        string? userAgent = null)
    {
        var submission = new ContactSubmission
        {
            Name = model.Name.Trim(),
            Email = model.Email.Trim().ToLowerInvariant(),
            Message = model.Message.Trim(),
            SubmittedAt = DateTime.UtcNow,
            IpAddress = ipAddress,
            UserAgent = userAgent
        };

        _context.ContactSubmissions.Add(submission);
        await _context.SaveChangesAsync();

        _logger.LogInformation(
            "Contact form submitted by {Name} ({Email}), ID: {Id}",
            submission.Name, submission.Email, submission.Id);

        return submission.Id;
    }

    public async Task<List<ContactSubmissionDto>> GetAllSubmissionsAsync()
    {
        return await _context.ContactSubmissions
            .AsNoTracking()
            .OrderByDescending(c => c.SubmittedAt)
            .Select(c => new ContactSubmissionDto
            {
                Id = c.Id,
                Name = c.Name,
                Email = c.Email,
                Message = c.Message,
                SubmittedAt = c.SubmittedAt,
                IsRead = c.IsRead
            })
            .ToListAsync();
    }

    public async Task<List<ContactSubmissionDto>> GetUnreadSubmissionsAsync()
    {
        return await _context.ContactSubmissions
            .AsNoTracking()
            .Where(c => !c.IsRead)
            .OrderByDescending(c => c.SubmittedAt)
            .Select(c => new ContactSubmissionDto
            {
                Id = c.Id,
                Name = c.Name,
                Email = c.Email,
                Message = c.Message,
                SubmittedAt = c.SubmittedAt,
                IsRead = c.IsRead
            })
            .ToListAsync();
    }

    public async Task<ContactSubmissionDto?> GetSubmissionByIdAsync(int id)
    {
        return await _context.ContactSubmissions
            .AsNoTracking()
            .Where(c => c.Id == id)
            .Select(c => new ContactSubmissionDto
            {
                Id = c.Id,
                Name = c.Name,
                Email = c.Email,
                Message = c.Message,
                SubmittedAt = c.SubmittedAt,
                IsRead = c.IsRead
            })
            .FirstOrDefaultAsync();
    }

    public async Task MarkAsReadAsync(int id, bool isRead = true)
    {
        var submission = await _context.ContactSubmissions.FindAsync(id);
        if (submission != null)
        {
            submission.IsRead = isRead;
            await _context.SaveChangesAsync();

            _logger.LogInformation(
                "Submission {Id} marked as {Status}",
                id, isRead ? "read" : "unread");
        }
    }

    public async Task DeleteSubmissionAsync(int id)
    {
        var submission = await _context.ContactSubmissions.FindAsync(id);
        if (submission != null)
        {
            _context.ContactSubmissions.Remove(submission);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Submission {Id} deleted", id);
        }
    }

    public async Task<int> GetUnreadCountAsync()
    {
        return await _context.ContactSubmissions
            .AsNoTracking()
            .CountAsync(c => !c.IsRead);
    }
}
```

2. **Register service in Program.cs:**
```csharp
builder.Services.AddScoped<IContactService, ContactService>();
```

**Acceptance Criteria:**
- [ ] Service implemented
- [ ] All interface methods implemented
- [ ] Logging added
- [ ] Service registered in DI
- [ ] Project builds

---

### 3.3 Contact Form Implementation

#### Task 2.8: Create Contact Form Component
**Estimated Time:** 3-4 hours

**Steps:**

1. **Update Home.razor contact section:**
```razor
<section id="contact" class="contact-section fade-in">
    <div class="contact-content">
        <h2 class="section-title">Contact</h2>

        @if (!isSubmitted)
        {
            <p class="contact-intro">Looking to get in touch? Send me a message.</p>

            <div class="form-wrapper">
                <EditForm Model="@contactForm" OnValidSubmit="@HandleSubmit">
                    <DataAnnotationsValidator />

                    @if (!string.IsNullOrEmpty(errorMessage))
                    {
                        <div class="form-message error visible">@errorMessage</div>
                    }

                    <div class="form-group">
                        <label for="name" class="form-label">Name</label>
                        <InputText id="name" @bind-Value="contactForm.Name"
                                   class="form-input" placeholder="Name" />
                        <ValidationMessage For="@(() => contactForm.Name)"
                                           class="form-error" />
                    </div>

                    <div class="form-group">
                        <label for="email" class="form-label">Email</label>
                        <InputText id="email" type="email" @bind-Value="contactForm.Email"
                                   class="form-input" placeholder="Email" />
                        <ValidationMessage For="@(() => contactForm.Email)"
                                           class="form-error" />
                    </div>

                    <div class="form-group">
                        <label for="message" class="form-label">Message</label>
                        <InputTextArea id="message" @bind-Value="contactForm.Message"
                                       rows="6" class="form-input form-textarea"
                                       placeholder="Message"
                                       @oninput="UpdateCharCount" />
                        <div class="form-meta">
                            <ValidationMessage For="@(() => contactForm.Message)"
                                               class="form-error" />
                            <span class="char-counter @GetCharCounterClass()">
                                @RemainingChars characters remaining
                            </span>
                        </div>
                    </div>

                    <button type="submit" class="form-submit @(isSubmitting ? "loading" : "")"
                            disabled="@isSubmitting">
                        <span class="submit-text">Send Message</span>
                        <span class="submit-loader"></span>
                    </button>
                </EditForm>

                <div class="form-overlay @(isSubmitting ? "visible" : "")">
                    <div class="overlay-spinner"></div>
                    <p class="overlay-text">Sending...</p>
                </div>
            </div>
        }
        else
        {
            <div class="success-state visible">
                <div class="success-icon">✓</div>
                <h3 class="success-title">Thank You!</h3>
                <p class="success-message">
                    Your message has been sent successfully. I'll get back to you soon.
                </p>
            </div>
        }
    </div>
</section>

@code {
    private ContactFormModel contactForm = new();
    private bool isSubmitting = false;
    private bool isSubmitted = false;
    private string errorMessage = string.Empty;

    [Inject] private IContactService ContactService { get; set; } = default!;
    [Inject] private IHttpContextAccessor HttpContextAccessor { get; set; } = default!;
    [Inject] private ILogger<Home> Logger { get; set; } = default!;

    private int RemainingChars => 500 - (contactForm.Message?.Length ?? 0);

    private string GetCharCounterClass()
    {
        if (RemainingChars <= 0) return "limit";
        if (RemainingChars < 50) return "warning";
        return "";
    }

    private void UpdateCharCount(ChangeEventArgs e)
    {
        // Force re-render for character count
        StateHasChanged();
    }

    private async Task HandleSubmit()
    {
        isSubmitting = true;
        errorMessage = string.Empty;

        try
        {
            var httpContext = HttpContextAccessor.HttpContext;
            var ipAddress = httpContext?.Connection.RemoteIpAddress?.ToString();
            var userAgent = httpContext?.Request.Headers["User-Agent"].ToString();

            await ContactService.SubmitContactFormAsync(
                contactForm,
                ipAddress,
                userAgent);

            isSubmitted = true;
            Logger.LogInformation("Contact form submitted successfully");
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error submitting contact form");
            errorMessage = "An error occurred while submitting your message. Please try again.";
        }
        finally
        {
            isSubmitting = false;
        }
    }
}
```

2. **Register IHttpContextAccessor in Program.cs:**
```csharp
builder.Services.AddHttpContextAccessor();
```

**Acceptance Criteria:**
- [ ] Form renders correctly
- [ ] Validation works
- [ ] Character counter updates
- [ ] Submission works
- [ ] Loading state shows
- [ ] Success state shows
- [ ] Error handling works
- [ ] Form is accessible

---

#### Task 2.9: Test Contact Form
**Estimated Time:** 1-2 hours

**Test Scenarios:**

1. **Validation Testing:**
   - [ ] Submit empty form → all fields show errors
   - [ ] Enter invalid email → email error shows
   - [ ] Enter name too long → error shows
   - [ ] Enter message too short → error shows
   - [ ] Enter message too long → prevented
   - [ ] Character counter updates correctly

2. **Submission Testing:**
   - [ ] Submit valid form → success
   - [ ] Check database for submission
   - [ ] Verify timestamp is UTC
   - [ ] Verify IP address captured
   - [ ] Verify User-Agent captured
   - [ ] Success message displays
   - [ ] Form clears

3. **Error Testing:**
   - [ ] Simulate database error → error message shows
   - [ ] Form data preserved on error
   - [ ] Can retry submission

4. **UI Testing:**
   - [ ] Loading overlay shows during submission
   - [ ] Button disabled during submission
   - [ ] Success animation plays
   - [ ] Responsive on mobile

**Acceptance Criteria:**
- [ ] All validation scenarios pass
- [ ] Submissions saved to database
- [ ] Error handling works
- [ ] UI states work correctly

---

### Phase 2 Completion Criteria

- [ ] Database configured with SQLite
- [ ] Entity models created
- [ ] EF Core migrations created and applied
- [ ] Service layer implemented
- [ ] Contact form functional
- [ ] Form validation works
- [ ] Submissions saved to database
- [ ] Success/error states work
- [ ] All Phase 2 tests pass

---

## 4. Phase 3: Admin Features

**Goal:** Implement admin authentication and contact submission management

**Duration:** 2-3 days

### 3.1 Authentication Setup

#### Task 3.1: Configure Identity
**Estimated Time:** 1 hour

**Steps:**

1. **Update Program.cs with Identity configuration:**
```csharp
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    // Password settings
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 8;

    // Lockout settings
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;

    // User settings
    options.User.RequireUniqueEmail = true;
    options.SignIn.RequireConfirmedEmail = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.ExpireTimeSpan = TimeSpan.FromDays(7);
    options.LoginPath = "/admin/login";
    options.AccessDeniedPath = "/admin/login";
    options.SlidingExpiration = true;
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy =>
        policy.RequireRole("Admin"));
});
```

2. **Add authentication middleware:**
```csharp
app.UseAuthentication();
app.UseAuthorization();
```

**Acceptance Criteria:**
- [ ] Identity configured
- [ ] Cookie authentication set up
- [ ] Authorization policies defined
- [ ] Middleware added

---

#### Task 3.2: Create Admin User Seed Data
**Estimated Time:** 1 hour

**Steps:**

1. **Create Data/DbInitializer.cs:**
```csharp
using Microsoft.AspNetCore.Identity;
using Portfolio.Web.Models.Entities;

namespace Portfolio.Web.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(
        IServiceProvider serviceProvider,
        IConfiguration configuration)
    {
        var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        // Create Admin role
        if (!await roleManager.RoleExistsAsync("Admin"))
        {
            await roleManager.CreateAsync(new IdentityRole("Admin"));
        }

        // Create admin user
        var adminEmail = configuration["AdminUser:Email"] ?? "admin@cpike.ca";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);

        if (adminUser == null)
        {
            adminUser = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true,
                DisplayName = "Admin"
            };

            var adminPassword = configuration["AdminUser:Password"]
                ?? throw new InvalidOperationException("Admin password not configured");

            var result = await userManager.CreateAsync(adminUser, adminPassword);

            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }
        }
    }
}
```

2. **Add admin credentials to appsettings.Development.json:**
```json
{
  "AdminUser": {
    "Email": "admin@cpike.ca",
    "Password": "Admin@123"
  }
}
```

3. **Call initializer in Program.cs:**
```csharp
// After app.Build() but before app.Run()
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        await DbInitializer.InitializeAsync(services, app.Configuration);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database");
    }
}
```

**Acceptance Criteria:**
- [ ] Initializer created
- [ ] Admin user credentials configured
- [ ] Initializer called on startup
- [ ] Admin user created in database
- [ ] Admin role assigned

---

### 3.2 Admin Pages

#### Task 3.3: Create Login Page
**Estimated Time:** 2 hours

**Steps:**

1. **Create Components/Pages/Admin/ directory:**
```bash
mkdir -p Components/Pages/Admin
```

2. **Create Components/Pages/Admin/Login.razor:**
```razor
@page "/admin/login"
@using Microsoft.AspNetCore.Identity
@using Portfolio.Web.Models.Entities

<PageTitle>Admin Login</PageTitle>

<div class="login-container">
    <div class="login-card">
        <h2 class="login-title">Admin Login</h2>

        @if (!string.IsNullOrEmpty(errorMessage))
        {
            <div class="login-error">@errorMessage</div>
        }

        <EditForm Model="@loginModel" OnValidSubmit="@HandleLogin">
            <DataAnnotationsValidator />

            <div class="form-group">
                <label for="email" class="form-label">Email</label>
                <InputText id="email" type="email" @bind-Value="loginModel.Email"
                           class="form-input" autocomplete="email" />
                <ValidationMessage For="@(() => loginModel.Email)" />
            </div>

            <div class="form-group">
                <label for="password" class="form-label">Password</label>
                <InputText id="password" type="password" @bind-Value="loginModel.Password"
                           class="form-input" autocomplete="current-password" />
                <ValidationMessage For="@(() => loginModel.Password)" />
            </div>

            <button type="submit" class="form-submit" disabled="@isLoggingIn">
                @if (isLoggingIn)
                {
                    <span>Logging in...</span>
                }
                else
                {
                    <span>Log In</span>
                }
            </button>
        </EditForm>
    </div>
</div>

@code {
    private LoginModel loginModel = new();
    private bool isLoggingIn = false;
    private string errorMessage = string.Empty;

    [Inject] private SignInManager<ApplicationUser> SignInManager { get; set; } = default!;
    [Inject] private NavigationManager Navigation { get; set; } = default!;
    [Inject] private ILogger<Login> Logger { get; set; } = default!;

    private async Task HandleLogin()
    {
        isLoggingIn = true;
        errorMessage = string.Empty;

        try
        {
            var result = await SignInManager.PasswordSignInAsync(
                loginModel.Email,
                loginModel.Password,
                isPersistent: true,
                lockoutOnFailure: true);

            if (result.Succeeded)
            {
                Logger.LogInformation("User {Email} logged in", loginModel.Email);
                Navigation.NavigateTo("/admin");
            }
            else if (result.IsLockedOut)
            {
                errorMessage = "Account locked due to too many failed login attempts. Please try again in 15 minutes.";
                Logger.LogWarning("User {Email} account locked", loginModel.Email);
            }
            else
            {
                errorMessage = "Invalid email or password";
                Logger.LogWarning("Failed login attempt for {Email}", loginModel.Email);
            }
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error during login");
            errorMessage = "An error occurred. Please try again.";
        }
        finally
        {
            isLoggingIn = false;
        }
    }

    public class LoginModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
```

3. **Create Login.razor.css:**
```css
.login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
}

.login-card {
    max-width: 400px;
    width: 100%;
    padding: 2rem;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-md);
    background: var(--color-surface);
}

.login-title {
    text-align: center;
    color: var(--color-primary);
    margin-bottom: 2rem;
}

.login-error {
    padding: 1rem;
    margin-bottom: 1rem;
    background-color: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 4px;
    color: rgb(239, 68, 68);
    text-align: center;
}
```

**Acceptance Criteria:**
- [ ] Login page accessible
- [ ] Form validation works
- [ ] Login with valid credentials succeeds
- [ ] Login with invalid credentials shows error
- [ ] Account lockout works
- [ ] Redirects to dashboard on success

---

#### Task 3.4: Create Admin Dashboard
**Estimated Time:** 4-5 hours

**Steps:**

1. **Create Components/Pages/Admin/Dashboard.razor:**
```razor
@page "/admin"
@attribute [Authorize(Roles = "Admin")]
@using Portfolio.Web.Models.DTOs

<PageTitle>Admin Dashboard</PageTitle>

<div class="admin-container">
    <header class="admin-header">
        <h1>Admin Dashboard</h1>
        <button class="logout-button" @onclick="Logout">Logout</button>
    </header>

    <div class="admin-stats">
        <div class="stat-card">
            <div class="stat-label">Total Submissions</div>
            <div class="stat-value">@totalSubmissions</div>
        </div>
        <div class="stat-card @(unreadCount > 0 ? "highlight" : "")">
            <div class="stat-label">Unread</div>
            <div class="stat-value">@unreadCount</div>
        </div>
    </div>

    <div class="submissions-section">
        <div class="submissions-header">
            <h2>Recent Submissions</h2>
            <div class="filter-buttons">
                <button class="filter-btn @(currentFilter == "all" ? "active" : "")"
                        @onclick='() => SetFilter("all")'>All</button>
                <button class="filter-btn @(currentFilter == "unread" ? "active" : "")"
                        @onclick='() => SetFilter("unread")'>Unread</button>
                <button class="filter-btn @(currentFilter == "read" ? "active" : "")"
                        @onclick='() => SetFilter("read")'>Read</button>
            </div>
        </div>

        @if (filteredSubmissions.Any())
        {
            <div class="submissions-list">
                @foreach (var submission in filteredSubmissions)
                {
                    <div class="submission-card @(!submission.IsRead ? "unread" : "")"
                         @onclick="() => SelectSubmission(submission.Id)">
                        <div class="submission-header">
                            <div class="submission-info">
                                <strong>@submission.Name</strong>
                                <span class="submission-email">@submission.Email</span>
                            </div>
                            <span class="submission-badge @(submission.IsRead ? "read" : "unread")">
                                @(submission.IsRead ? "Read" : "Unread")
                            </span>
                        </div>
                        <div class="submission-date">
                            @FormatDate(submission.SubmittedAt)
                        </div>
                        <div class="submission-preview">
                            @GetMessagePreview(submission.Message)
                        </div>
                    </div>
                }
            </div>
        }
        else
        {
            <div class="empty-state">
                <p>@GetEmptyMessage()</p>
            </div>
        }
    </div>

    @if (selectedSubmission != null)
    {
        <div class="modal-overlay" @onclick="CloseModal">
            <div class="modal-content" @onclick:stopPropagation="true">
                <div class="modal-header">
                    <h3>Submission Details</h3>
                    <button class="modal-close" @onclick="CloseModal">×</button>
                </div>
                <div class="modal-body">
                    <div class="detail-row">
                        <strong>Name:</strong> @selectedSubmission.Name
                    </div>
                    <div class="detail-row">
                        <strong>Email:</strong>
                        <a href="mailto:@selectedSubmission.Email">@selectedSubmission.Email</a>
                    </div>
                    <div class="detail-row">
                        <strong>Date:</strong> @selectedSubmission.SubmittedAt.ToString("f")
                    </div>
                    <div class="detail-row">
                        <strong>Message:</strong>
                        <p class="message-text">@selectedSubmission.Message</p>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="action-btn" @onclick="ToggleReadStatus">
                        @(selectedSubmission.IsRead ? "Mark Unread" : "Mark Read")
                    </button>
                    <button class="action-btn danger" @onclick="ShowDeleteConfirm">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    }

    @if (showDeleteConfirm)
    {
        <div class="modal-overlay">
            <div class="modal-content confirm-dialog">
                <h3>Confirm Delete</h3>
                <p>Are you sure you want to delete this submission from @selectedSubmission?.Name?</p>
                <p class="warning">This cannot be undone.</p>
                <div class="modal-actions">
                    <button class="action-btn" @onclick="CancelDelete">Cancel</button>
                    <button class="action-btn danger" @onclick="ConfirmDelete">Delete</button>
                </div>
            </div>
        </div>
    }
</div>

@code {
    private List<ContactSubmissionDto> submissions = new();
    private List<ContactSubmissionDto> filteredSubmissions = new();
    private ContactSubmissionDto? selectedSubmission = null;
    private string currentFilter = "all";
    private int totalSubmissions = 0;
    private int unreadCount = 0;
    private bool showDeleteConfirm = false;

    [Inject] private IContactService ContactService { get; set; } = default!;
    [Inject] private SignInManager<ApplicationUser> SignInManager { get; set; } = default!;
    [Inject] private NavigationManager Navigation { get; set; } = default!;

    protected override async Task OnInitializedAsync()
    {
        await LoadSubmissions();
    }

    private async Task LoadSubmissions()
    {
        submissions = await ContactService.GetAllSubmissionsAsync();
        totalSubmissions = submissions.Count;
        unreadCount = await ContactService.GetUnreadCountAsync();
        ApplyFilter();
    }

    private void SetFilter(string filter)
    {
        currentFilter = filter;
        ApplyFilter();
    }

    private void ApplyFilter()
    {
        filteredSubmissions = currentFilter switch
        {
            "unread" => submissions.Where(s => !s.IsRead).ToList(),
            "read" => submissions.Where(s => s.IsRead).ToList(),
            _ => submissions
        };
    }

    private async Task SelectSubmission(int id)
    {
        selectedSubmission = await ContactService.GetSubmissionByIdAsync(id);
    }

    private void CloseModal()
    {
        selectedSubmission = null;
        showDeleteConfirm = false;
    }

    private async Task ToggleReadStatus()
    {
        if (selectedSubmission != null)
        {
            await ContactService.MarkAsReadAsync(
                selectedSubmission.Id,
                !selectedSubmission.IsRead);

            await LoadSubmissions();
            selectedSubmission = await ContactService.GetSubmissionByIdAsync(selectedSubmission.Id);
        }
    }

    private void ShowDeleteConfirm()
    {
        showDeleteConfirm = true;
    }

    private void CancelDelete()
    {
        showDeleteConfirm = false;
    }

    private async Task ConfirmDelete()
    {
        if (selectedSubmission != null)
        {
            await ContactService.DeleteSubmissionAsync(selectedSubmission.Id);
            await LoadSubmissions();
            CloseModal();
        }
    }

    private async Task Logout()
    {
        await SignInManager.SignOutAsync();
        Navigation.NavigateTo("/");
    }

    private string FormatDate(DateTime date)
    {
        var timeSpan = DateTime.UtcNow - date;
        if (timeSpan.TotalHours < 24)
            return $"{(int)timeSpan.TotalHours} hours ago";
        if (timeSpan.TotalDays < 7)
            return $"{(int)timeSpan.TotalDays} days ago";
        return date.ToString("MMM d, yyyy");
    }

    private string GetMessagePreview(string message)
    {
        return message.Length > 100 ? message[..100] + "..." : message;
    }

    private string GetEmptyMessage()
    {
        return currentFilter switch
        {
            "unread" => "All caught up! No unread submissions.",
            "read" => "No read submissions.",
            _ => "No contact submissions yet."
        };
    }
}
```

2. **Create Dashboard.razor.css with admin styling**

**Acceptance Criteria:**
- [ ] Dashboard protected by authentication
- [ ] Redirects to login if not authenticated
- [ ] Shows submission statistics
- [ ] Lists submissions
- [ ] Filter buttons work
- [ ] Can view submission details
- [ ] Can mark as read/unread
- [ ] Can delete submissions
- [ ] Logout works

---

### Phase 3 Completion Criteria

- [ ] Authentication configured
- [ ] Admin user created
- [ ] Login page functional
- [ ] Dashboard displays submissions
- [ ] Mark as read/unread works
- [ ] Delete functionality works
- [ ] Authorization works (protected routes)
- [ ] Logout works

---

## 5. Phase 4: Polish & Deploy

**Goal:** Testing, optimization, and production deployment

**Duration:** 2-3 days

### Tasks:
- Performance optimization
- Accessibility review
- Cross-browser testing
- Security hardening
- Production configuration
- Deployment script update
- Documentation update

*[Detailed tasks for Phase 4 would follow similar structure]*

---

## 6. Testing Strategy

### Manual Testing Checklist
### Automated Testing (Future)
### Performance Testing
### Security Testing

---

## 7. Deployment Strategy

### Pre-deployment Checklist
### Deployment Steps
### Post-deployment Verification
### Monitoring Setup

---

## 8. Rollback Plan

### Backup Strategy
### Rollback Procedure
### Communication Plan

---

## 9. Success Criteria

- [ ] All user stories from Phase 1 complete
- [ ] Contact form fully functional
- [ ] Admin dashboard operational
- [ ] No critical bugs
- [ ] Performance meets requirements
- [ ] Security review passed
- [ ] Documentation complete
- [ ] Successfully deployed to production

---

**Document Version History**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-03 | cpike | Initial implementation plan |
