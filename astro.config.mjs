import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { redeemid, redeemidGuard, redeemidPlugin } from "@redeemid/emdash";
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";

// RedeemID's defaults for this site. The store comes from the
// REDEEMID_SHOPIFY_STORE_DOMAIN secret. Staff can change levels, rules, the
// meter and the join link under Plugins → RedeemID → Access without a deploy;
// a value saved there beats the one here. Every option:
// https://github.com/webmultipliers/redeemid-emdash/blob/main/docs/reference.md#config
const redeemidConfig = {
	// Customers tagged "member" in Shopify are members.
	levels: [{ slug: "member", name: "Member", tags: ["member"] }],
	// Posts in the Members category are for members.
	rules: [{ collection: "posts", taxonomy: "category", term: "members", levels: ["member"] }],
	join: { href: "/join/", label: "Join" },
};

export default defineConfig({
	output: "server",
	adapter: cloudflare(),
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
		emdash({
			database: d1({ binding: "DB", session: "auto", coalesce: true }),
			storage: r2({ binding: "MEDIA" }),
			// Store sign-in, Shopify webhooks, the cart and checkout.
			authProviders: [redeemid(redeemidConfig)],
			// RedeemID's admin pages and editor blocks (Paywall break, Product, Plan…).
			plugins: [redeemidPlugin(redeemidConfig)],
		}),
		// Keeps locked content off pages and out of EmDash's APIs, with per-visitor
		// limits on sign-in and cart changes (the REDEEMID_RATE_LIMIT binding).
		redeemidGuard({ rateLimit: true }),
	],
	devToolbar: { enabled: false },
});
