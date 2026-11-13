// Applies EmDash's database migrations to the D1 database before the Worker
// serves traffic. `pnpm run deploy` (and Cloudflare's build, which uses the
// same script) runs it once before `wrangler deploy` and once after, so a
// brand-new database that the deploy creates is migrated too.
//
// It needs CLOUDFLARE_API_TOKEN with D1 Edit permission, and the account ID
// (CLOUDFLARE_ACCOUNT_ID or `account_id` in wrangler.jsonc). Cloudflare's
// build provides both. Without a token it skips, and the site migrates itself
// on its first request instead.
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { unstable_readConfig } from "wrangler";

const after = process.argv.includes("--after-deploy");
const log = (message) => console.log(`[migrate] ${message}`);

if (!process.env.CLOUDFLARE_API_TOKEN) {
	log("CLOUDFLARE_API_TOKEN isn't set, so EmDash will migrate the database on the site's first request.");
	process.exit(0);
}

const config = unstable_readConfig({ config: "wrangler.jsonc" }, { hideWarnings: true });
const db = config.d1_databases.find((binding) => binding.binding === "DB");
const selector = db?.database_id || db?.database_name;
if (!selector) {
	log("wrangler.jsonc has no DB database yet; it is migrated after the deploy creates it.");
	process.exit(0);
}

const target = ["--d1", selector, ...(config.account_id ? ["--account-id", config.account_id] : [])];
const emdash = (args) =>
	spawnSync(join("node_modules", ".bin", "emdash"), ["migrate", ...args, ...target], {
		encoding: "utf8",
		shell: process.platform === "win32",
		stdio: ["ignore", "pipe", "pipe"],
	});

const status = emdash(["--status", "--json"]);
if (status.error) throw status.error;
if (status.status !== 0) {
	const reason = status.stderr.trim().split("\n").pop() ?? "";
	if (!after && /No D1 database named/.test(reason)) {
		log("The database doesn't exist yet; it is migrated after the deploy creates it.");
		process.exit(0);
	}
	console.error(status.stderr.trim());
	console.error(
		"[migrate] Couldn't read the database's migration status. Check that the build's API token has D1 Edit permission (Worker → Settings → Build → API token).",
	);
	process.exit(1);
}

const report = JSON.parse(status.stdout);
if (report.lock) {
	console.error(
		`[migrate] The migration lock has been held since ${report.lock.heldSince} (lock ${report.lock.id}). If no migration is running, release it: https://docs.emdashcms.com/deployment/core-migrations/#release-a-stuck-migration-lock`,
	);
	process.exit(1);
}
if (report.pending.length === 0) {
	log("The database is up to date.");
	process.exit(0);
}

log(`Applying ${report.pending.length} migration(s) to ${report.target.label}.`);
const apply = emdash(["--expected-target-fingerprint", report.target.fingerprint]);
process.stdout.write(apply.stdout);
process.stderr.write(apply.stderr);
process.exit(apply.status ?? 1);
