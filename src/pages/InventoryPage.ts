import { expect, Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly pageTitle: Locator;
  readonly cartLink: Locator;

  constructor(private readonly page: Page) {
    this.pageTitle = page.getByText('Products', { exact: true });
    this.cartLink = page.locator('.shopping_cart_link');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.pageTitle).toBeVisible();
  }

  async addProductToCart(productName: string): Promise<void> {
    const product = this.page.locator('.inventory_item').filter({
      has: this.page.getByText(productName, { exact: true })
    });
    await expect(product).toHaveCount(1);
    await product.getByRole('button', { name: 'Add to cart' }).click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
