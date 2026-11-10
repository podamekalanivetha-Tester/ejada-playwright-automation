import { test } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { CartPage } from '../../src/pages/CartPage';
import { CheckoutPage } from '../../src/pages/CheckoutPage';
import { config } from '../../src/config/env';

test.describe('SauceDemo product order flow', () => {
  test('logged-in user can order one product', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(config.sauceDemo.username, config.sauceDemo.password);

    const inventory = new InventoryPage(page);
    await inventory.expectLoaded();
    await inventory.addProductToCart('Sauce Labs Backpack');
    await inventory.openCart();

    const cart = new CartPage(page);
    await cart.expectProduct('Sauce Labs Backpack');
    await cart.checkout();

    const checkout = new CheckoutPage(page);
    await checkout.enterCustomerDetails('Test', 'User', '600001');
    await checkout.finishOrder();
  });
});
