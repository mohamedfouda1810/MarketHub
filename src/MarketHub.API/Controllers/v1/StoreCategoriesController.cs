using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MarketHub.API.Models;
using MarketHub.Application.Features.StoreCategories;
using MediatR;

namespace MarketHub.API.Controllers.v1;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/store-categories")]
public class StoreCategoriesController : BaseController
{
    [HttpGet("vendor/{vendorId}")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<List<StoreCategoryDto>>>> GetVendorCategories([FromRoute] Guid vendorId)
    {
        var result = await Mediator.Send(new GetStoreCategoriesQuery(vendorId, null));
        return OkResponse(result);
    }

    [HttpPost]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<Guid>>> CreateCategory([FromBody] CreateStoreCategoryCommand command)
    {
        var result = await Mediator.Send(command);
        return OkResponse(result, "Category created successfully.");
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<Unit>>> UpdateCategory([FromRoute] Guid id, [FromBody] UpdateStoreCategoryCommand command)
    {
        if (id != command.Id) return BadRequestResponse<Unit>(Unit.Value, "ID mismatch.");
        var result = await Mediator.Send(command);
        return OkResponse(result, "Category updated successfully.");
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<Unit>>> DeleteCategory([FromRoute] Guid id)
    {
        var result = await Mediator.Send(new DeleteStoreCategoryCommand(id));
        return OkResponse(result, "Category deleted successfully.");
    }

    [HttpPut("reorder")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<Unit>>> ReorderCategories([FromBody] ReorderStoreCategoriesCommand command)
    {
        var result = await Mediator.Send(command);
        return OkResponse(result, "Categories reordered successfully.");
    }
}
