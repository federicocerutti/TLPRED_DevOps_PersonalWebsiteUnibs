# PageHeartbeat

Matomo 5.14.2's native `randomizeConfigId` branch always creates a new visit and
skips visitor recognition, including for explicit `cid` values. Native heartbeats
therefore cannot update duration under that setting.

This extension retains that native branch, its random config ID, global
cookieless enforcement and IP handling. For site 1 only, it records the frontend's
memory-only per-document `cid` as the page identity and permits only heartbeat
requests to recognise it. Recognition uses Matomo's forced-ID lookup, without
browser/IP fingerprint matching. Pageviews remain separate visits; unknown or
expired heartbeats remain subject to the native rejection.

Copy this folder into the installed application's `plugins/PageHeartbeat`, then
activate it with `php console plugin:activate PageHeartbeat` and clear caches.
It is deployed separately from the static site, whose helper protects `/matomo/`.
Include this extension in recovery backups. Recheck native tracking behavior and
the live heartbeat/privacy checks before upgrading Matomo; version 6 is excluded.

Keep the frontend ID fresh on each document load, send it using
`appendToTrackingUrl('cid=' + pageId)`, and never persist it. Do not report these
per-page identities as unique people or cross-page sessions.
