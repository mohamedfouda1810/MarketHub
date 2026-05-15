using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MarketHub.API.Models;
using MarketHub.Shared;

namespace MarketHub.API.Controllers.v1;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/products")]
public class ProductsController : BaseController
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<object>>> SearchProducts([FromQuery] string? searchTerm, [FromQuery] PaginationParams paginationParams)
    {
        Response.Headers.Append("X-Pagination", "{\"totalCount\":1000,\"pageSize\":10,\"currentPage\":1,\"totalPages\":100}");
        return OkResponse<object>(new { Items = new[] { new { Name = "Sample Product" } } });
    }

    [HttpGet("featured")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<object>>> GetFeaturedProducts()
    {
        return OkResponse<object>(new[] { new { Name = "Featured Product" } });
    }

    [HttpGet("{vendorSlug}/{slug}")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<object>>> GetProductDetail([FromRoute] string vendorSlug, [FromRoute] string slug)
    {
        return OkResponse<object>(new { Name = "Sample Product Detail", Vendor = vendorSlug });
    }

    [HttpGet("me")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<object>>> GetMyProducts([FromQuery] PaginationParams paginationParams)
    {
        Response.Headers.Append("X-Pagination", "{\"totalCount\":20,\"pageSize\":10,\"currentPage\":1,\"totalPages\":2}");
        return OkResponse<object>(new { Items = new[] { new { Name = "My Product" } } });
    }

    [HttpPost]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<object>>> CreateProduct([FromForm] object command, List<IFormFile> images)
    {
        return OkResponse<object>(new { Id = Guid.NewGuid() }, "Product created successfully.");
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<object>>> UpdateProduct([FromRoute] Guid id, [FromForm] object command)
    {
        return OkResponse<object>(new { }, "Product updated successfully.");
    }

    [HttpPut("{id}/publish")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<object>>> PublishProduct([FromRoute] Guid id)
    {
        return OkResponse<object>(new { }, "Product published successfully.");
    }

    [HttpPut("{id}/archive")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<object>>> ArchiveProduct([FromRoute] Guid id)
    {
        return OkResponse<object>(new { }, "Product archived successfully.");
    }

    [HttpPut("{id}/stock")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<object>>> AdjustStock([FromRoute] Guid id, [FromBody] object command)
    {
        return OkResponse<object>(new { }, "Product stock updated successfully.");
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteProduct([FromRoute] Guid id)
    {
        return OkResponse<object>(new { }, "Product deleted successfully.");
    }

    [HttpPost("{id}/images")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<object>>> UploadProductImages([FromRoute] Guid id, List<IFormFile> images)
    {
        return OkResponse<object>(new { }, "Images uploaded successfully.");
    }

    [HttpDelete("images/{imageId}")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteProductImage([FromRoute] Guid imageId)
    {
        return OkResponse<object>(new { }, "Image deleted successfully.");
    }
}
