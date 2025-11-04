using System.Diagnostics;
using System.Net;
using System.Text.Json;
using Portfolio.Web.Models;

namespace Portfolio.Web.Middleware;

/// <summary>
/// Middleware for handling unhandled exceptions in the HTTP pipeline
/// </summary>
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;
    private readonly IWebHostEnvironment _environment;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger,
        IWebHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        // Generate unique error ID for tracking
        var errorId = Activity.Current?.Id ?? context.TraceIdentifier;

        // Log the exception with full details
        _logger.LogError(
            exception,
            "Unhandled exception occurred. ErrorId: {ErrorId}, Path: {Path}, Method: {Method}",
            errorId,
            context.Request.Path,
            context.Request.Method);

        // Determine status code based on exception type
        var statusCode = exception switch
        {
            ArgumentNullException or ArgumentException => HttpStatusCode.BadRequest,
            UnauthorizedAccessException => HttpStatusCode.Unauthorized,
            KeyNotFoundException => HttpStatusCode.NotFound,
            InvalidOperationException => HttpStatusCode.Conflict,
            _ => HttpStatusCode.InternalServerError
        };

        // Create error response
        var errorResponse = new ErrorResponse
        {
            ErrorId = errorId,
            StatusCode = (int)statusCode,
            Message = _environment.IsDevelopment()
                ? exception.Message
                : "An error occurred while processing your request.",
            Path = context.Request.Path,
            Timestamp = DateTime.UtcNow
        };

        // Include detailed information in development
        if (_environment.IsDevelopment())
        {
            errorResponse.Details = exception.ToString();
            errorResponse.StackTrace = exception.StackTrace;
        }

        // Set response properties
        context.Response.StatusCode = (int)statusCode;

        // Check if this is an API request (wants JSON) or a browser request (wants HTML)
        var isApiRequest = context.Request.Path.StartsWithSegments("/api") ||
                          context.Request.Headers.Accept.ToString().Contains("application/json");

        if (isApiRequest)
        {
            // Return JSON response for API requests
            context.Response.ContentType = "application/json";
            var jsonResponse = JsonSerializer.Serialize(errorResponse, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = _environment.IsDevelopment()
            });
            await context.Response.WriteAsync(jsonResponse);
        }
        else
        {
            // Store error details in Items for the Error page to access
            context.Items["ErrorResponse"] = errorResponse;

            // For browser requests, redirect will be handled by the existing exception handler
            // This allows the built-in exception handler to work with our error details
            throw; // Re-throw to let the built-in handler redirect to /Error
        }
    }
}
