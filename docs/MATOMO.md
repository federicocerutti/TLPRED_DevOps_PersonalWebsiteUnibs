# Matomo: deployment status and activation runbook

## Installation and tracking activation — 4 November 2026

The owner requested installation and then explicitly instructed enabling tracking.
Matomo 5.14.2 is installed at `https://federico-cerutti.unibs.it/matomo/`
using the university-provided local MariaDB database, with table prefix `matomo_`.
The real site ID is **1**. The PHP-FPM execution identity is the website owner;
configuration and separately generated administrator credentials remain in private
server storage outside the document root. The earlier PHP and remote-database
blockers below are historical.

`scripts/deploy.sh` loads the public production flags from
`ops/matomo/production.env`. These contain only enablement flags, the public
endpoint and site ID. Ordinary builds/previews remain disabled by default.
To build the production configuration for verification:

```sh
set -a
source ops/matomo/production.env
set +a
npm run build
npm run verify:dist
```

The installed backend forces cookieless tracking, masks three IP bytes before
enrichment, randomises config IDs and honours Do Not Track. Device, referrer,
resolution, language, User ID, ecommerce, event, content and page-performance
reporting plugins are disabled; visitor logs/profiles are disabled. Retention is
seven raw-log days and six aggregate-report months. The default location provider
has language-to-country guessing disabled: do not promise accurate country
geolocation. Precise location fields must remain empty.

The frontend sends an explicit memory-only per-document `cid`, which changes on
reload and is never persisted. The separately deployed
[`PageHeartbeat` extension](../ops/matomo/PageHeartbeat/README.md) retains native
fingerprint randomisation but allows only heartbeat requests to match that page
identity. Native Matomo 5.14.2 otherwise treats every randomised request as a new
visit and cannot update duration. Real browser requests and raw test records must
confirm that automatic heartbeats increase duration without adding pageviews,
and that reloads create a new identity. These are page counts and approximate
focused-page durations, not unique-person or cross-page session statistics.

HTTP checks deny configuration, tmp, vendor, core and unauthenticated installer
URLs. Hourly archiving/scheduled deletion and daily encrypted backups are installed
with overlap locks; backups have seven-day retention. A backup restored successfully
into an independent temporary MariaDB instance with networking disabled (38 tables,
one administrator and one site). Backups and their key currently live on the same
host, so this is verified local recovery, not off-host disaster recovery.

The private knowledge-base handoff records credential locations, maintenance
scripts and live verification. Do not copy that private infrastructure context or
any secrets into this repository.

Production tracking was deployed from implementation commit `35e2146`, preserved
on GitHub branch `codex/matomo-tracking`. Actual public English/Italian pageviews
and focus-change heartbeats passed; a heartbeat updated duration to 34 seconds
without adding another pageview. Raw test records had masked IPs and empty device,
referrer and precise-location fields. Reloads changed the page identity. No
analytics cookies, browser-feature or performance payloads were recorded, and DNT,
GPC and prior refusal suppressed all Matomo requests. Specifically identified
synthetic visits were removed through the native privacy API and reports refreshed.

### Disable tracking

Set `MATOMO_ENABLED=false` in `ops/matomo/production.env` and redeploy using the
protected helper. For immediate collection shutdown, run the native console
command on the application host:

```sh
php /home/federico-cerutti/website/matomo/console config:set \
  --section=Tracker --key=record_statistics --value=0
```

## Latest owner-authorised deployment — 3 November 2026

The owner authorised committing, synchronising and deploying the website, installing Matomo, removing the optional analytics footer panel, and preparing minimal automatic cookieless measurement under the university privacy policy. This supersedes the earlier preview-only and opt-in integration instructions below. The existing university privacy-policy footer link remains. No legal determination about the policy's coverage is claimed.

**Activation is blocked by the web host's PHP configuration.** A short-lived random-name PHP probe containing only a PHP version/effective-identity check was returned as source code, not executed, over verified HTTPS. It was immediately removed. Apache's enabled modules include `proxy_fcgi`, and the host has PHP-FPM pools for other sites, but no pool/socket for this website account. No other site's pool was used. The actual HTTP PHP identity remains unknown. No Apache access logs were accessed.

Matomo 5.14.2 was downloaded to private server storage and verified with the upstream detached signature and the current signing key obtained from the official HTTPS endpoint. Fingerprint: `F529A27008477483777FC23D63BB30D0E5D2C749`. Release ZIP SHA-256: `d6ce9e2083f688741ecdccd9f13ca54761fc47592bd8926f1e2d3bcf45daeffb`. Private extracted release: `/home/federico-cerutti/.local/share/matomo/releases/5.14.2`; `current` points there. A private TLS database config was rendered from the already-provisioned environment at `/home/federico-cerutti/.config/matomo/config.ini.php`, mode 0600, and symlinked from the private release's config directory. Application and private directories remain owner-only. No credential was printed, copied locally or committed. Authenticated certificate-verified DB access passed again.

This is **staging**, not a completed Matomo installation: no public application mount, site ID, administrator account, database tables, cron, analytics backup job or tracker activation was created. `installation_in_progress=1` remains set. The deployed website must remain `enabled:false` until all runtime and recovery checks pass. Do not expose PHP application/config source on this host.

### Prepared minimal measurement profile

- Remove the optional-consent panel. Keep the university policy link and have legacy privacy URLs point to that policy without obsolete consent controls.
- Page views and approximate focused-page time only; no custom events, automatic outlinks/downloads, query strings, URL fragments, referrers, User IDs, cross-site tracking, recordings or heatmaps.
- Frontend disables cookies and browser-feature detection before any tracking; respects Do Not Track, Global Privacy Control and previously saved refusals. It stores no new analytics preference.
- Use a cryptographically random 16-hex page ID held only in memory. It changes on every document load and is not shared across tabs, reloads, websites or persisted storage. Pair it with backend randomisation of `config_id` on every request so Matomo does not derive a reusable browser/IP session identity. Heartbeats require correlation within that one page; this is not a claim of identifier-free collection or accurate unique visitors/sessions. Verify actual page-ID heartbeat matching with the real installed tracker before activation.
- `enableHeartBeatTimer(30)` measures approximate active-page duration. Matomo responds to focus/unload/browser events rather than continuously polling at fixed intervals. No keystrokes, pointer coordinates or interaction contents are recorded.
- Force cookieless tracking globally in native PrivacyManager settings. Enable IP anonymisation with mask length 3 (IPv4 masks three bytes; release source maps IPv6 to 104 masked bits); use the masked IP for location enrichment. Disable visitor logs/profiles and unnecessary device/referrer reports. Use country-only geolocation and suppress city/region/coordinates; accept unknown countries. The prepared frontend alone cannot enforce backend minimisation.
- Prepared retention: **7 days raw logs and 6 months aggregate reports**, replacing the unapproved 90-day/12-month defaults. These values are in the staged config and template, under the upstream `[Deletelogs]` section. Until installation and scheduled deletion are tested, retention is not operational. Backups must also have bounded retention and be included in the effective retention review.

### University administrator handoff required

Ask university sysadmins to provision a dedicated PHP-FPM pool for this account and an Apache `/matomo/` alias/handler to the private release. Confirm the real PHP identity and grant only the required read/traversal permissions to application/config/CA and write permissions to Matomo's runtime directories. Keep `server.env` inaccessible to HTTP. Apply upstream hardening, disable directory listings and deny config, tmp, vendor, private files and unauthenticated installation access. Verify all these through HTTP before mounting the app publicly.

Once that host support exists, finish the restricted installation using the existing dedicated TLS database (do not recreate it), register the exact website, obtain the real site ID and secure administrator credentials privately. Apply/read back all native privacy settings. Test the real tracker, no cookies, per-page ID lifetime, heartbeat updates, masked-IP country enrichment and raw-record fields; do not enable while device or precise-location data remains. Install/test hourly archiving with overlap protection, purge scheduling, encrypted bounded backups and an isolated restore. Keep browser-triggered archiving off after the scheduled job passes. Activate only by rebuilding with the verified endpoint/site ID and both enablement flags, then repeat production privacy checks.

Sources: [current installation guide](https://matomo.org/faq/on-premise/installing-matomo/), [release signing key](https://matomo.org/blog/2022/03/our-release-signature-has-changed/), [JavaScript tracker and heartbeat](https://developer.matomo.org/guides/tracking-javascript), [privacy controls](https://matomo.org/guide/manage-matomo/privacy/). The privacy settings, IPv6 mask mapping and explicit `cid` handling were also inspected in the verified 5.14.2 release's native source.

## Historical preparation record (superseded where noted above)

## Verified on 3 November 2026

The Astro site is static on the existing university Apache host. SSH access works. PHP CLI is 8.4.27 and has PDO MySQL, mysqli, OpenSSL, curl, mbstring, XML and zip. The existing rootless MariaDB container on Scylla is healthy. A targeted TCP connection from the website host succeeds on the configured database port; its certificate verifies against the existing private CA. No Matomo application was found in the website tree. The application password is not present at its expected private path on the website host. No authenticated database connection, PHP HTTP execution, Apache symlink access or Matomo installation has been claimed.

The server address and exact network values are recorded in the ignored `.private/matomo-infrastructure.md`, never in frontend configuration. No production files, credentials, users, tables, DNS or firewall rules were changed by this redesign.

## Deployment boundary

The selected future HTTPS endpoint is `https://federico-cerutti.unibs.it/matomo/`. This is an intended endpoint, not an installed service. Website deploys protect `/matomo/` from deletion and exclude it from shareable website backups. Matomo needs a separate protected backup/restore procedure. Existing historical backup archives already in Git have not been removed or rewritten; do not add new ones.

Run Matomo as the existing PHP application stack, without introducing Docker on the web host. Stage a verified stable upstream release outside the document root, e.g. `/home/federico-cerutti/.local/share/matomo/releases/<version>`. Verify its published checksum/signature before extraction. Configure a `current` symlink and arrange the `/matomo/` application mount with the university administrator only after HTTP PHP execution, PHP-user traversal permissions, FollowSymLinks/alias policy and upstream hardening rules are verified. Do not expose a writable, unauthenticated installer to the internet.

Keep the actual `config/config.ini.php` outside the web root with access limited to the PHP identity and owner. Matomo must be able to read it; determine the real HTTP PHP user first. Do not assume the SSH user is the PHP user. Verify HTTP requests to config, tmp, vendor and private paths fail closed. The configuration template in `ops/matomo/config.ini.php.example` contains placeholders only. Render it privately after obtaining the dedicated application's credentials through an approved secret channel. Do not copy the CA private key, root password or environment files to the document root.

## Before completing installation

1. Obtain the application credential and run `php scripts/check-matomo-db.php /absolute/private/server.env` on the intended app host. The script is read-only and verifies the certificate, authentication, engine and encrypted session without printing secrets.
2. Verify the database user is restricted to the real app-host source address and the dedicated database. The previous database setup reports these restrictions; reverify them administratively. Add source-scoped firewall rules with the network administrator; no firewall restriction was established by the earlier database setup. Never expose the database publicly.
3. Review the currently supported Matomo release and PHP security patches, then perform installation behind restricted administrative access. Do not re-create the existing database. Provide only required installation privileges, then review runtime/upgrade privileges.
4. Register the exact website URL through authorised Matomo administration. Obtain the real numeric Site ID; the repository contains no assumed value.
5. Apply the owner-selected privacy profile below before collecting any visits. Disable browser-triggered archiving after a working scheduled job is verified.
6. Use a private scheduled job for `php <app>/console core:archive --url=https://federico-cerutti.unibs.it/matomo/`, hourly with overlap protection. Capture output outside the document root; rotate it and alert on failure. Do not put API tokens in command arguments.
7. Configure encrypted daily database backups with bounded retention, separate config/application backups, and a tested restore into an isolated instance. Take database and application snapshots before every upgrade; restore both together for rollback. Pin releases and review updates monthly. Monitor certificate expiry, job completion and backup age.

## Privacy and enablement gates

### Owner-selected minimal analytics profile — 3 November 2026

The owner wants aggregate page popularity, visits by day/hour and approximate country-level location, with no analytics cookies or intentional collection of personal details. Select three-byte IPv4 masking and verify the installed release's corresponding IPv6 masking. Use the **masked IP for geolocation/enrichment**; do not use the original IP for a more accurate lookup. Country reporting may be inaccurate or unavailable; do not promise region-level precision. Masking reduces identifiability but does not establish that all processing is anonymous.

In Matomo Administration → Privacy → Anonymize data, enable **Force tracking without cookies** globally as well as the frontend `disableCookies` call. The frontend also calls `disableBrowserFeatureDetection` before tracking: do not collect screen resolution or browser plugin information. This does not itself eliminate Matomo's session hash or all visitor-level records. Before activation, review those features and disable unnecessary visitor profiles/log reports; report pageviews rather than claim precise unique-person counts.

Keep User IDs, cross-site tracking, session recordings, heatmaps and precise location collection off. Retain only sanitised pathnames and allowlisted aggregate events. Review the proposed 90-day raw-log and 12-month report retention with the controller; these are preparation defaults, not approved or applied settings. Optional heartbeat-based duration measurement remains unconfigured pending a separate decision.

The owner confirms that Apache access logs are outside their visibility and access; only university sysadmins can administer them. Matomo masking cannot change those logs. Do not claim full IP removal from the hosting infrastructure or attempt to access the logs under this work. The website notice must distinguish the website analytics from university-managed hosting logs.

These settings are a preparation checklist for a future authorised installation. No live Matomo configuration has been applied because Matomo is not installed. Existing activation and consent gates remain in place pending confirmation of the appropriate legal basis and any analytics exemption.

Sources: [IP masking](https://matomo.org/faq/general/how-does-ip-address-anonymisation-work-in-matomo/), [global cookieless enforcement](https://matomo.org/faq/how-to/how-do-i-enforce-tracking-without-cookies/), [browser feature detection](https://matomo.org/faq/how-to/how-do-i-disable-browser-feature-detection-completely/).

The current build has tracking disabled. Both `MATOMO_ENABLED=true` and `MATOMO_PRIVACY_APPROVED=true`, a valid public HTTPS service URL and numeric Site ID are required at build time. The private DB environment is never imported by Astro.

Before enabling, the controller/DPO must approve the legal basis, notice, recipients/hosting, retention and visitor controls. Replace the draft wording on both privacy pages with that approved notice, confirm server settings, and rebuild. Cookie-free operation is not treated as a consent exemption.

The site loads neither the tracker nor tracking requests before an explicit opt-in (or valid unexpired local preference). It queues `requireConsent` before pageviews, disables tracking cookies, uses `setConsentGiven`, and invokes `forgetConsentGiven` on withdrawal. Consent expires after 180 days. Refusing is available through the same settings panel. No third-party requests are made when disabled.

Only pathname-level URLs and allowlisted aggregate action names are sent. No free-text search, person names, email addresses or query strings are attached to events. Contact clicks measure interest, not actual enquiries. Browser navigation deduplication handles `astro:page-load`, although this site currently uses normal page reloads and no ClientRouter.

## Acceptance before a future production activation

Confirm the public HTTPS service, trusted host, correct site ID and admin access controls. Test actual HTTP PHP execution and an authenticated TLS DB session. Test refusal, acceptance, expiry, withdrawal and both ordinary/SPA navigation with Matomo's real tracker in a controlled environment. Verify no personal URL parameters reach reports, no requests occur before consent, backups restore, archive cron runs, and config URLs cannot be downloaded. The automated browser fixture tests the integration command queue and intercepted script request; it does not substitute for testing a real Matomo installation.

References: [installation](https://matomo.org/faq/on-premise/installing-matomo/), [consent](https://developer.matomo.org/guides/tracking-consent), [SPA tracking](https://developer.matomo.org/guides/spa-tracking), [database TLS configuration](https://github.com/matomo-org/matomo/blob/5.x-dev/config/global.ini.php).
