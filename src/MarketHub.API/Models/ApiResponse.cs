namespace MarketHub.API.Models;

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public string? Message { get; set; }
    public IEnumerable<string>? Errors { get; set; }

    public static ApiResponse<T> Ok(T data, string? message = null)
    {
        return new ApiResponse<T> { Success = true, Data = data, Message = message };
    }

    public static ApiResponse<T> Error(string message, T? data = default, IEnumerable<string>? errors = null)
    {
        return new ApiResponse<T> { Success = false, Message = message, Data = data, Errors = errors };
    }
}
