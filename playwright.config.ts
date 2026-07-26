import { defineConfig } from "@playwright/test";

/**
 * Acceptance suite (§9 of the build brief). Boots the production build with
 * the in-memory test store + Basic Auth creds, and serves the design contract
 * file on a second port for side-by-side parity assertions.
 */
export default defineConfig({
  testDir: "./scripts",
  testMatch: /parity\.spec\.ts/,
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:4610",
  },
  webServer: [
    {
      command: "npm run start -- --port 4610 --hostname 127.0.0.1",
      url: "http://127.0.0.1:4610",
      reuseExistingServer: false,
      timeout: 60_000,
      env: {
        TEST_STORE: "memory",
        TEST_EMAIL: "fail", // every send is a simulated failure — leads must survive
        SEND_ACK: "true",
        ADMIN_USER: "admin",
        ADMIN_PASSWORD: "parity-test-password",
        NEXT_PUBLIC_SITE_URL: "https://firstcompile.com",
      },
    },
    {
      command: "node scripts/serve-contract.mjs 4611",
      url: "http://127.0.0.1:4611/contract/firstcompilefinal.html",
      reuseExistingServer: false,
      timeout: 30_000,
    },
  ],
});
