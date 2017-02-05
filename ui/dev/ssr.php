<?php
use Nacmartin\PhpExecJs\PhpExecJs;

require dirname(dirname(__DIR__)) . '/vendor/autoload.php';
$phpexecjs = new PhpExecJs();
header('x-js-runtime: ' . $phpexecjs->getRuntimeName());

$page = $_GET['page'] ?? 'index';
list($app, $preloadState, $ssrMetas) = require(__DIR__ . "/config/{$page}.php");
$code = sprintf('var console = {warn: function(){}, error: function(){}};
var global = global || this, self = self || this, window = window || this;
%s
window.__SERVER_SIDE_MARKUP__ = render(%s,%s);
',
    file_get_contents(__DIR__ . "/build/{$app}_ssr.bundle.js"),
    json_encode($preloadState),
    json_encode($ssrMetas)
);
$start = microtime(true);
$html = $phpexecjs->evalJs($code);

header('x-js-time-exec: ' . (microtime(true) - $start));
header('x-js-time-all:' . (microtime(true) - $_SERVER["REQUEST_TIME_FLOAT"]));
echo $html;
