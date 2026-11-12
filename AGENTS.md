This is an EmDash site -- a CMS built on Astro with a full admin UI.

## Commands

```bash
pnpm dev              # Start the Astro dev server
npx emdash types      # Regenerate TypeScript types from a running site
```

The admin UI is at `http://localhost:4321/_emdash/admin`.

## Key Files

| File                     | Purpose                                                                            |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `astro.config.mjs`       | Astro config with `emdash()` integration, database, and storage                    |
| `src/live.config.ts`     | EmDash loader registration (boilerplate -- don't modify)                           |
| `seed/seed.json`         | Schema definition + demo content (collections, fields, taxonomies, menus, widgets) |
| `emdash-env.d.ts`        | Generated types for collections (auto-regenerated on dev server start)             |
| `src/layouts/Base.astro` | Base layout with EmDash wiring (menus, search, page contributions)                 |
| `src/pages/`             | Astro pages -- all server-rendered                                                 |

## Skills

Agent skills are in `.agents/skills/`. Load them when working on specific tasks:

- **building-emdash-site** -- Querying content, rendering Portable Text, schema design, seed files, site features (menus, widgets, search, SEO, comments, bylines). Start here.
- **creating-plugins** -- Building EmDash plugins with hooks, storage, admin UI, API routes, and Portable Text block types.
- **emdash-cli** -- CLI commands for content management, seeding, type generation, and visual editing flow.

## Documentation

The EmDash docs are available as an MCP server at `https://docs.emdashcms.com/mcp`. When you need to verify an API, hook, config option, field type, or pattern, call `search_docs` against the live documentation rather than relying on training-data recall. The docs reflect current behaviour; assumptions may not.

This template ships with `.mcp.json`, `.cursor/mcp.json`, and `.vscode/mcp.json` so Claude Code, Cursor, and VS Code auto-discover the docs server. Other tools (OpenCode, Windsurf, etc.) need a manual one-time setup -- see [docs.emdashcms.com/docs-mcp](https://docs.emdashcms.com/docs-mcp).

## Rules

- All content pages must be server-rendered (`output: "server"`). No `getStaticPaths()` for CMS content.
- Image fields are objects (`{ src, alt }`), not strings. Use `<Image image={...} />` from `"emdash/ui"`.
- `entry.id` is the slug (for URLs). `entry.data.id` is the database ULID (for API calls like `getEntryTerms`).
- When Astro's cache is enabled, pass content-query hints to `Astro.cache.set(cacheHint)`. Use the `WithCacheHint` variants for site settings, menus, taxonomies, and widget areas rendered by cached routes.
- Taxonomy names in queries must match the seed's `"name"` field exactly (e.g., `"category"` not `"categories"`).

## This Template

EmDash's Cloudflare starter with RedeemID wired in: Shopify runs the store, checkout, orders and customer accounts; EmDash runs the content. RedeemID (`@redeemid/emdash`) joins them. Its docs are in `node_modules/@redeemid/emdash/docs/` (start with `getting-started.md` and `reference.md`).

## Pages

| Page            | Path                    | What it shows                                                        |
| --------------- | ----------------------- | -------------------------------------------------------------------- |
| Home            | `/`                     | Recent posts                                                         |
| All posts       | `/posts`                | Post list                                                            |
| Post detail     | `/posts/[slug]`         | Post body through RedeemID's `<Content>` (locked parts never render) |
| Page            | `/[slug]`               | Page body through `<Content>`                                        |
| Category, tag   | `/category/[slug]`, `/tag/[slug]` | Posts filtered by term                                     |
| Shop            | `/shop/`                | A Shopify collection with filters and sorting                        |
| Product         | `/shop/[handle]/`       | A Shopify product; 404 when Shopify has none                         |
| Product search  | `/shop/search`          | Shopify product search                                               |
| Cart            | `/cart`                 | The cart, discount codes and Checkout                                |
| Join            | `/join/`                | Plan cards for the products listed on each level                     |
| Account         | `/account`              | Member card, preferences, and the reader's data                      |
| Product sitemap | `/sitemap-products.xml` | Every product page, for search engines                               |

## Rules for this site

- Render every body that may be locked with `<Content>` from `@redeemid/emdash/components/Content.astro`, never `<PortableText>`.
- Cache entry pages with `cacheEntry()` and lists with `cachePage()` from `@redeemid/emdash/cache`, not `Astro.cache.set()`.
- Access comes only from the reader's Shopify customer tags. Never grant access from site code.
- Readers never see the word "Shopify"; the button says "Sign in".
- `src/styles/site.css` is the whole look. RedeemID's components carry `redeemid-*` classes and no styling of their own.
