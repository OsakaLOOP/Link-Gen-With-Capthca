# EdgeOne Captcha Protection System

This project implements a CAPTCHA protection system using Tencent EdgeOne Functions. It consists of two parts: a **Gateway** (Pages Functions) that serves/verifies CAPTCHAs, and an **Interceptor** (Edge Function) that protects your content.

## Architecture

1.  **Gateway (`captcha.s3xyseia.xyz`)**:
    *   Hosted on EdgeOne Pages.
    *   API Endpoints:
        *   `GET /api/captcha`: Returns a random puzzle from `CAPTCHA_KV`.
        *   `POST /api/verify`: Validates answer, sets a Session Cookie (`.s3xyseia.xyz`), and stores session in `SESSION_KV`.

2.  **Interceptor (`*.s3xyseia.xyz`)**:
    *   Edge Function attached to specific rules/domains.
    *   Logic:
        *   Checks for `_captcha_sess` cookie.
        *   Validates session against `SESSION_KV`.
        *   **Valid:** Forwards request to origin (`fetch(request)`).
        *   **Invalid:** Returns the CAPTCHA HTML page.

## Deployment Guide

### 1. Prerequisites (KV Storage)

Create two KV Namespaces in EdgeOne:
*   `CAPTCHA_KV`: Stores your puzzles. (Existing)
*   `SESSION_KV`: Stores active sessions.

### 2. Deploy Gateway (Pages)

1.  Navigate to `gateway/`.
2.  Deploy this directory to EdgeOne Pages (e.g., project `captcha-gateway`).
3.  **Bind KV:** Bind `CAPTCHA_KV` and `SESSION_KV` to the Pages project with the same variable names.
4.  **Domain:** Bind `captcha.s3xyseia.xyz`.

### 3. Deploy Interceptor (Edge Function)

1.  Navigate to `interceptor/`.
2.  Create a new Global Edge Function in EdgeOne (NOT Pages Function).
3.  Copy the content of `edge-function.js`.
    *   *Note:* The file `interceptor/edge-function.js` is self-contained.
4.  **Configuration:**
    *   **Environment Variables:** Add `JWT_SECRET` with your secret key.
    *   **Triggers:** Set the trigger rules (e.g., `*.s3xyseia.xyz/*`) to intercept requests.

## Troubleshooting

If you encounter HTTP 500 errors:
*   The `interceptor` code now returns a JSON response with error details and stack traces when an exception occurs. Check the response body for debugging information.
*   Ensure `JWT_SECRET` is set as an environment variable in the Edge Function configuration.

## API Reference

### `GET /api/captcha`
Returns: `{ id: "...", str: "...", hint: "..." }`

### `POST /api/verify`
Body: `{ capId: "...", capAns: "..." }`
Returns: `{ success: true, expiresAt: "..." }`
Sets Cookie: `_captcha_sess` (Domain: `.s3xyseia.xyz`)
