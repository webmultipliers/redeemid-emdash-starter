import { siteConfig } from "@redeemid/emdash/access";
import { productSitemap } from "@redeemid/emdash/catalog";
import { catalogHandles } from "@redeemid/emdash/products";
import type { APIRoute } from "astro";

// Products kept as entries (Plugins → RedeemID → Products) are in EmDash's own
// sitemap; this one lists the rest of the store.
export const GET: APIRoute = async ({ locals, url }) =>
	productSitemap(await siteConfig(locals), url, { productHref: "/shop/{handle}/", exclude: await catalogHandles(locals) });
