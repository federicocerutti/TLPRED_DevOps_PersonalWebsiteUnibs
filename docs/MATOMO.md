# Matomo: preparation and activation runbook

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
5. Configure IP anonymisation (at least two IPv4 bytes, equivalent IPv6 minimisation), anonymised geolocation, 90-day raw-log retention and 12-month aggregate retention as proposed controller-review defaults. Keep session recordings, heatmaps, user IDs and cross-site tracking off. Disable browser-triggered archiving after a working scheduled job is verified.
6. Use a private scheduled job for `php <app>/console core:archive --url=https://federico-cerutti.unibs.it/matomo/`, hourly with overlap protection. Capture output outside the document root; rotate it and alert on failure. Do not put API tokens in command arguments.
7. Configure encrypted daily database backups with bounded retention, separate config/application backups, and a tested restore into an isolated instance. Take database and application snapshots before every upgrade; restore both together for rollback. Pin releases and review updates monthly. Monitor certificate expiry, job completion and backup age.

## Privacy and enablement gates

The current build has tracking disabled. Both `MATOMO_ENABLED=true` and `MATOMO_PRIVACY_APPROVED=true`, a valid public HTTPS service URL and numeric Site ID are required at build time. The private DB environment is never imported by Astro.

Before enabling, the controller/DPO must approve the legal basis, notice, recipients/hosting, retention and visitor controls. Replace the draft wording on both privacy pages with that approved notice, confirm server settings, and rebuild. Cookie-free operation is not treated as a consent exemption.

The site loads neither the tracker nor tracking requests before an explicit opt-in (or valid unexpired local preference). It queues `requireConsent` before pageviews, disables tracking cookies, uses `setConsentGiven`, and invokes `forgetConsentGiven` on withdrawal. Consent expires after 180 days. Refusing is available through the same settings panel. No third-party requests are made when disabled.

Only pathname-level URLs and allowlisted aggregate action names are sent. No free-text search, person names, email addresses or query strings are attached to events. Contact clicks measure interest, not actual enquiries. Browser navigation deduplication handles `astro:page-load`, although this site currently uses normal page reloads and no ClientRouter.

## Acceptance before a future production activation

Confirm the public HTTPS service, trusted host, correct site ID and admin access controls. Test actual HTTP PHP execution and an authenticated TLS DB session. Test refusal, acceptance, expiry, withdrawal and both ordinary/SPA navigation with Matomo's real tracker in a controlled environment. Verify no personal URL parameters reach reports, no requests occur before consent, backups restore, archive cron runs, and config URLs cannot be downloaded. The automated browser fixture tests the integration command queue and intercepted script request; it does not substitute for testing a real Matomo installation.

References: [installation](https://matomo.org/faq/on-premise/installing-matomo/), [consent](https://developer.matomo.org/guides/tracking-consent), [SPA tracking](https://developer.matomo.org/guides/spa-tracking), [database TLS configuration](https://github.com/matomo-org/matomo/blob/5.x-dev/config/global.ini.php).
