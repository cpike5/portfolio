# Contact System Design Document

## Overview

Database-backed contact form system with admin management panel for the portfolio website. Built entirely in Blazor Server with ASP.NET Core Identity for authentication.

**Status**: Design Phase
**Last Updated**: January 4, 2025

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Blazor Components                    │
│  Public: Contact.razor                                  │
│  Admin:  MessageList.razor, MessageDetail.razor         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  Service Layer                          │
│  Business Logic, Validation, Rate Limiting              │
│  - IContactMessageService / ContactMessageService       │
│  - IRateLimitService / RateLimitService                 │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                Repository Layer                         │
│  Data Access Only                                       │
│  - IContactMessageRepository / ContactMessageRepository │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                     Data Layer                          │
│  - PortfolioDbContext                                   │
│  - ContactMessage Entity                                │
│  - SQLite Database (portfolio.db)                       │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Framework**: ASP.NET Core 8+ (Blazor Server)
- **Database**: SQLite with Entity Framework Core
- **Authentication**: ASP.NET Core Identity with Role Manager
- **UI Framework**: Blazor components with minimal Bootstrap
- **State Management**: Blazor component state + scoped services

---

## Database Design

### ContactMessage Entity

```csharp
public class ContactMessage
{
    public int Id { get; set; }                     // Primary key
    public string Name { get; set; }                // Required, max 100
    public string Email { get; set; }               // Required, max 255
    public string? Subject { get; set; }            // Optional, max 200
    public string Message { get; set; }             // Required, max 5000
    public DateTime SubmittedAt { get; set; }       // UTC timestamp
    public string? IpAddress { get; set; }          // Optional, max 45 (IPv6)
    public MessageStatus Status { get; set; }       // Enum
    public string? AdminNotes { get; set; }         // Optional, unlimited
    public DateTime? ReadAt { get; set; }           // Nullable timestamp
}
```

### MessageStatus Enum

```csharp
public enum MessageStatus
{
    Unread = 0,
    Read = 1,
    Archived = 2,
    Spam = 3
}
```

### Database Indexes

- Primary key on `Id` (auto-generated)
- Index on `Status` for filtering
- Index on `SubmittedAt` for sorting
- Composite index on `(Status, SubmittedAt)` for common queries

### RegistrationCode Entity

```csharp
public class RegistrationCode
{
    public int Id { get; set; }                     // Primary key
    public string Code { get; set; }                // Unique registration code (GUID)
    public DateTime CreatedAt { get; set; }         // UTC timestamp
    public DateTime? UsedAt { get; set; }           // Nullable timestamp
    public string? UsedByEmail { get; set; }        // Email of user who used it
    public bool IsUsed { get; set; }                // Flag for quick filtering
}
```

**Purpose**: One-time registration codes for admin account creation

**Database Indexes**:
- Primary key on `Id` (auto-generated)
- Unique index on `Code` for fast validation
- Index on `IsUsed` for filtering available codes

---

## File Structure

```
src/Portfolio.Web/
├── Components/
│   ├── Layout/
│   │   ├── MainLayout.razor              # Portfolio layout
│   │   └── AdminLayout.razor             # Admin area layout
│   │
│   ├── Pages/
│   │   ├── Home.razor                    # Existing home page
│   │   ├── Contact.razor                 # Public contact form
│   │   └── Admin/
│   │       ├── Index.razor               # Admin dashboard
│   │       ├── Messages/
│   │       │   ├── Index.razor           # Message list
│   │       │   └── Detail.razor          # Message detail (modal/page)
│   │       └── Login.razor               # Admin login
│   │
│   └── Shared/
│       └── MessageCard.razor             # Reusable message card
│
├── Data/
│   ├── PortfolioDbContext.cs             # EF Core DbContext
│   ├── Models/
│   │   ├── ContactMessage.cs             # Entity model
│   │   ├── MessageStatus.cs              # Enum
│   │   └── RegistrationCode.cs           # Registration code entity
│   ├── Repositories/
│   │   ├── IContactMessageRepository.cs  # Repository interface
│   │   ├── ContactMessageRepository.cs   # Repository implementation
│   │   ├── IRegistrationCodeRepository.cs # Registration code repository interface
│   │   └── RegistrationCodeRepository.cs # Registration code repository implementation
│   └── Migrations/
│       └── [timestamp]_AddContactMessages.cs
│
├── Services/
│   ├── Contact/
│   │   ├── IContactMessageService.cs     # Service interface
│   │   ├── ContactMessageService.cs      # Service implementation
│   │   └── DTOs/
│   │       ├── ContactMessageDto.cs      # Form submission DTO
│   │       ├── MessageFilterDto.cs       # Filter parameters
│   │       └── PagedResultDto.cs         # Pagination result
│   │
│   ├── Auth/
│   │   ├── IRegistrationCodeService.cs   # Registration code service interface
│   │   └── RegistrationCodeService.cs    # Registration code service implementation
│   │
│   ├── RateLimit/
│   │   ├── IRateLimitService.cs          # Rate limit interface
│   │   └── RateLimitService.cs           # Rate limit implementation
│   │
│   └── Extensions/
│       ├── ServiceCollectionExtensions.cs  # DI: Services
│       └── RepositoryExtensions.cs         # DI: Repositories
│
└── wwwroot/
    └── prototypes/
        └── admin/
            ├── index.html                # Admin layout prototype
            ├── admin.css                 # Prototype styles
            └── admin.js                  # Prototype interactivity
```

---

## Component Design

### 1. Public Contact Form (Contact.razor)

**Route**: `/contact`

**Features**:
- `EditForm` with `DataAnnotationsValidator`
- Fields: Name, Email, Subject (optional), Message
- Real-time validation with error messages
- Server-side rate limiting check
- Success/error toast notifications
- Form reset after successful submission
- Loading state during submission

**Validation Rules**:
- Name: Required, 2-100 characters
- Email: Required, valid email format, max 255 characters
- Subject: Optional, max 200 characters
- Message: Required, 10-5000 characters

**User Flow**:
1. User fills form
2. Client-side validation on blur/submit
3. Submit triggers rate limit check
4. If allowed, save to database
5. Show success message
6. Reset form

---

### 2. Admin Messages List (Admin/Messages/Index.razor)

**Route**: `/admin/messages`
**Authorization**: `[Authorize(Roles = "Admin")]`

**Features**:
- Status filter tabs (All, Unread, Read, Archived)
- Search input (name, email, subject, message)
- Message cards with preview
- Pagination (20 per page)
- Bulk actions (future enhancement)
- Export to CSV button
- Real-time unread count badge

**Message Card Display**:
- Unread indicator (purple dot)
- Sender name and email
- Subject line
- Message preview (first 150 characters)
- Timestamp (relative: "2h ago")
- Quick actions: View, Archive, Mark Spam

**Filtering Logic**:
- Status-based filtering
- Search across name, email, subject, message
- Debounced search (300ms)
- Preserves filter state on navigation

---

### 3. Message Detail Modal/Page (Admin/Messages/Detail.razor)

**Features**:
- Full message display
- Sender information (name, email)
- Subject and full message text
- Metadata section:
  - Received date/time
  - IP address
  - Current status badge
- Admin notes textarea
- Action buttons:
  - Mark as Read/Unread
  - Archive
  - Mark as Spam
  - Save Notes

**Actions**:
- Update status (Read, Archived, Spam)
- Add/edit admin notes
- Delete message (with confirmation)

---

### 4. Admin Layout (AdminLayout.razor)

**Design**: Hybrid layout extending portfolio aesthetic

**Structure**:
```
Header:
  - Logo: "cpike.ca"
  - Admin Badge: "ADMIN MODE"
  - Messages link with unread count
  - Logout button

Body:
  - @Body (page content)
```

**Styling**:
- Matches portfolio color scheme (purple primary)
- Dark theme (`--admin-bg: #0a0a0f`)
- Card-based design
- Mobile-responsive

---

### 5. Registration Wizard (Account/Register.razor)

**Route**: `/Account/Register`

**Design**: 2-step wizard for secure admin registration

**Step 1: Registration Code Validation**
- Single input field for registration code
- Real-time validation on blur
- Error message for invalid/used codes
- "Next" button to proceed to Step 2
- Link to login page for existing users

**Step 2: Account Creation**
- Standard registration fields:
  - Email (required, validated)
  - Password (required, strong password rules)
  - Confirm Password (required, must match)
- All fields validated client-side and server-side
- "Register" button to complete registration
- "Back" button to return to Step 1

**User Flow**:
1. User enters registration code
2. Code validated against database (exists and unused)
3. If valid, proceed to Step 2
4. User completes registration form
5. On submit:
   - Create user account
   - Assign "Admin" role
   - Mark registration code as used
   - Redirect to admin dashboard or login

**Error Handling**:
- Invalid code: "Invalid or already used registration code"
- Validation errors: Display inline with fields
- Registration failure: Display error message at top

**Styling**:
- Consistent with portfolio design tokens
- No Bootstrap dependencies
- Purple primary color scheme
- Dark theme with card-based layout
- Responsive design

---

## Service Layer

### IContactMessageService

```csharp
public interface IContactMessageService
{
    // Public form submission
    Task<ServiceResult<int>> SubmitMessageAsync(
        ContactMessageDto dto,
        string? ipAddress
    );

    // Admin: List messages with filtering
    Task<PagedResultDto<ContactMessage>> GetMessagesAsync(
        MessageFilterDto filter
    );

    // Admin: Get single message
    Task<ContactMessage?> GetMessageByIdAsync(int id);

    // Admin: Status management
    Task<bool> MarkAsReadAsync(int id);
    Task<bool> UpdateStatusAsync(int id, MessageStatus status);

    // Admin: Admin notes
    Task<bool> UpdateAdminNotesAsync(int id, string notes);

    // Admin: Delete
    Task<bool> DeleteMessageAsync(int id);

    // Admin: Analytics
    Task<int> GetUnreadCountAsync();
}
```

### IRateLimitService

```csharp
public interface IRateLimitService
{
    Task<bool> IsAllowedAsync(string ipAddress);
    Task RecordSubmissionAsync(string ipAddress);
}
```

**Rate Limiting Strategy**:
- **Limit**: 3 submissions per IP per hour
- **Storage**: `IMemoryCache` (in-memory, resets on restart - acceptable for MVP)
- **Cache Key**: `ratelimit:{ipAddress}`
- **Cache Value**: List of submission timestamps
- **Sliding Window**: Remove timestamps older than 1 hour

### IRegistrationCodeService

```csharp
public interface IRegistrationCodeService
{
    // Generate new registration code
    Task<string> GenerateCodeAsync();

    // Validate registration code (returns true if valid and unused)
    Task<bool> ValidateCodeAsync(string code);

    // Mark code as used
    Task<bool> MarkAsUsedAsync(string code, string email);

    // Check if admin user exists (for bootstrapping)
    Task<bool> AdminUserExistsAsync();
}
```

**Registration Code Strategy**:
- **Code Format**: GUID (e.g., `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)
- **Generation**: On app startup if no admin user exists
- **Usage**: One-time use, marked as used after successful registration
- **Bootstrap Flow**:
  1. App starts, checks for admin user
  2. If none exists, generates registration code
  3. Prints code to console/logs
  4. Admin uses code in 2-step registration wizard
  5. Code marked as used, admin account created with "Admin" role

---

## Repository Layer

### IContactMessageRepository

```csharp
public interface IContactMessageRepository
{
    // Create
    Task<int> AddAsync(ContactMessage message);

    // Read
    Task<ContactMessage?> GetByIdAsync(int id);
    Task<PagedResultDto<ContactMessage>> GetPagedAsync(
        MessageFilterDto filter
    );
    Task<int> GetUnreadCountAsync();

    // Update
    Task<bool> UpdateAsync(ContactMessage message);
    Task<bool> UpdateStatusAsync(int id, MessageStatus status);

    // Delete
    Task<bool> DeleteAsync(int id);
}
```

**Implementation Notes**:
- Uses `PortfolioDbContext` for data access
- All queries use async/await
- Implements efficient pagination with `Skip`/`Take`
- Uses EF Core tracking for updates
- Hard deletes only (no soft delete implementation)

### IRegistrationCodeRepository

```csharp
public interface IRegistrationCodeRepository
{
    // Create
    Task<int> AddAsync(RegistrationCode code);

    // Read
    Task<RegistrationCode?> GetByCodeAsync(string code);
    Task<bool> ExistsAsync(string code);

    // Update
    Task<bool> MarkAsUsedAsync(string code, string email);
}
```

**Implementation Notes**:
- Uses `PortfolioDbContext` for data access
- All queries use async/await
- Code validation should check both existence and `IsUsed` flag
- Hard deletes only (no soft delete implementation)

---

## Dependency Injection

### ServiceCollectionExtensions.cs

```csharp
public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddPortfolioServices(
        this IServiceCollection services
    )
    {
        services.AddScoped<IContactMessageService, ContactMessageService>();
        services.AddScoped<IRegistrationCodeService, RegistrationCodeService>();
        services.AddSingleton<IRateLimitService, RateLimitService>();

        return services;
    }
}
```

### RepositoryExtensions.cs

```csharp
public static class RepositoryExtensions
{
    public static IServiceCollection AddPortfolioRepositories(
        this IServiceCollection services
    )
    {
        services.AddScoped<IContactMessageRepository,
            ContactMessageRepository>();
        services.AddScoped<IRegistrationCodeRepository,
            RegistrationCodeRepository>();

        return services;
    }
}
```

### Program.cs Registration

```csharp
// Database
builder.Services.AddDbContext<PortfolioDbContext>(options =>
    options.UseSqlite(connectionString));

// Identity
builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<PortfolioDbContext>();

// Portfolio services
builder.Services.AddPortfolioRepositories();
builder.Services.AddPortfolioServices();

// Memory cache for rate limiting
builder.Services.AddMemoryCache();
```

---

## Security

### Authentication & Authorization

- **Framework**: ASP.NET Core Identity
- **User Store**: Entity Framework Core
- **Roles**: `Admin` role for admin area access
- **Login**: Cookie-based authentication
- **Session**: 14-day persistent cookie (optional)
- **Registration**: Protected by one-time registration codes
  - Codes generated automatically on startup if no admin exists
  - Printed to console/logs for secure distribution
  - Single admin user per portfolio site
  - Codes marked as used after successful registration

### Admin Area Protection

```csharp
@attribute [Authorize(Roles = "Admin")]
```

### Rate Limiting

- IP-based submission throttling
- 3 submissions per hour per IP address
- In-memory cache storage
- Prevents form spam and abuse

### Input Validation

- **Client-side**: Blazor `DataAnnotationsValidator`
- **Server-side**: Service layer validation
- **Sanitization**: HTML encode all user input
- **XSS Prevention**: Razor automatically encodes output

### Data Protection

- Email addresses stored as plain text (needed for admin contact)
- IP addresses stored for rate limiting
- No sensitive data stored beyond contact information
- Messages retained indefinitely (no auto-deletion policy)
- HTTPS enforced in production

---

## Implementation Phases

### Phase 1: Database & Models ✓
- [x] Create ContactMessage entity
- [x] Create MessageStatus enum
- [x] Update PortfolioDbContext
- [x] Generate EF Core migration

### Phase 2: Repository Layer
- [ ] Create IContactMessageRepository
- [ ] Implement ContactMessageRepository
- [ ] Write unit tests for repository

### Phase 3: Service Layer
- [ ] Create DTOs (ContactMessageDto, MessageFilterDto, PagedResultDto)
- [ ] Create IContactMessageService
- [ ] Implement ContactMessageService
- [ ] Create IRateLimitService
- [ ] Implement RateLimitService
- [ ] Write unit tests for services

### Phase 4: Dependency Injection
- [ ] Create ServiceCollectionExtensions
- [ ] Create RepositoryExtensions
- [ ] Update Program.cs

### Phase 5: Public Contact Form
- [ ] Create Contact.razor component
- [ ] Implement form with EditForm
- [ ] Add validation and error handling
- [ ] Test rate limiting
- [ ] Add success/error notifications

### Phase 6: Admin Layout
- [ ] Create AdminLayout.razor
- [ ] Port styles from prototype
- [ ] Add navigation and logout

### Phase 7: Admin Messages List
- [ ] Create Admin/Messages/Index.razor
- [ ] Implement status tabs
- [ ] Add search functionality
- [ ] Implement pagination
- [ ] Create MessageCard shared component

### Phase 8: Message Detail
- [ ] Create Admin/Messages/Detail.razor (modal or page)
- [ ] Display full message and metadata
- [ ] Implement status updates
- [ ] Add admin notes functionality
- [ ] Add delete confirmation

### Phase 9: Authentication & Registration Codes
- [x] Configure ASP.NET Core Identity (already scaffolded)
- [ ] Create RegistrationCode entity and repository
- [ ] Implement IRegistrationCodeService
- [ ] Add registration code generation on startup
- [ ] Modify Register page to 2-step wizard:
  - Step 1: Enter and validate registration code
  - Step 2: Complete registration form
- [ ] Strip Bootstrap from default Identity pages
- [ ] Restyle authentication pages with portfolio design tokens
- [ ] Add admin role assignment on registration
- [ ] Add authorization to admin routes
- [ ] Test complete authentication flow

### Phase 10: Testing & Polish
- [ ] End-to-end testing
- [ ] Mobile responsiveness testing
- [ ] Performance optimization
- [ ] Add loading states
- [ ] Error handling refinement

---

## Future Enhancements

### Phase 11+ (Post-MVP)

- **Email Notifications**: Send email to admin on new message
- **Reply Feature**: Reply to messages via integrated email
- **Email Templates**: Canned responses for common inquiries
- **Advanced Spam Detection**: Honeypot fields, CAPTCHA integration
- **Analytics Dashboard**: Message trends, response times
- **Export Functionality**: CSV/Excel export with date filtering
- **Real-time Updates**: SignalR for live message notifications
- **Bulk Actions**: Archive/delete multiple messages
- **Message Tags**: Categorize messages with custom tags
- **Search History**: Save common search filters
- **Mobile App**: Dedicated admin mobile interface
- **GDPR Compliance**: Data export and deletion (if needed)

---

## Design Reference

### Prototype

HTML/CSS/JS prototype available at:
- `preview/prototypes/admin/index.html`
- View in browser for visual reference

### Color Palette

- **Primary**: `#b741fe` (purple)
- **Background**: `#0a0a0f` (dark)
- **Card Background**: `#13131a`
- **Border**: `#1f1f2e`
- **Text Primary**: `#ffffff`
- **Text Secondary**: `#b0b0c8`
- **Text Muted**: `#707088`

### Typography

- **Font Family**: Inter (portfolio standard)
- **Headings**: 600 weight
- **Body**: 400 weight
- **Code**: Monospace

---

## Development Guidelines

### Coding Standards

- Follow C# naming conventions (PascalCase for public members)
- Use async/await for all I/O operations
- Implement proper exception handling
- Add XML documentation comments to public APIs
- Keep components small and focused (SRP)
- Use dependency injection for all services

### Testing Strategy

- Unit tests for services and repositories
- Integration tests for database operations
- Component tests for Blazor components (bUnit)
- Manual testing for UI/UX flows

### Performance Considerations

- Use pagination to limit query results
- Index database columns used in WHERE/ORDER BY
- Cache unread count (invalidate on status change)
- Debounce search input (300ms)
- Use scoped services for per-request state

---

## Deployment

### Database Migration

```bash
cd src/Portfolio.Web
dotnet ef migrations add AddContactMessages
dotnet ef database update
```

### Production Checklist

- [ ] Run database migrations
- [ ] Create admin user account
- [ ] Configure HTTPS
- [ ] Set up rate limiting
- [ ] Test authentication flow
- [ ] Verify email validation
- [ ] Test mobile responsiveness
- [ ] Monitor performance

---

## Questions & Decisions

### Resolved

- ✓ Authentication: ASP.NET Core Identity with Role Manager
- ✓ Registration: 2-step wizard with one-time registration codes
- ✓ Admin Bootstrap: Auto-generate code on startup if no admin exists
- ✓ Email Notifications: Not for MVP
- ✓ Admin Layout: Separate hybrid design
- ✓ Reply Feature: Not for MVP
- ✓ Spam Protection: Basic IP-based rate limiting
- ✓ Database Backup: Not a priority for MVP
- ✓ Admin User Management: Single admin user, role-based authorization
- ✓ Message Retention: Keep messages indefinitely
- ✓ Soft Delete: No soft delete - hard deletes only

---

## References

- [ASP.NET Core Identity Documentation](https://docs.microsoft.com/aspnet/core/security/authentication/identity)
- [Entity Framework Core](https://docs.microsoft.com/ef/core/)
- [Blazor Component Lifecycle](https://docs.microsoft.com/aspnet/core/blazor/components/lifecycle)
- Portfolio Design System: `/tokens.css`

---

**Document Version**: 1.0
**Last Updated**: January 4, 2025
**Author**: Portfolio Development Team
