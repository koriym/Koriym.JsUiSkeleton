<?php
init: {
  $page = $_GET['page'] ?? 'index';
  list($app,,) = require(__DIR__ . "/config/{$page}.php");
  $list = '';
  foreach (glob("config/*.php") as $file) {
    $path = pathinfo($file);
    $list .= "<li><a href=\"?page={$path['filename']}\">{$path['filename']}</a>";
    if ($path['filename'] === $page) {
        $list .= " ✔︎</li>\n";
    } else {
        $list .= "</li>\n";
    }
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
  </ui>
  <h2>1) Choose ui/config</h2>
  <ui>
      <?= $list ?>
  </ui>

  <h2>2) Choose rendering method</h2>
  <ui>
      <li><a href="csr.php?page=<?= $page ?>">Client Side</a></li>
      <?php if ($hasSsr): ?>
          <li><a href="ssr.php?page=<?= $page ?>">Server Side</a>
          <li><a href="ssr-dev.php?page=<?= $page ?>">Client Side with SSR Code</a></li>
      <?php endif; ?>
  </body>
</html>
