using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MarketHub.API.Models;
using MarketHub.Shared;
using MarketHub.Application.Features.Products;
using MarketHub.Application.Common.Interfaces;
using MarketHub.Domain.Common;
using MediatR;

namespace MarketHub.API.Controllers.v1;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/products")]
public class ProductsController : BaseController
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<PagedList<ProductDto>>>> SearchProducts([FromQuery] string? searchTerm, [FromQuery] ProductFilters filters, [FromQuery] PaginationParams paginationParams)
    {
        var query = new GetProductsQuery(searchTerm, filters, paginationParams.PageNumber, paginationParams.PageSize);
        var result = await Mediator.Send(query);
        
        Response.Headers.Append("X-Pagination", System.Text.Json.JsonSerializer.Serialize(new 
        { 
            result.TotalCount, 
            result.PageSize, 
            result.CurrentPage, 
            result.TotalPages 
        }));

        return OkResponse(result);
    }

    [HttpGet("featured")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<List<ProductDto>>>> GetFeaturedProducts()
    {
        var result = await Mediator.Send(new GetFeaturedProductsQuery());
        return OkResponse(result);
    }

    [HttpGet("{vendorSlug}/{slug}")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<ProductDto>>> GetProductDetail([FromRoute] string vendorSlug, [FromRoute] string slug)
    {
        var result = await Mediator.Send(new GetProductDetailQuery(vendorSlug, slug));
        return OkResponse(result);
    }

    [HttpGet("me")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<PagedList<ProductDto>>>> GetMyProducts([FromQuery] PaginationParams paginationParams)
    {
        var query = new GetVendorProductsQuery(paginationParams.PageNumber, paginationParams.PageSize);
        var result = await Mediator.Send(query);

        Response.Headers.Append("X-Pagination", System.Text.Json.JsonSerializer.Serialize(new 
        { 
            result.TotalCount, 
            result.PageSize, 
            result.CurrentPage, 
            result.TotalPages 
        }));

        return OkResponse(result);
    }

    [HttpPost]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<Guid>>> CreateProduct([FromForm] CreateProductCommand command, List<IFormFile> images)
    {
        var result = await Mediator.Send(command);
        return OkResponse(result, "Product created successfully.");
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<Unit>>> UpdateProduct([FromRoute] Guid id, [FromForm] UpdateProductCommand command)
    {
        if (id != command.Id) return BadRequestResponse<Unit>(Unit.Value, "ID mismatch.");
        var result = await Mediator.Send(command);
        return OkResponse(result, "Product updated successfully.");
    }

    [HttpPut("{id}/publish")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<Unit>>> PublishProduct([FromRoute] Guid id)
    {
        var result = await Mediator.Send(new PublishProductCommand(id));
        return OkResponse(result, "Product published successfully.");
    }

    [HttpPut("{id}/archive")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<Unit>>> ArchiveProduct([FromRoute] Guid id)
    {
        var result = await Mediator.Send(new ArchiveProductCommand(id));
        return OkResponse(result, "Product archived successfully.");
    }

    [HttpPut("{id}/stock")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<Unit>>> AdjustStock([FromRoute] Guid id, [FromBody] AdjustStockCommand command)
    {
        if (id != command.Id) return BadRequestResponse<Unit>(Unit.Value, "ID mismatch.");
        var result = await Mediator.Send(command);
        return OkResponse(result, "Product stock updated successfully.");
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<Unit>>> DeleteProduct([FromRoute] Guid id)
    {
        var result = await Mediator.Send(new DeleteProductCommand(id));
        return OkResponse(result, "Product deleted successfully.");
    }

    [HttpPost("{id}/images")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<object>>> UploadProductImages([FromRoute] Guid id, List<IFormFile> images, [FromServices] IFileStorageService fileStorageService)
    {
        if (images == null || images.Count == 0) return BadRequestResponse<object>(null, "No images uploaded.");

        var imageUrls = new List<string>();
        foreach (var image in images)
        {
            using var stream = image.OpenReadStream();
            var url = await fileStorageService.UploadFileAsync(stream, image.FileName, image.ContentType);
            imageUrls.Add(url);
            
            await Mediator.Send(new AddProductImageCommand(id, url));
        }

        return OkResponse<object>(new { ImageUrls = imageUrls }, "Images uploaded successfully.");
    }

    [HttpDelete("{id}/images/{imageId}")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteProductImage([FromRoute] Guid id, [FromRoute] Guid imageId)
    {
        await Mediator.Send(new DeleteProductImageCommand(id, imageId));
        return OkResponse<object>(new { }, "Image deleted successfully.");
    }
}
