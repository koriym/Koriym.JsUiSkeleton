<?php

declare(strict_types=1);

use Koriym\Baracoa\ExecJsInterface;
use Koriym\Baracoa\PhpExecJs;

require dirname(__DIR__, 2) . '/vendor/autoload.php';

$page = $_GET['page'] ?? 'index';
if (!preg_match('/^[a-zA-Z0-9_-]+$/', $page)) {
    http_response_code(400);
    exit('Invalid page parameter');
}
[$app, $state, $metas] = require __DIR__ . "/config/{$page}.php";

$bundlePath = dirname(__DIR__, 2) . "/public/build/{$app}_ssr.bundle.js";
if (!file_exists($bundlePath)) {
    http_response_code(500);
    exit("SSR bundle not found: {$bundlePath}. Run 'npm run build:ssr' first.");
}

/** @var ExecJsInterface $execJs */
$execJs = new PhpExecJs();
$js = file_get_contents($bundlePath);
$stateJson = json_encode($state);
$metasJson = json_encode($metas);

$start = microtime(true);
$html = $execJs->evalJs("{$js}; render({$stateJson}, {$metasJson});");

header('X-JS-Time-Exec: ' . (microtime(true) - $start));
header('X-JS-Time-All: ' . (microtime(true) - $_SERVER['REQUEST_TIME_FLOAT']));
echo $html;
