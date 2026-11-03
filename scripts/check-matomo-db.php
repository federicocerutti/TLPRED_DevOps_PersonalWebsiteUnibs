<?php
// CLI ONLY. Read-only diagnostics; no credential or private host output.
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
if ($argc !== 2 || !is_readable($argv[1])) { fwrite(STDERR, "Usage: php check-matomo-db.php /private/server.env\n"); exit(1); }
$mode = fileperms($argv[1]) & 0777;
if (($mode & 0007) !== 0) { fwrite(STDERR, "Private environment must not be world-accessible.\n"); exit(1); }
$config = parse_ini_file($argv[1], false, INI_SCANNER_RAW);
foreach (['MATOMO_DB_HOST','MATOMO_DB_PORT','MATOMO_DB_NAME','MATOMO_DB_USER','MATOMO_DB_PASSWORD','MATOMO_DB_CA_FILE'] as $key) {
    if (!isset($config[$key]) || $config[$key] === '') { fwrite(STDERR, "Missing required server configuration.\n"); exit(1); }
}
if (!ctype_digit($config['MATOMO_DB_PORT']) || !preg_match('/^[A-Za-z0-9_]+$/', $config['MATOMO_DB_NAME']) || !is_readable($config['MATOMO_DB_CA_FILE'])) { fwrite(STDERR,"Invalid server configuration.\n"); exit(1); }
try {
    $dsn = 'mysql:host='.$config['MATOMO_DB_HOST'].';port='.$config['MATOMO_DB_PORT'].';dbname='.$config['MATOMO_DB_NAME'].';charset=utf8mb4';
    $db = new PDO($dsn, $config['MATOMO_DB_USER'], $config['MATOMO_DB_PASSWORD'], [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION, PDO::MYSQL_ATTR_SSL_CA=>$config['MATOMO_DB_CA_FILE'], PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT=>true, PDO::ATTR_TIMEOUT=>5]);
    $cipher = $db->query("SHOW SESSION STATUS LIKE 'Ssl_cipher'")->fetch(PDO::FETCH_NUM);
    if (empty($cipher[1])) { throw new RuntimeException('Unencrypted database session'); }
    echo 'Authenticated database session verified; engine '.$db->query('SELECT VERSION()')->fetchColumn().'; encrypted transport active.'.PHP_EOL;
} catch (Throwable $error) { fwrite(STDERR,"Database verification failed. Inspect private server logs; credentials and endpoints were withheld.\n"); exit(1); }
