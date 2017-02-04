<?php
$page = $_GET['page'] ?? 'index';
list($app, $preloadState, $ssrMetas) = require(__DIR__ . "/config/{$page}.php");
$code = sprintf('var console = {warn: function(){}, error: print};
var global = global || this, self = self || this, window = window || this;
window.__PRELOADED_STATE__ = %s;
window.__SSR_METAS__ = %s;
%s
window.__SERVER_SIDE_MARKUP__;
',
    json_encode($preloadState),
    json_encode($ssrMetas),
    file_get_contents(__DIR__ . "/build/{$app}_ssr.bundle.js")
);

$html = (new V8Js)->executeString($code);
echo $html;
