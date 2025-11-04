# Technical Specifications

## Project: Portfolio Website - Blazor Server Migration

**Version:** 1.0
**Date:** 2025-11-03
**Status:** Planning

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Data Models](#data-models)
5. [Database Schema](#database-schema)
6. [Component Architecture](#component-architecture)
7. [Services & Business Logic](#services--business-logic)
8. [Authentication & Authorization](#authentication--authorization)
9. [Logging & Monitoring](#logging--monitoring)
10. [Configuration Management](#configuration-management)
11. [Deployment Architecture](#deployment-architecture)
12. [Performance Considerations](#performance-considerations)
13. [Security Considerations](#security-considerations)

---

## 1. System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Client Browser                    │
│  (HTML/CSS/JS + SignalR for Blazor Server updates) │
└─────────────────┬───────────────────────────────────┘
                  │ HTTPS
                  │
┌─────────────────▼───────────────────────────────────┐
│              Blazor Server App                       │
│  ┌──────────────────────────────────────────────┐  │
│  │         Presentation Layer                    │  │
│  │  (Razor Components, Pages, Layouts)          │  │
│  └──────────────────┬───────────────────────────┘  │
│                     │                                │
│  ┌──────────────────▼───────────────────────────┐  │
│  │         Business Logic Layer                  │  │
│  │  (Services, Validators, DTOs)                │  │
│  └──────────────────┬───────────────────────────┘  │
│                     │                                │
│  ┌──────────────────▼───────────────────────────┐  │
│  │         Data Access Layer                     │  │
│  │  (EF Core DbContext, Repositories)           │  │
│  └──────────────────┬───────────────────────────┘  │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│              Database Layer                          │
│  SQLite (default) / SQL Server (optional)           │
└─────────────────────────────────────────────────────┘
```

### Communication Patterns

- **Client ↔ Server**: SignalR WebSocket connection
- **Server ↔ Database**: EF Core with ADO.NET
- **Component Communication**: EventCallback, CascadingParameter

---

## 2. Technology Stack

### Runtime & Framework
- **.NET Version**: 8 LTS or 9 (latest stable)
- **Language**: C# 12
- **Web Framework**: ASP.NET Core Blazor Server
- **UI Framework**: Blazor Components

### Database
- **Primary**: SQLite 3.x (file-based)
- **Optional**: SQL Server 2019+ / Azure SQL
- **ORM**: Entity Framework Core 8/9
- **Migrations**: EF Core Migrations

### Authentication & Authorization
- **Framework**: ASP.NET Core Identity
- **Password Hashing**: PBKDF2 (Identity default)
- **Session Management**: Cookie-based authentication

### Logging & Monitoring
- **Structured Logging**: Serilog
- **Sinks**: Console, File, SQLite (optional)
- **Log Enrichment**: Context enrichers (machine, user, request)

### Front-end
- **CSS**: Custom CSS (tokens.css, styles.css)
- **Icons**: SVG inline
- **Fonts**: Google Fonts (Inter)
- **JavaScript**: Minimal (scroll effects, interop only)

### Development Tools
- **IDE**: Visual Studio 2022 / VS Code / Rider
- **Version Control**: Git
- **Package Manager**: NuGet
- **Build System**: MSBuild / .NET CLI

### Testing (Future)
- **Unit Tests**: xUnit / NUnit
- **Integration Tests**: WebApplicationFactory
- **E2E Tests**: Playwright / Selenium

---

## 3. Project Structure

```
portfolio/
├── src/
│   └── Portfolio.Web/
│       ├── Components/
│       │   ├── Layout/
│       │   │   ├── MainLayout.razor
│       │   │   ├── MainLayout.razor.css
│       │   │   ├── NavMenu.razor
│       │   │   ├── MobileNav.razor
│       │   │   └── Footer.razor
│       │   ├── Pages/
│       │   │   ├── Home.razor
│       │   │   ├── Contact.razor
│       │   │   ├── UIShowcase.razor (future)
│       │   │   ├── Admin/
│       │   │   │   ├── Dashboard.razor
│       │   │   │   ├── Submissions.razor
│       │   │   │   └── Login.razor
│       │   │   └── Error.razor
│       │   ├── Showcase/ (future)
│       │   │   ├── ComponentSection.razor
│       │   │   ├── ComponentDemo.razor
│       │   │   ├── CodeBlock.razor
│       │   │   ├── TokenDisplay.razor
│       │   │   ├── ColorSwatch.razor
│       │   │   └── CopyButton.razor
│       │   └── Shared/
│       │       ├── ProjectCard.razor
│       │       ├── SkillGroup.razor
│       │       ├── WorkItem.razor
│       │       └── BackToTop.razor
│       ├── Data/
│       │   ├── ApplicationDbContext.cs
│       │   ├── DbInitializer.cs
│       │   └── Migrations/
│       ├── Models/
│       │   ├── Entities/
│       │   │   ├── ContactSubmission.cs
│       │   │   └── ApplicationUser.cs
│       │   ├── DTOs/
│       │   │   ├── ContactSubmissionDto.cs
│       │   │   └── ContactFormModel.cs
│       │   └── ViewModels/
│       │       └── AdminDashboardViewModel.cs
│       ├── Services/
│       │   ├── Interfaces/
│       │   │   └── IContactService.cs
│       │   └── ContactService.cs
│       ├── Options/
│       │   └── DatabaseOptions.cs
│       ├── wwwroot/
│       │   ├── css/
│       │   │   ├── tokens.css
│       │   │   ├── styles.css
│       │   │   ├── app.css
│       │   │   └── showcase.css (future)
│       │   ├── js/
│       │   │   └── site.js
│       │   └── assets/
│       │       └── preview.png
│       ├── appsettings.json
│       ├── appsettings.Development.json
│       ├── Program.cs
│       └── Portfolio.Web.csproj
├── docs/
│   ├── prd.md
│   ├── user-stories.md
│   ├── tech-specs.md
│   ├── functional-specs.md
│   ├── implementation-plan.md
│   └── ui-showcase-spec.md
├── infra/
│   └── deployment-notes.md
├── deploy.sh
├── CLAUDE.md
└── README.md
```

---

## 4. Data Models

### Entity Models

#### ContactSubmission.cs
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

#### ApplicationUser.cs
```csharp
namespace Portfolio.Web.Models.Entities;

public class ApplicationUser : IdentityUser
{
    // Add custom properties if needed in future
    public string? DisplayName { get; set; }
}
```

### DTOs (Data Transfer Objects)

#### ContactFormModel.cs
```csharp
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

#### ContactSubmissionDto.cs
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

### View Models

#### AdminDashboardViewModel.cs
```csharp
namespace Portfolio.Web.Models.ViewModels;

public class AdminDashboardViewModel
{
    public int TotalSubmissions { get; set; }
    public int UnreadCount { get; set; }
    public List<ContactSubmissionDto> RecentSubmissions { get; set; } = new();
}
```

---

## 5. Database Schema

### Tables

#### ContactSubmissions
```sql
CREATE TABLE ContactSubmissions (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Email TEXT NOT NULL,
    Message TEXT NOT NULL,
    SubmittedAt TEXT NOT NULL,  -- ISO 8601 datetime
    IsRead INTEGER NOT NULL DEFAULT 0,  -- Boolean as integer
    IpAddress TEXT,
    UserAgent TEXT
);

CREATE INDEX IX_ContactSubmissions_SubmittedAt ON ContactSubmissions(SubmittedAt DESC);
CREATE INDEX IX_ContactSubmissions_IsRead ON ContactSubmissions(IsRead);
```

#### AspNetUsers (Identity)
```sql
-- Standard ASP.NET Core Identity schema
-- Modified for SQLite compatibility (TEXT instead of NVARCHAR)
CREATE TABLE AspNetUsers (
    Id TEXT PRIMARY KEY,
    UserName TEXT,
    NormalizedUserName TEXT,
    Email TEXT,
    NormalizedEmail TEXT,
    EmailConfirmed INTEGER NOT NULL,
    PasswordHash TEXT,
    SecurityStamp TEXT,
    ConcurrencyStamp TEXT,
    PhoneNumber TEXT,
    PhoneNumberConfirmed INTEGER NOT NULL,
    TwoFactorEnabled INTEGER NOT NULL,
    LockoutEnd TEXT,
    LockoutEnabled INTEGER NOT NULL,
    AccessFailedCount INTEGER NOT NULL,
    DisplayName TEXT
);
-- Additional Identity tables: AspNetRoles, AspNetUserRoles, etc.
```

### Migration Strategy

1. **Initial Migration**: Create all Identity + ContactSubmissions tables
2. **SQLite-specific Considerations**:
   - Use `TEXT` for strings instead of `NVARCHAR`
   - Use `INTEGER` for booleans (0/1)
   - Use `TEXT` for DateTime (store as ISO 8601)
   - No `IDENTITY` specification needed (AUTOINCREMENT is implicit for INTEGER PRIMARY KEY)

### EF Core Configuration

```csharp
// ApplicationDbContext.cs
protected override void OnModelCreating(ModelBuilder builder)
{
    base.OnModelCreating(builder);

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
        // Override Identity string lengths for SQLite
        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                if (property.ClrType == typeof(string) &&
                    property.GetMaxLength() == null)
                {
                    // Set reasonable max length for unbounded strings
                    property.SetMaxLength(4000);
                }
            }
        }
    }
}
```

---

## 6. Component Architecture

### Component Hierarchy

```
App.razor
└── MainLayout.razor
    ├── NavMenu.razor (Desktop)
    ├── MobileNav.razor (Mobile)
    ├── @Body (Page Content)
    │   ├── Home.razor
    │   │   ├── Hero Section (inline)
    │   │   ├── About Section (inline)
    │   │   ├── Skills Section
    │   │   │   └── SkillGroup.razor (repeated)
    │   │   ├── Projects Section
    │   │   │   └── ProjectCard.razor (repeated)
    │   │   ├── Work Section
    │   │   │   └── WorkItem.razor (repeated)
    │   │   └── Contact Section (inline form)
    │   ├── Admin/Dashboard.razor (protected)
    │   │   └── Submissions list
    │   ├── Admin/Login.razor
    │   └── UIShowcase.razor (future)
    │       ├── ComponentSection.razor (repeated)
    │       ├── ComponentDemo.razor (repeated)
    │       ├── CodeBlock.razor
    │       ├── TokenDisplay.razor
    │       └── ColorSwatch.razor
    ├── Footer.razor
    └── BackToTop.razor
```

### Component Patterns

#### Page Components
- **Route**: `@page "/path"`
- **Code-behind**: Optional `.cs` file
- **Lifecycle**: OnInitialized, OnParametersSet, OnAfterRender
- **State Management**: Local component state

#### Layout Components
- **Inheritance**: `@inherits LayoutComponentBase`
- **Body Rendering**: `@Body`
- **Shared State**: CascadingValue for cross-component data

#### Shared/Reusable Components
- **Parameters**: `[Parameter]` attribute
- **Events**: `EventCallback<T>`
- **CSS Isolation**: `.razor.css` files

### Key Components Spec

#### NavMenu.razor
```razor
@* Desktop navigation *@
<nav class="navbar">
    <ul class="nav-links">
        <li><NavLink href="#home">Home</NavLink></li>
        <li><NavLink href="#about">About</NavLink></li>
        <li><NavLink href="#skills">Skills</NavLink></li>
        <li><NavLink href="#projects">Projects</NavLink></li>
        <li><NavLink href="#work">Work</NavLink></li>
        <li><NavLink href="#contact">Contact</NavLink></li>
        <AuthorizeView>
            <Authorized>
                <li><NavLink href="/admin">Admin</NavLink></li>
            </Authorized>
        </AuthorizeView>
    </ul>
</nav>

@code {
    // Active section tracking via JavaScript interop or Blazor logic
}
```

#### ProjectCard.razor
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

#### Contact Form (Home.razor section)
```razor
<EditForm Model="@contactForm" OnValidSubmit="@HandleSubmit">
    <DataAnnotationsValidator />

    <div class="form-group">
        <label for="name" class="form-label">Name</label>
        <InputText id="name" @bind-Value="contactForm.Name" class="form-input" />
        <ValidationMessage For="@(() => contactForm.Name)" class="form-error" />
    </div>

    <div class="form-group">
        <label for="email" class="form-label">Email</label>
        <InputText id="email" type="email" @bind-Value="contactForm.Email" class="form-input" />
        <ValidationMessage For="@(() => contactForm.Email)" class="form-error" />
    </div>

    <div class="form-group">
        <label for="message" class="form-label">Message</label>
        <InputTextArea id="message" @bind-Value="contactForm.Message"
                       rows="6" class="form-input form-textarea" />
        <ValidationMessage For="@(() => contactForm.Message)" class="form-error" />
        <span class="char-counter">@RemainingChars characters remaining</span>
    </div>

    <button type="submit" class="form-submit" disabled="@isSubmitting">
        @if (isSubmitting)
        {
            <span>Sending...</span>
        }
        else
        {
            <span>Send Message</span>
        }
    </button>
</EditForm>

@code {
    private ContactFormModel contactForm = new();
    private bool isSubmitting = false;

    [Inject] private IContactService ContactService { get; set; } = default!;

    private int RemainingChars => 500 - (contactForm.Message?.Length ?? 0);

    private async Task HandleSubmit()
    {
        isSubmitting = true;
        try
        {
            await ContactService.SubmitContactFormAsync(contactForm);
            // Show success message
            contactForm = new(); // Reset form
        }
        finally
        {
            isSubmitting = false;
        }
    }
}
```

---

## 7. Services & Business Logic

### Service Interfaces

#### IContactService.cs
```csharp
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

### Service Implementations

#### ContactService.cs
```csharp
namespace Portfolio.Web.Services;

public class ContactService : IContactService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ContactService> _logger;

    public ContactService(ApplicationDbContext context,
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
            .CountAsync(c => !c.IsRead);
    }
}
```

### Service Registration (Program.cs)

```csharp
builder.Services.AddScoped<IContactService, ContactService>();
```

---

## 8. Authentication & Authorization

### Identity Configuration

```csharp
// Program.cs
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

    // User settings
    options.User.RequireUniqueEmail = true;
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
```

### Authorization Policies

```csharp
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy =>
        policy.RequireRole("Admin"));
});
```

### Protected Pages

```razor
@page "/admin"
@attribute [Authorize(Roles = "Admin")]

<h2>Admin Dashboard</h2>
```

---

## 9. Logging & Monitoring

### Serilog Configuration

```csharp
// Program.cs
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.Hosting.Lifetime", LogEventLevel.Information)
    .Enrich.FromLogContext()
    .Enrich.WithMachineName()
    .Enrich.WithThreadId()
    .WriteTo.Console(
        outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}")
    .WriteTo.File(
        path: "logs/portfolio-.log",
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 30,
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}")
    .CreateLogger();

builder.Host.UseSerilog();
```

### appsettings.json Serilog Section

```json
{
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft": "Warning",
        "Microsoft.Hosting.Lifetime": "Information"
      }
    },
    "WriteTo": [
      { "Name": "Console" },
      {
        "Name": "File",
        "Args": {
          "path": "logs/portfolio-.log",
          "rollingInterval": "Day",
          "retainedFileCountLimit": 30
        }
      }
    ]
  }
}
```

### Structured Logging Examples

```csharp
_logger.LogInformation("Contact form submitted by {Name} at {Time}",
    name, DateTime.UtcNow);

_logger.LogWarning("Failed login attempt for {Email}", email);

_logger.LogError(exception, "Error processing contact submission {Id}", id);
```

---

## 10. Configuration Management

### appsettings.json Structure

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=portfolio.db"
  },
  "Database": {
    "Provider": "SQLite",
    "EnableSensitiveDataLogging": false
  },
  "Serilog": { ... },
  "AllowedHosts": "*"
}
```

### appsettings.Production.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=/var/www/data/portfolio.db"
  },
  "Database": {
    "Provider": "SQLite"
  },
  "Serilog": {
    "MinimumLevel": {
      "Default": "Warning"
    }
  }
}
```

### DatabaseOptions.cs

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

### Options Registration

```csharp
builder.Services.Configure<DatabaseOptions>(
    builder.Configuration.GetSection(DatabaseOptions.SectionName));
```

---

## 11. Deployment Architecture

### Deployment Options

#### Option 1: Standalone Deployment (Recommended)
```bash
dotnet publish -c Release -o /var/www/portfolio
```

- Self-contained: No (requires .NET runtime installed)
- Reverse proxy: nginx or Apache
- Process manager: systemd service
- Database: SQLite file in `/var/www/data/`

#### Option 2: Docker Container
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY publish/ .
ENTRYPOINT ["dotnet", "Portfolio.Web.dll"]
```

### Systemd Service Configuration

```ini
[Unit]
Description=Portfolio Blazor Server App
After=network.target

[Service]
Type=notify
WorkingDirectory=/var/www/portfolio
ExecStart=/usr/bin/dotnet /var/www/portfolio/Portfolio.Web.dll
Restart=always
RestartSec=10
SyslogIdentifier=portfolio
User=www-data
Environment=ASPNETCORE_ENVIRONMENT=Production

[Install]
WantedBy=multi-user.target
```

### Reverse Proxy (nginx)

```nginx
server {
    listen 80;
    server_name cpike.ca www.cpike.ca;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 12. Performance Considerations

### Optimization Strategies

1. **Component Rendering**
   - Use `@key` directive for list items
   - Implement `ShouldRender()` override where appropriate
   - Use `StateHasChanged()` judiciously

2. **Database Queries**
   - Use `AsNoTracking()` for read-only queries
   - Implement pagination for large result sets
   - Add indexes on frequently queried columns

3. **Static Assets**
   - Enable response compression
   - Use CDN for Google Fonts
   - Optimize images (WebP format, lazy loading)

4. **SignalR Connection**
   - Configure reconnection logic
   - Implement circuit handler for monitoring
   - Set appropriate timeout values

5. **Caching**
   - Output caching for static content (future)
   - Memory cache for frequently accessed data
   - Distributed cache if scaling horizontally

### Performance Configuration

```csharp
// Program.cs
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
});

builder.Services.AddServerSideBlazor()
    .AddCircuitOptions(options =>
    {
        options.DetailedErrors = builder.Environment.IsDevelopment();
        options.DisconnectedCircuitRetentionPeriod = TimeSpan.FromMinutes(3);
        options.JSInteropDefaultCallTimeout = TimeSpan.FromSeconds(60);
    });
```

---

## 13. Security Considerations

### Security Measures

1. **Input Validation**
   - Client-side: DataAnnotations
   - Server-side: Validate all inputs in services
   - Sanitize output where necessary

2. **SQL Injection Prevention**
   - Use EF Core (parameterized queries)
   - Never concatenate user input in SQL

3. **XSS Protection**
   - Blazor automatically encodes output
   - Be careful with `MarkupString`

4. **CSRF Protection**
   - Built-in to Blazor Server
   - Antiforgery tokens in forms

5. **Authentication**
   - Strong password requirements
   - Account lockout after failed attempts
   - Secure password storage (Identity default)

6. **HTTPS**
   - Enforce HTTPS in production
   - HSTS headers
   - Secure cookies

7. **Rate Limiting**
   - Implement rate limiting on contact form (future)
   - Prevent spam submissions

### Security Headers

```csharp
app.Use(async (context, next) =>
{
    context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Add("X-Frame-Options", "DENY");
    context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");
    context.Response.Headers.Add("Referrer-Policy", "no-referrer");
    await next();
});
```

---

## Appendix

### Package Dependencies

```xml
<PackageReference Include="Microsoft.AspNetCore.Identity.EntityFrameworkCore" Version="8.0.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Sqlite" Version="8.0.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="8.0.0" />
<PackageReference Include="Serilog.AspNetCore" Version="8.0.0" />
<PackageReference Include="Serilog.Sinks.Console" Version="5.0.1" />
<PackageReference Include="Serilog.Sinks.File" Version="5.0.0" />
```

### Environment Variables

- `ASPNETCORE_ENVIRONMENT`: Development / Production
- `ASPNETCORE_URLS`: http://localhost:5000
- `ConnectionStrings__DefaultConnection`: Override connection string

### Related Documents

- [Product Requirements Document](prd.md)
- [Functional Specifications](functional-specs.md)
- [Implementation Plan](implementation-plan.md)
- [UI Showcase Specification](ui-showcase-spec.md)
- [User Stories](user-stories.md)

---

**Document Version History**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-03 | cpike | Initial technical specifications |
| 1.1 | 2025-11-04 | cpike | Added UI Showcase feature architecture |
