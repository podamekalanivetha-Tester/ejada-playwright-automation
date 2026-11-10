/**
 * Centralized environment configuration.
 * Copy .env.example to .env if you want to override these values.
 */
export const config = {
  sauceDemo: {
    baseUrl: process.env.BASE_URL ?? 'https://www.saucedemo.com',
    username: process.env.SAUCE_USERNAME ?? 'standard_user',
    password: process.env.SAUCE_PASSWORD ?? 'secret_sauce'
  },
  booksApi: {
    baseUrl: process.env.BOOKS_API_URL ?? 'https://simple-books-api.click'
  }
};
