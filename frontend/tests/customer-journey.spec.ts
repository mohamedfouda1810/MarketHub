import { test, expect } from '@playwright/test';

test('complete customer journey - happy path', async ({ page }) => {
  // 1. Register as customer
  await page.goto('/register');
  await page.fill('input[name="email"]', 'customer@test.com');
  await page.fill('input[name="password"]', 'Password123!');
  await page.fill('input[name="confirmPassword"]', 'Password123!');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('/login');

  // 2. Login
  await page.fill('input[name="email"]', 'customer@test.com');
  await page.fill('input[name="password"]', 'Password123!');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('/');

  // 3. Browse and add to cart
  await page.click('text=Products');
  await page.click('text=Test Product');
  await page.click('button:has-text("Add to cart")');
  
  const cartBadge = page.locator('.cart-badge');
  await expect(cartBadge).toHaveText('1');

  // 4. Checkout
  await page.click('.cart-icon');
  await page.click('text=Checkout');
  
  await page.fill('input[name="address"]', '123 Test St');
  await page.fill('input[name="city"]', 'Test City');
  await page.click('text=Apply Coupon');
  await page.fill('input[name="coupon"]', 'SAVE10');
  await page.click('button:has-text("Apply")');

  await page.click('button:has-text("Place Order")');

  // 5. Assert confirmation
  await expect(page.locator('h1')).toHaveText('Thank you for your order!');
  const orderNumber = await page.locator('.order-number').textContent();
  expect(orderNumber).not.toBeNull();
});
