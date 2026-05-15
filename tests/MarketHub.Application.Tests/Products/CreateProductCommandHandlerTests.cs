using Moq;
using MarketHub.Application.Features.Products;
using MarketHub.Domain.Interfaces;
using MarketHub.Domain.Entities;
using MarketHub.Application.Common.Interfaces;
using AutoMapper;
using FluentAssertions;
using MarketHub.Shared.Exceptions;

namespace MarketHub.Application.Tests.Products;

public class CreateProductCommandHandlerTests
{
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<ICurrentUserService> _currentUserServiceMock;
    private readonly ProductHandlers _handler;

    public CreateProductCommandHandlerTests()
    {
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _mapperMock = new Mock<IMapper>();
        _currentUserServiceMock = new Mock<ICurrentUserService>();
        _handler = new ProductHandlers(_unitOfWorkMock.Object, _mapperMock.Object, _currentUserServiceMock.Object);
    }

    [Fact]
    public async Task Handle_ValidCommand_CreatesProductAndReturnsId()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var vendorId = Guid.NewGuid();
        var categoryId = Guid.NewGuid();
        var command = new CreateProductCommand("Test Product", "Description", 100m, 10, categoryId);
        
        var vendor = new Vendor(userId, "Test Store", "test-store");
        // Reflection hack to set the ID since it's private set (or use a factory/constructor if available)
        typeof(Vendor).GetProperty("Id")?.SetValue(vendor, vendorId);

        _currentUserServiceMock.Setup(x => x.UserId).Returns(userId);
        _unitOfWorkMock.Setup(x => x.Vendors.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<Vendor> { vendor });
        
        _unitOfWorkMock.Setup(x => x.Products.AddAsync(It.IsAny<Product>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Product p, CancellationToken c) => p);
        _unitOfWorkMock.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeEmpty();
        _unitOfWorkMock.Verify(x => x.Products.AddAsync(It.IsAny<Product>(), It.IsAny<CancellationToken>()), Times.Once);
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_UnauthenticatedUser_ThrowsUnauthorizedException()
    {
        // Arrange
        var command = new CreateProductCommand("Test Product", "Description", 100m, 10, Guid.NewGuid());
        _currentUserServiceMock.Setup(x => x.UserId).Returns((Guid?)null);

        // Act
        var act = () => _handler.Handle(command, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<UnauthorizedException>();
    }
}
