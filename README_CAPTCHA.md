# EdgeOne Captcha Protection System

This project implements a CAPTCHA protection system using Tencent EdgeOne Functions. It consists of two parts: a **Gateway** (Pages Functions) that serves/verifies CAPTCHAs, and an **Interceptor** (Edge Function) that protects your content.

## Architecture

1.  **Gateway (`captcha.s3xyesia.xyz`)**:
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
4.  **Domain:** Bind `captcha.s3xyesia.xyz`.

### 3. Deploy Interceptor (Edge Function)

1.  Navigate to `interceptor/`.
2.  Create a new Edge Function in EdgeOne.
3.  Copy the content of `edge-function.js`.
    *   *Note:* `config.js` is imported. For a single-file Edge Function deployment, you may need to bundle them or paste `config.js` content at the top of `edge-function.js`.
4.  **Bind KV:** Bind `SESSION_KV` to the Function.
5.  **Triggers:** Set the trigger rules (e.g., `*.s3xyseia.xyz/*`).

## Configuration

Edit `interceptor/config.js` to change:
*   `title`: Page Title.
*   `icon`: SVG Icon.
*   `gatewayUrl`: URL of your Gateway API.

## API Reference

### `GET /api/captcha`
Returns: `{ id: "...", str: "...", hint: "..." }`

### `POST /api/verify`
Body: `{ capId: "...", capAns: "..." }`
Returns: `{ success: true, expiresAt: "..." }`
Sets Cookie: `_captcha_sess` (Domain: `.s3xyseia.xyz`)
