# Security Policy

## Supported Versions

Peel UI is maintained on the `2.x` release line (`main` branch). Legacy `1.x` builds are no longer supported.

| Version | Supported          |
| ------- | ------------------ |
| 2.x     | :white_check_mark: |
| 1.x     | :x:                |

## Architecture & Security Scope

Peel UI is a static client-side documentation application and `shadcn`-compatible component registry (`public/r/*.json`). We do not operate a backend database, user authentication system, or server-side session storage.

Security vulnerabilities in scope for Peel UI include:
- **DOM / XSS Injection:** Unsafe HTML rendering or unsanitized input handling inside any component primitive in `src/registry/primitives/`.
- **Registry Integrity:** Flaws in `scripts/build-registry.mjs` or `public/r/*.json` payloads that could introduce unsafe code when installed via the `shadcn` CLI.
- **Supply-Chain & Dependencies:** Critical vulnerabilities in direct runtime dependencies (`react`, `motion`, `gsap`, `@phosphor-icons/react`).

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability, report it privately to the maintainer:
- **Email:** [killer1191x@gmail.com](mailto:killer1191x@gmail.com) or [killersumit1191@gmail.com](mailto:killersumit1191@gmail.com)
- **X (Twitter) DM:** [@Sumit1476136](https://x.com/Sumit1476136)

### What to Include
1. The affected component slug or file path (e.g., `src/registry/primitives/<slug>.tsx`).
2. Step-by-step reproduction instructions or a minimal proof-of-concept snippet.
3. The potential impact of the issue.

We review private security reports within **48 hours** and will ship a patch to `main` and regenerate the `public/r/` registry payloads before public disclosure.
