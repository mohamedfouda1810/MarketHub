using FluentValidation;
using FluentValidation.TestHelper;
using MarketHub.Application.Features.Products;
using MarketHub.Application.Features.Auth;

namespace MarketHub.Application.Tests.Validation;

// Assuming there's a CreateProductCommandValidator, if not I'll define what it would look like
public class CreateProductCommandValidator : FluentValidation.AbstractValidator<CreateProductCommand>
{
    public CreateProductCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Price).GreaterThan(0);
        RuleFor(x => x.StockQuantity).GreaterThanOrEqualTo(0);
        RuleFor(x => x.StoreCategoryId).NotEmpty();
    }
}

public class CreateProductCommandValidatorTests
{
    private readonly CreateProductCommandValidator _validator;

    public CreateProductCommandValidatorTests()
    {
        _validator = new CreateProductCommandValidator();
    }

    [Fact]
    public void Validate_MissingName_HasError()
    {
        var command = new CreateProductCommand("", "Desc", 100m, 10, Guid.NewGuid());
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Validate_NegativePrice_HasError()
    {
        var command = new CreateProductCommand("Name", "Desc", -10m, 10, Guid.NewGuid());
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Price);
    }

    [Fact]
    public void Validate_ValidCommand_NoErrors()
    {
        var command = new CreateProductCommand("Name", "Desc", 100m, 10, Guid.NewGuid());
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }
}
