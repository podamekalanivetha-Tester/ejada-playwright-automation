import { test, expect, APIRequestContext } from '@playwright/test';
import { config } from '../../src/config/env';

type Book = { id: number; name: string; type: string; available: boolean };
type OrderResponse = { created: boolean; orderId?: string; error?: string };

let api: APIRequestContext;
let accessToken = '';
let createdOrderId = '';

test.describe.serial('Simple Books API - authenticated order lifecycle', () => {
  
  test.beforeAll(async ({ playwright }) => {
    api = await playwright.request.newContext({
      baseURL: config.booksApi.baseUrl,
      extraHTTPHeaders: { 'Content-Type': 'application/json' }
    });
  });

  test.afterAll(async () => {
    if (api) {
      await api.dispose();
    }
  });

  test('GET - retrieve available books', async () => {
    const response = await api.get('/books');
    expect(response.status()).toBe(200);
    const books = (await response.json()) as Book[];
    expect(Array.isArray(books)).toBeTruthy();
    expect(books.length).toBeGreaterThan(0);
    expect(books[0]).toHaveProperty('id');
    expect(books[0]).toHaveProperty('name');
  });

  test('POST - create API client and obtain token', async () => {
    const response = await api.post('/api-clients/', {
      data: {
        clientName: `EJADA Playwright ${Date.now()}`,
        clientEmail: `ejada-${Date.now()}@example.com`
      }
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.accessToken).toBeTruthy();
    accessToken = body.accessToken as string;
  });

  test('POST - create an order using bearer token', async () => {
    expect(accessToken, 'API access token should be created first').toBeTruthy();
    const booksResponse = await api.get('/books');
    const books = (await booksResponse.json()) as Book[];
    const availableBook = books.find((book) => book.available);
    expect(availableBook, 'At least one book should be available').toBeTruthy();

    const response = await api.post('/orders', {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: {
        bookId: availableBook!.id,
        customerName: 'EJADA Automation'
      }
    });
    expect(response.status()).toBe(201);
    const body = (await response.json()) as OrderResponse;
    expect(body.created).toBe(true);
    expect(body.orderId).toBeTruthy();
    createdOrderId = body.orderId!;
  });

  test('GET - retrieve the created order', async () => {
    expect(createdOrderId).toBeTruthy();
    const response = await api.get(`/orders/${createdOrderId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    expect(response.status()).toBe(200);
    const order = await response.json();
    expect(order.id).toBe(createdOrderId);
    expect(order.customerName).toBe('EJADA Automation');
  });

  test('PATCH - update the order customer name', async () => {
    expect(createdOrderId).toBeTruthy();
    const response = await api.patch(`/orders/${createdOrderId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: { customerName: 'EJADA Updated Customer' }
    });
    expect(response.status()).toBe(204);
  });

  test('GET - verify the updated order', async () => {
    const response = await api.get(`/orders/${createdOrderId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    expect(response.status()).toBe(200);
    const order = await response.json();
    expect(order.customerName).toBe('EJADA Updated Customer');
  });

  test('DELETE - delete the order', async () => {
    const response = await api.delete(`/orders/${createdOrderId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log('GET status:' , response.status());
    expect(response.status()).toBe(204);
  });

  test('GET - deleted order should not be found', async () => {
    const response = await api.get(`/orders/${createdOrderId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    expect(response.status()).toBe(404);
  });
});
