namespace Portfolio.Web.Models;

/// <summary>
/// Standardized error response model for API and client responses
/// </summary>
public class ErrorResponse
{
    /// <summary>
    /// Unique identifier for tracking this error occurrence
    /// </summary>
    public string ErrorId { get; set; } = string.Empty;

    /// <summary>
    /// HTTP status code
    /// </summary>
    public int StatusCode { get; set; }

    /// <summary>
    /// User-friendly error message
    /// </summary>
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// Detailed error information (only in development)
    /// </summary>
    public string? Details { get; set; }

    /// <summary>
    /// Stack trace (only in development)
    /// </summary>
    public string? StackTrace { get; set; }

    /// <summary>
    /// Timestamp when the error occurred
    /// </summary>
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Request path where the error occurred
    /// </summary>
    public string? Path { get; set; }
}
