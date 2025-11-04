# Security Design Document

## Overview

Comprehensive security architecture for the portfolio website, covering authentication, authorization, registration code system, and security best practices. Built on ASP.NET Core Identity with role-based access control.

**Status**: Design Phase
**Last Updated**: January 4, 2025

---

## Table of Contents

1. [Authentication System](#authentication-system)
2. [Registration Code System](#registration-code-system)
3. [Authorization & Role Management](#authorization--role-management)
4. [Startup Bootstrapping](#startup-bootstrapping)
5. [Security Best Practices](#security-best-practices)
6. [Threat Model](#threat-model)
7. [Implementation Guide](#implementation-guide)

---

## Authentication System

### Framework

**ASP.NET Core Identity 9.0**
- Industry-standard authentication framework
- Built-in password hashing (PBKDF2)
- Cookie-based session management
- Entity Framework Core integration

### User Store

```csharp
// ApplicationDbContext already configured with Identity
public class ApplicationDbContext : IdentityDbContext<IdentityUser>
{
    public DbSet<ContactMessage> ContactMessages { get; set; }
    public DbSet<RegistrationCode> RegistrationCodes { get; set; }
}
```

### Configuration

**Program.cs Setup:**
```csharp
// Identity configuration
builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    // Password requirements
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 12;
    options.Password.RequiredUniqueChars = 4;

    // Lockout settings
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;

    // User settings
    options.User.RequireUniqueEmail = true;

    // Sign-in settings
    options.SignIn.RequireConfirmedEmail = false; // MVP: no email confirmation
    options.SignIn.RequireConfirmedAccount = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// Cookie configuration
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // HTTPS only
    options.Cookie.SameSite = SameSiteMode.Strict;
    options.ExpireTimeSpan = TimeSpan.FromDays(14);
    options.SlidingExpiration = true;

    options.LoginPath = "/Account/Login";
    options.LogoutPath = "/Account/Logout";
    options.AccessDeniedPath = "/Account/AccessDenied";
});
```

### Password Policy

**Requirements:**
- Minimum 12 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 digit
- At least 1 special character
- At least 4 unique characters

**Rationale:**
- Strong passwords reduce brute-force attack risk
- 12 characters minimum aligns with NIST guidelines
- Complexity requirements ensure password entropy

---

## Registration Code System

### Purpose

**Problem**: Prevent unauthorized admin account creation
**Solution**: One-time registration codes generated on app startup

### Architecture

```
┌─────────────────────────────────────────────────────┐
│              Application Startup                    │
│  1. Check if administrator user exists              │
│  2. If not, generate registration code              │
│  3. Save to database                                │
│  4. Print to console/logs                           │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│           Registration Wizard                       │
│  Step 1: Validate registration code                 │
│  Step 2: Create administrator account               │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│          Account Creation Process                   │
│  1. Create user with Identity                       │
│  2. Assign "Administrator" role                     │
│  3. Mark registration code as used                  │
│  4. Sign in user                                    │
└─────────────────────────────────────────────────────┘
```

### Database Model

```csharp
public class RegistrationCode
{
    public int Id { get; set; }                     // Primary key
    public string Code { get; set; }                // GUID format
    public DateTime CreatedAt { get; set; }         // UTC timestamp
    public DateTime? UsedAt { get; set; }           // When code was used
    public string? UsedByEmail { get; set; }        // Email of admin user
    public bool IsUsed { get; set; }                // Quick lookup flag
}
```

**Indexes:**
- Unique index on `Code` for fast validation
- Index on `IsUsed` for filtering

### Service Interface

```csharp
public interface IRegistrationCodeService
{
    /// <summary>
    /// Generates a new registration code and saves to database
    /// </summary>
    Task<string> GenerateCodeAsync();

    /// <summary>
    /// Validates a registration code (exists and not used)
    /// </summary>
    Task<bool> ValidateCodeAsync(string code);

    /// <summary>
    /// Marks a code as used after successful registration
    /// </summary>
    Task<bool> MarkAsUsedAsync(string code, string email);

    /// <summary>
    /// Checks if an administrator user exists (for bootstrapping)
    /// </summary>
    Task<bool> AdministratorUserExistsAsync();
}
```

### Implementation Details

**Code Generation:**
```csharp
public class RegistrationCodeService : IRegistrationCodeService
{
    private readonly IRegistrationCodeRepository _repository;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly ILogger<RegistrationCodeService> _logger;

    public async Task<string> GenerateCodeAsync()
    {
        var code = Guid.NewGuid().ToString();

        var registrationCode = new RegistrationCode
        {
            Code = code,
            CreatedAt = DateTime.UtcNow,
            IsUsed = false
        };

        await _repository.AddAsync(registrationCode);

        _logger.LogInformation("Generated registration code: {Code}", code);

        return code;
    }

    public async Task<bool> ValidateCodeAsync(string code)
    {
        var registrationCode = await _repository.GetByCodeAsync(code);
        return registrationCode != null && !registrationCode.IsUsed;
    }

    public async Task<bool> MarkAsUsedAsync(string code, string email)
    {
        return await _repository.MarkAsUsedAsync(code, email);
    }

    public async Task<bool> AdministratorUserExistsAsync()
    {
        var administrators = await _userManager.GetUsersInRoleAsync("Administrator");
        return administrators.Any();
    }
}
```

### Security Considerations

**✅ Secure:**
- Codes are GUIDs (128-bit, cryptographically random)
- One-time use only (marked as used after registration)
- Database-persisted (survives app restarts)
- Logged securely (only to console/logs accessible by server admin)

**❌ Potential Issues:**
- Console logs may be visible in hosting environments (mitigation: use secure log storage)
- No expiration time (mitigation: acceptable for single-admin MVP)
- No rate limiting on validation (mitigation: acceptable for low-traffic site)

**Future Enhancements:**
- Add expiration timestamp (e.g., 24 hours)
- Email code to site owner instead of console logging
- Add rate limiting on validation endpoint

---

## Authorization & Role Management

### Role-Based Access Control (RBAC)

**Core Roles:**
- `Administrator` - Full access to admin dashboard, message management, and all administrative features
- `User` - Authenticated users with limited permissions (for future features like commenting, favorites, etc.)

**Future Roles (Post-MVP):**
- `Moderator` - View and archive messages, no delete
- `Viewer` - Read-only access to messages

### Role Configuration

**Program.cs - Identity with Role Stores:**
```csharp
// Configure Identity with role support
// The IdentityRole generic parameter enables role store
// AddEntityFrameworkStores registers both UserStore<IdentityUser> and RoleStore<IdentityRole>
builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    // Password requirements
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 12;
    options.Password.RequiredUniqueChars = 4;

    // Lockout settings
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;

    // User settings
    options.User.RequireUniqueEmail = true;

    // Sign-in settings
    options.SignIn.RequireConfirmedEmail = false; // MVP: no email confirmation
    options.SignIn.RequireConfirmedAccount = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>()  // Registers UserStore AND RoleStore
.AddDefaultTokenProviders();

// Note: RoleManager<IdentityRole> is automatically registered by AddIdentity
// No need to call .AddRoleManager() explicitly
```

**Program.cs - Role Seeding:**
```csharp
// Seed roles on startup
var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

    // Seed Administrator role
    if (!await roleManager.RoleExistsAsync("Administrator"))
    {
        var result = await roleManager.CreateAsync(new IdentityRole("Administrator"));
        if (result.Succeeded)
        {
            logger.LogInformation("Created 'Administrator' role");
        }
        else
        {
            logger.LogError("Failed to create 'Administrator' role: {Errors}",
                string.Join(", ", result.Errors.Select(e => e.Description)));
        }
    }

    // Seed User role
    if (!await roleManager.RoleExistsAsync("User"))
    {
        var result = await roleManager.CreateAsync(new IdentityRole("User"));
        if (result.Succeeded)
        {
            logger.LogInformation("Created 'User' role");
        }
        else
        {
            logger.LogError("Failed to create 'User' role: {Errors}",
                string.Join(", ", result.Errors.Select(e => e.Description)));
        }
    }
}
```

**Role Store Registration Explained:**

1. **`AddIdentity<IdentityUser, IdentityRole>`** - The second generic parameter (`IdentityRole`) tells Identity to use roles
2. **`.AddEntityFrameworkStores<ApplicationDbContext>()`** - Registers:
   - `UserStore<IdentityUser>` - For managing users
   - `RoleStore<IdentityRole>` - For managing roles
   - Both use EF Core and the ApplicationDbContext
3. **`RoleManager<IdentityRole>`** - Automatically registered by `AddIdentity()`, provides role management APIs

### Protecting Routes

**Blazor Components:**
```csharp
// Admin dashboard - Administrator only
@page "/admin"
@attribute [Authorize(Roles = "Administrator")]

// Admin message list - Administrator only
@page "/admin/messages"
@attribute [Authorize(Roles = "Administrator")]

// Admin message detail - Administrator only
@page "/admin/messages/{id:int}"
@attribute [Authorize(Roles = "Administrator")]

// User profile - Any authenticated user
@page "/profile"
@attribute [Authorize] // Any authenticated user (Administrator or User)

// Example: Multiple roles
@page "/reports"
@attribute [Authorize(Roles = "Administrator,Moderator")] // Either role can access
```

**Conditional Rendering:**
```razor
<!-- Administrator-only content -->
<AuthorizeView Roles="Administrator">
    <Authorized>
        <a href="/admin">Admin Dashboard</a>
    </Authorized>
    <NotAuthorized>
        <!-- Public content or access denied message -->
    </NotAuthorized>
</AuthorizeView>

<!-- Any authenticated user -->
<AuthorizeView>
    <Authorized>
        <p>Welcome, @context.User.Identity?.Name!</p>
        <a href="/profile">My Profile</a>
    </Authorized>
    <NotAuthorized>
        <a href="/Account/Login">Login</a>
    </NotAuthorized>
</AuthorizeView>

<!-- Multiple roles -->
<AuthorizeView Roles="Administrator,Moderator">
    <Authorized>
        <a href="/reports">View Reports</a>
    </Authorized>
</AuthorizeView>
```

### Service Layer Authorization

**Policy-Based Authorization:**
```csharp
public class ContactMessageService : IContactMessageService
{
    private readonly IContactMessageRepository _repository;
    private readonly IAuthorizationService _authorizationService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public async Task<bool> DeleteMessageAsync(int id)
    {
        // Only administrators can delete
        var authResult = await _authorizationService.AuthorizeAsync(
            _httpContextAccessor.HttpContext.User,
            "AdministratorPolicy"
        );

        if (!authResult.Succeeded)
        {
            throw new UnauthorizedAccessException();
        }

        return await _repository.DeleteAsync(id);
    }
}
```

**Program.cs - Policy Registration:**
```csharp
builder.Services.AddAuthorizationBuilder()
    .AddPolicy("AdministratorPolicy", policy =>
        policy.RequireRole("Administrator"))
    .AddPolicy("AuthenticatedUserPolicy", policy =>
        policy.RequireAuthenticatedUser());
```

---

## Startup Bootstrapping

### Bootstrap Flow

**Application Startup Sequence:**

1. **App Starts** → Program.cs execution begins
2. **Database Check** → Ensure database exists and migrations applied
3. **Role Seeding** → Create "Administrator" and "User" roles if they don't exist
4. **Administrator Check** → Check if any users have "Administrator" role
5. **Code Generation** → If no administrator exists, generate registration code
6. **Console Output** → Print code to console/logs for site owner
7. **App Ready** → Application starts serving requests

### Implementation

**Program.cs - Bootstrap Logic:**
```csharp
var app = builder.Build();

// Bootstrap security on startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();

    try
    {
        // Ensure database exists and migrations are applied
        var dbContext = services.GetRequiredService<ApplicationDbContext>();
        await dbContext.Database.MigrateAsync();
        logger.LogInformation("Database migrations applied successfully");

        // Seed roles
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

        // Seed Administrator role
        if (!await roleManager.RoleExistsAsync("Administrator"))
        {
            var result = await roleManager.CreateAsync(new IdentityRole("Administrator"));
            if (result.Succeeded)
            {
                logger.LogInformation("Created 'Administrator' role");
            }
            else
            {
                logger.LogError("Failed to create 'Administrator' role: {Errors}",
                    string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }

        // Seed User role
        if (!await roleManager.RoleExistsAsync("User"))
        {
            var result = await roleManager.CreateAsync(new IdentityRole("User"));
            if (result.Succeeded)
            {
                logger.LogInformation("Created 'User' role");
            }
            else
            {
                logger.LogError("Failed to create 'User' role: {Errors}",
                    string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }

        // Check for administrator user and generate registration code if needed
        var registrationCodeService = services.GetRequiredService<IRegistrationCodeService>();
        var adminExists = await registrationCodeService.AdministratorUserExistsAsync();

        if (!adminExists)
        {
            var code = await registrationCodeService.GenerateCodeAsync();

            logger.LogWarning(
                "============================================\n" +
                "NO ADMINISTRATOR USER FOUND\n" +
                "Registration Code: {Code}\n" +
                "Use this code at /Account/Register to create your administrator account\n" +
                "============================================",
                code
            );

            // Also write to console directly for visibility
            Console.WriteLine("============================================");
            Console.WriteLine("NO ADMINISTRATOR USER FOUND");
            Console.WriteLine($"Registration Code: {code}");
            Console.WriteLine("Use this code at /Account/Register to create your administrator account");
            Console.WriteLine("============================================");
        }
        else
        {
            logger.LogInformation("Administrator user exists - registration code not generated");
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred during startup bootstrapping");
        throw;
    }
}

app.Run();
```

### Logging Output Example

**First Startup (No Administrator):**
```
info: Program[0]
      Database migrations applied successfully
info: Program[0]
      Created 'Administrator' role
info: Program[0]
      Created 'User' role
warn: Program[0]
      ============================================
      NO ADMINISTRATOR USER FOUND
      Registration Code: a1b2c3d4-e5f6-7890-abcd-ef1234567890
      Use this code at /Account/Register to create your administrator account
      ============================================
info: Microsoft.Hosting.Lifetime[0]
      Now listening on: https://localhost:5001
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

**Subsequent Startups (Administrator Exists):**
```
info: Program[0]
      Database migrations applied successfully
info: Program[0]
      Administrator user exists - registration code not generated
info: Microsoft.Hosting.Lifetime[0]
      Now listening on: https://localhost:5001
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

### Security Notes

**✅ Secure Bootstrapping:**
- Code generated only when needed (no administrator user exists)
- Code logged securely (only visible to server admin with console access)
- Code persisted to database (survives app restarts)
- One-time use enforced (marked as used after registration)

**❌ Considerations:**
- Server logs may be accessible in shared hosting (mitigation: use private hosting)
- Code visible in plain text (mitigation: acceptable for owner-generated code)
- No notification mechanism (mitigation: owner must check logs manually)

---

## Security Best Practices

### 1. Password Security

**Hashing:**
- ASP.NET Core Identity uses PBKDF2 with HMAC-SHA256
- 10,000 iterations by default
- Per-user random salt
- Never store plain-text passwords

**Validation:**
- Client-side validation for UX
- Server-side validation for security
- Strong password requirements enforced

### 2. Cookie Security

**Configuration:**
- `HttpOnly = true` - Prevents JavaScript access (XSS mitigation)
- `Secure = true` - HTTPS only (MitM mitigation)
- `SameSite = Strict` - CSRF mitigation
- Signed and encrypted by Data Protection API

### 3. Input Validation

**Contact Form:**
- Length limits on all fields
- Email format validation
- HTML encoding of all output
- Rate limiting (3 submissions per hour per IP)

**Registration Form:**
- Code format validation (GUID)
- Email uniqueness check
- Password strength validation
- CSRF tokens (built-in with Blazor)

### 4. SQL Injection Prevention

**Entity Framework Core:**
- All queries parameterized by default
- No raw SQL queries used
- LINQ to Entities for type-safe queries

### 5. XSS Prevention

**Blazor Automatic Encoding:**
- All `@variable` outputs are HTML-encoded
- Use `@((MarkupString)html)` only for trusted content
- Never render user input as raw HTML

### 6. CSRF Protection

**Blazor Built-in:**
- Anti-forgery tokens automatically added to forms
- Validated on server-side automatically
- No additional configuration needed

### 7. Rate Limiting

**Contact Form:**
- IP-based rate limiting
- 3 submissions per hour per IP
- In-memory cache storage
- Prevents spam and abuse

**Future: Login Rate Limiting**
- 5 failed attempts = 15-minute lockout
- Already configured in Identity options

### 8. HTTPS Enforcement

**Production Configuration:**
```csharp
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
    app.UseHttpsRedirection();
}
```

### 9. Logging & Monitoring

**Security Events to Log:**
- Failed login attempts
- Registration code generation
- Account creation
- Role assignments (Administrator, User)
- Message deletion
- Unauthorized access attempts

**Serilog Configuration:**
```csharp
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
    .WriteTo.Console()
    .WriteTo.File(
        "Logs/security-.txt",
        rollingInterval: RollingInterval.Day,
        restrictedToMinimumLevel: LogEventLevel.Warning
    )
    .CreateLogger();
```

### 10. Data Protection

**Email Addresses:**
- Stored as plain text (needed for contact)
- Not encrypted (acceptable for portfolio site)
- Access restricted to Administrator role only

**IP Addresses:**
- Stored for rate limiting
- Messages retained indefinitely (design decision)
- Access restricted to Administrator role only

**Passwords:**
- Never stored plain-text
- Hashed with PBKDF2
- Salted per-user
- Never logged

---

## Threat Model

### Threat Matrix

| Threat | Likelihood | Impact | Mitigation | Priority |
|--------|-----------|--------|------------|----------|
| **Unauthorized Administrator Registration** | Medium | High | Registration codes | ✅ High |
| **Brute Force Login** | Medium | Medium | Account lockout | ✅ High |
| **SQL Injection** | Low | High | Parameterized queries (EF Core) | ✅ High |
| **XSS Attacks** | Low | Medium | Automatic HTML encoding | ✅ High |
| **CSRF Attacks** | Low | Medium | Anti-forgery tokens | ✅ High |
| **Contact Form Spam** | High | Low | Rate limiting | ✅ Medium |
| **Session Hijacking** | Low | High | Secure cookies, HTTPS | ✅ High |
| **Password Guessing** | Medium | Medium | Strong password policy | ✅ High |
| **Registration Code Leakage** | Low | High | Secure logging | ⚠️ Medium |
| **Administrator Account Takeover** | Low | High | 2FA (future) | ⏳ Low |

### Attack Scenarios

#### 1. Unauthorized Administrator Registration Attempt

**Attack:**
- Attacker discovers `/Account/Register` page
- Attempts to register with Administrator role without valid code

**Mitigation:**
- Registration code required for Administrator role assignment
- Code validated against database
- One-time use enforced
- Code only accessible via server logs
- Regular users can register without code (assigned "User" role only)

**Residual Risk:** Low - attacker needs access to server logs to obtain registration code

---

#### 2. Contact Form Spam

**Attack:**
- Attacker submits many contact form messages
- Attempts to flood database or harass administrator

**Mitigation:**
- Rate limiting: 3 submissions per hour per IP
- In-memory cache tracks submissions
- Service layer validates before database insert

**Residual Risk:** Low - attacker can use multiple IPs (acceptable for MVP)

---

#### 3. Administrator Account Brute Force

**Attack:**
- Attacker attempts multiple login attempts with common passwords against Administrator account

**Mitigation:**
- Account lockout after 5 failed attempts
- 15-minute lockout period
- Strong password requirements (12 chars, complexity)
- Logged for monitoring

**Residual Risk:** Low - lockout prevents brute force

---

#### 4. Session Hijacking

**Attack:**
- Attacker steals Administrator session cookie
- Uses cookie to access admin dashboard

**Mitigation:**
- HttpOnly cookies (no JavaScript access)
- Secure cookies (HTTPS only)
- SameSite=Strict (prevents CSRF)
- 14-day expiration with sliding window

**Residual Risk:** Low - requires XSS or network access

---

## Implementation Guide

### Phase 1: RegistrationCode Entity & Repository

**Files to Create:**
1. `Data/Models/RegistrationCode.cs`
2. `Data/Repositories/IRegistrationCodeRepository.cs`
3. `Data/Repositories/RegistrationCodeRepository.cs`

**Database Migration:**
```bash
cd src/Portfolio.Web
dotnet ef migrations add AddRegistrationCode
dotnet ef database update
```

---

### Phase 2: RegistrationCodeService

**Files to Create:**
1. `Services/Auth/IRegistrationCodeService.cs`
2. `Services/Auth/RegistrationCodeService.cs`

**Dependencies:**
- `IRegistrationCodeRepository`
- `UserManager<IdentityUser>`
- `ILogger<RegistrationCodeService>`

---

### Phase 3: Program.cs Bootstrap Logic

**Modifications:**
1. Configure Identity with password requirements
2. Configure application cookies
3. Add role seeding
4. Add registration code generation on startup
5. Register services and repositories

---

### Phase 4: Registration Wizard

**Files to Modify:**
1. `Components/Pages/Account/Register.razor` (existing)
2. `Components/Pages/Account/Register.razor.cs` (create)

**Implementation:**
- Step 1: Registration code input and validation
- Step 2: Standard registration form
- On submit: Create user, assign "Administrator" role, mark code as used
- Default user registration (without code): Assign "User" role

---

### Phase 5: Restyle Authentication Pages

**Files to Modify:**
1. `Components/Pages/Account/Login.razor`
2. `Components/Pages/Account/Register.razor`
3. `Components/Pages/Account/Manage/*.razor`

**Tasks:**
- Remove Bootstrap CSS classes
- Apply portfolio design tokens
- Match purple primary color scheme
- Ensure mobile responsiveness

---

### Phase 6: Authorization

**Files to Modify:**
1. `Components/Pages/Admin/*.razor` (add `[Authorize(Roles = "Administrator")]`)
2. `Components/Layout/MainLayout.razor` (add conditional nav links with `<AuthorizeView Roles="Administrator">`)

---

### Phase 7: Testing

**Test Cases:**

**Role Seeding:**
1. Verify "Administrator" role is created on first startup
2. Verify "User" role is created on first startup
3. Verify roles are not duplicated on subsequent startups

**Registration Code:**
4. Generate registration code on first startup (no administrator)
5. Validate registration code in wizard
6. Reject invalid or used registration codes

**Account Creation:**
7. Create administrator account successfully with registration code
8. Verify "Administrator" role assignment
9. Create regular user account without registration code
10. Verify "User" role assignment for regular users

**Authorization:**
11. Access admin routes with "Administrator" role
12. Deny access to admin routes with "User" role
13. Deny access to admin routes for anonymous users

**Security:**
14. Verify account lockout after 5 failed login attempts
15. Test rate limiting on contact form (3 per hour per IP)
16. Verify HTTPS and secure cookies in production
17. Verify password complexity requirements enforced

---

## Security Checklist

### Pre-Production

- [ ] HTTPS enforced in production
- [ ] Secure cookies configured (HttpOnly, Secure, SameSite)
- [ ] Strong password requirements enabled
- [ ] Account lockout configured
- [ ] Rate limiting tested
- [ ] Registration code system working
- [ ] "Administrator" and "User" roles created and seeded
- [ ] Administrator role protection verified on admin routes
- [ ] Security logging configured
- [ ] All user input validated
- [ ] SQL injection testing passed
- [ ] XSS testing passed
- [ ] CSRF tokens verified

### Post-Production

- [ ] Monitor failed login attempts
- [ ] Review security logs regularly
- [ ] Rotate registration codes if leaked
- [ ] Update dependencies for security patches
- [ ] Consider adding 2FA (future)
- [ ] Consider email notifications (future)
- [ ] Consider honeypot fields for spam (future)

---

## Future Enhancements

### Two-Factor Authentication (2FA)

- Add TOTP-based 2FA for administrator accounts
- Use Microsoft.AspNetCore.Identity.UI.Services
- QR code generation for authenticator apps
- Optional 2FA for regular user accounts

### Email Confirmation

- Require email confirmation for registration
- Send confirmation link via email service
- Verify email ownership before account activation

### Advanced Rate Limiting

- Distributed cache for multi-server deployments
- Different limits for authenticated vs. anonymous users
- Exponential backoff for repeated violations

### Security Headers

```csharp
app.Use(async (context, next) =>
{
    context.Response.Headers.Add("X-Frame-Options", "DENY");
    context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");
    context.Response.Headers.Add("Referrer-Policy", "no-referrer");
    context.Response.Headers.Add(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
    );
    await next();
});
```

### Audit Logging

- Comprehensive audit trail for all administrator actions
- Message views, updates, deletions
- User account changes
- Role assignments
- Login/logout events
- Searchable audit log in admin dashboard

---

## References

- [ASP.NET Core Identity](https://docs.microsoft.com/aspnet/core/security/authentication/identity)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST Password Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html)
- [ASP.NET Core Security Best Practices](https://docs.microsoft.com/aspnet/core/security/)
- [Entity Framework Core Security](https://docs.microsoft.com/ef/core/miscellaneous/connection-strings)

---

**Document Version**: 1.1
**Last Updated**: November 4, 2025
**Author**: Portfolio Development Team

**Changelog:**
- v1.1 (Nov 4, 2025): Updated to use "Administrator" and "User" roles; clarified role store registration
- v1.0 (Jan 4, 2025): Initial version
