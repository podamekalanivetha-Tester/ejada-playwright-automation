import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { config } from '../../src/config/env';

test.describe('SauceDemo login scenarios', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('valid user can log in', async ({ page }) => {
    await loginPage.login(config.sauceDemo.username, config.sauceDemo.password);
    await new InventoryPage(page).expectLoaded();
  });

  test('invalid username is rejected', async () => {
    await loginPage.login('wrong_user', config.sauceDemo.password);
    await loginPage.expectError('Username and password do not match');
  });

  test('invalid password is rejected', async () => {
    await loginPage.login(config.sauceDemo.username, 'wrong_password');
    await loginPage.expectError('Username and password do not match');
  });

  test('locked out user is rejected', async () => {
    await loginPage.login('locked_out_user', config.sauceDemo.password);
    await loginPage.expectError('Sorry, this user has been locked out');
  });

  test('empty credentials are rejected', async () => {
    await loginPage.login('', '');
    await loginPage.expectError('Username is required');
  });
});
