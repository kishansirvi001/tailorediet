
# TailorDiet Project Structure

This starter structure is organized for a React + Vite app and keeps reusable UI, app logic, and assets separated as the project grows.

## Top-level

- `docs/` project notes and planning docs
- `public/` static files served as-is
- `src/` application source code

## `src/`

- `assets/` source-managed images, logos, and media used by components
- `components/` reusable UI building blocks
- `constants/` app-wide constant values and configuration maps
- `context/` React context providers
- `data/` mock data, static content, and local fixtures
- `features/` domain-specific modules
- `hooks/` custom React hooks
- `layouts/` layout wrappers and page shells
- `lib/` shared helpers and low-level utilities
- `pages/` route-level screens
- `sections/` larger page sections composed from components
- `services/` API and storage integrations
- `styles/` shared styling layers, tokens, and utility styles
- `utils/` pure utility functions

## `public/`

- `icons/` public SVG/icon assets
- `images/` public images that should not be bundled through `src`