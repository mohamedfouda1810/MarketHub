import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import ProductCard from './ProductCard'

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 100,
    compareAtPrice: 120,
    rating: 4.5,
    stockQuantity: 10,
    slug: 'test-product',
    imageUrl: '/test.jpg'
  }

  it('renders product details correctly', () => {
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$100')).toBeInTheDocument()
    expect(screen.getByText('16.7% OFF')).toBeInTheDocument() // (120-100)/120
  })

  it('shows "Out of stock" and disables button when stock is 0', () => {
    render(<ProductCard product={{ ...mockProduct, stockQuantity: 0 }} />)
    
    expect(screen.getByText('Out of Stock')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeDisabled()
  })

  it('calls addToCart when button is clicked', async () => {
    const user = userEvent.setup()
    const onAddToCart = vi.fn()
    
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />)
    
    const button = screen.getByRole('button', { name: /add to cart/i })
    await user.click(button)
    
    expect(onAddToCart).toHaveBeenCalledWith(mockProduct)
  })
})
