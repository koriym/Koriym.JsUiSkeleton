<?php
init: {
  $page = $_GET['page'] ?? 'index';
  list($app,,) = require(__DIR__ . "/config/{$page}.php");
  $list = '';
  foreach (glob("config/*.php") as $file) {
    $path = pathinfo($file);
    $list .= "<li><a href=\"?page={$path['filename']}\">{$path['filename']}</a></li>\n";
  }
  $hasSsr = file_exists(__DIR__ . "/build/{$app}_ssr.bundle.js");
}
?>
<!doctype html>
<html>
<head>
  <title>JS UI</title>
  <!-- Latest compiled and minified CSS -->
</head>
  <body>
  <h1><?= $app ?>.bundle.js - <?= $page ?>.php </h1>
  <h2>Rendering method</h2>
  <ui>
    <li><a href="csr.php?page=<?= $page ?>">Client Side</a></li>
<?php if ($hasSsr): ?>
    <li><a href="ssr.php?page=<?= $page ?>">Server Side</a>
    <li><a href="ssr-dev.php?page=<?= $page ?>">Server Side (run on client)</a></li>
<?php endif; ?>
  </ui>
  <h2>Available UI</h2>
  <ui>
      <?= $list ?>
  </ui>
  </body>
</html>
