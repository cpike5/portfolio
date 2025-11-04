using Microsoft.AspNetCore.Components.Server.Circuits;

namespace Portfolio.Web.Middleware;

/// <summary>
/// Handles exceptions that occur in Blazor Server circuits
/// </summary>
public class CircuitExceptionHandler : CircuitHandler
{
    private readonly ILogger<CircuitExceptionHandler> _logger;

    public CircuitExceptionHandler(ILogger<CircuitExceptionHandler> logger)
    {
        _logger = logger;
    }

    public override Task OnCircuitOpenedAsync(Circuit circuit, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Circuit {CircuitId} opened", circuit.Id);
        return Task.CompletedTask;
    }

    public override Task OnCircuitClosedAsync(Circuit circuit, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Circuit {CircuitId} closed", circuit.Id);
        return Task.CompletedTask;
    }

    public override Task OnConnectionUpAsync(Circuit circuit, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Circuit {CircuitId} connection established", circuit.Id);
        return Task.CompletedTask;
    }

    public override Task OnConnectionDownAsync(Circuit circuit, CancellationToken cancellationToken)
    {
        _logger.LogWarning("Circuit {CircuitId} connection lost", circuit.Id);
        return Task.CompletedTask;
    }

    public override Func<CircuitInboundActivityContext, Task> CreateInboundActivityHandler(
        Func<CircuitInboundActivityContext, Task> next)
    {
        return async context =>
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Unhandled exception in circuit {CircuitId}",
                    context.Circuit.Id);

                // Re-throw to allow default error handling
                throw;
            }
        };
    }
}
