# RedeemID starter for EmDash

An [EmDash](https://github.com/emdash-cms/emdash) site on Cloudflare with Shopify commerce built in: a shop, product pages, a cart, Shopify checkout, store sign-in, and members-only posts.

Shopify runs the store, checkout, orders, subscriptions and customer accounts. EmDash runs the content. [RedeemID](https://github.com/webmultipliers/redeemid-emdash) joins the two, so readers shop and sign in on your own pages, and what they can read comes from their Shopify customer tags.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/webmultipliers/redeemid-emdash-starter)

![The starter's shop page: a Shopify collection with sorting, an availability filter and Add to cart buttons](.github/images/shop.png)

![A members-only post: everyone reads the opening, then a panel asks the reader to sign in or join](.github/images/members-post.png)

## What's in it

- **Shop:** `/shop/` lists a Shopify collection with Shopify's filters and sorting, `/shop/[handle]/` is a product page with options, subscriptions, recommendations and structured data, `/shop/search` searches the catalog, and `/cart` and a cart drawer lead to Shopify checkout.
- **Members:** readers sign in with the store's customer account. Posts in the **Members** category open only for customers tagged `member` in Shopify. Everyone else reads the opening, up to the Paywall break, and then a panel that asks them to sign in or join. `/join/` shows a plan card for each membership product, and `/account` shows the member's card, preferences and data.
- **Search engines:** product pages get the product's own title and description, unknown products answer 404, and `/sitemap-products.xml` lists every product page.
- **Admin:** RedeemID's pages under **Plugins → RedeemID** cover Setup, Access, Members, Webhooks, Reports, Status and more. Editors get Paywall break, Members only, Product, Collection and Plan blocks.
- **Look:** one small stylesheet, `src/styles/site.css`, with no framework. Change its tokens to rebrand, or replace it.

## Deploy

1. **Shopify first.** You need a store with the new customer accounts, the **Headless** sales channel and a Shopify app on the store to send webhooks. [Connect a store](https://github.com/webmultipliers/redeemid-emdash/blob/main/docs/shopify-setup.md) walks through it and gives you the four values below.
2. **Press Deploy to Cloudflare.** It copies this repository to your GitHub account, creates the D1 database and R2 bucket, and asks for:

   | Secret | What it is |
   | --- | --- |
   | `REDEEMID_SHOPIFY_STORE_DOMAIN` | Your store's myshopify.com domain |
   | `REDEEMID_SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID` | Headless → Customer Account API → Client ID |
   | `REDEEMID_SHOPIFY_STOREFRONT_PRIVATE_TOKEN` | Headless → Storefront API → Private access token |
   | `REDEEMID_SHOPIFY_ADMIN_APP_CLIENT_SECRET` | Your Shopify app's client secret, which checks webhooks |

   The Workers free plan is enough.
3. **Set up EmDash.** Open `https://<your site>/_emdash/admin` and create the first admin account. Store customers can't create it. Tick the sample content to get the starter's posts.
4. **Finish in RedeemID.** Open **Plugins → RedeemID → Setup** and work down the steps. It shows the callback address to register in Shopify, registers the webhooks and says what's still missing.
5. **Try it.** Tag a test customer `member` in Shopify, sign in as them, and open **A post for members**.

To sell in the shop, add products to the **Home page** collection (or change `COLLECTION` in `src/pages/shop/index.astro`) and make the collection and its products available to the Headless channel. To sell memberships, list a membership product on a level under **Plugins → RedeemID → Access**, and add a Shopify Flow workflow that tags the customer when the order is paid ([Flow recipes](https://github.com/webmultipliers/redeemid-emdash/blob/main/docs/shopify-flow.md)).

## Run it locally

```sh
pnpm install
cp .dev.vars.example .dev.vars   # fill in the four values
pnpm dev
```

Open `http://localhost:4321/_emdash/admin` to set up the site. Shopify only accepts `https` callback addresses, so signing in for real from your machine needs a tunnel, such as `cloudflared tunnel`. The shop and cart work without one.

## Make it yours

- **Access:** levels, rules, the meter, drip, features and protected files are under **Plugins → RedeemID → Access**, and each entry has an Access panel. The defaults in `astro.config.mjs` (one Member level and the Members category rule) are a starting point, and a value saved in the admin beats them.
- **Pages:** everything is in `src/pages/`. Keep `<Content>` wherever an entry's body renders, because plain `<PortableText>` shows everything. The Status page names any template that slips.
- **Docs:** [RedeemID for EmDash](https://github.com/webmultipliers/redeemid-emdash#documentation) covers every component, block, option and route.

## License

MIT. Based on EmDash's `starter-cloudflare` template, © Cloudflare, Inc., also MIT. See [LICENSE](LICENSE).
