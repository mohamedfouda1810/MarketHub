using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MarketHub.API.Models;

namespace MarketHub.API.Controllers.v1;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/store-categories")]
public class StoreCategoriesController : BaseController
{
    [HttpGet("vendor/{vendorId}")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<object>>> GetVendorCategories([FromRoute] Guid vendorId)
    {
        return OkResponse<object>(new[] { new { Id = Guid.NewGuid(), Name = "Electronics" } });
    }

    [HttpPost]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<object>>> CreateCategory([FromBody] object command)
    {
        return OkResponse<object>(new { Id = Guid.NewGuid() }, "Category created successfully.");
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<object>>> UpdateCategory([FromRoute] Guid id, [FromBody] object command)
    {
        return OkResponse<object>(new { }, "Category updated successfully.");
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteCategory([FromRoute] Guid id)
    {
        return OkResponse<object>(new { }, "Category deleted successfully.");
    }

    [HttpPut("reorder")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<object>>> ReorderCategories([FromBody] object command)
    {
        return OkResponse<object>(new { }, "Categories reordered successfully.");
    }
}
