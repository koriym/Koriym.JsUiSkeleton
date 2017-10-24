<?php
init: {
    $page = $_GET['page'] ?? 'index';
    list($app, $preloadState,) = require(__DIR__ . "/config/{$page}.php");
}
?>
<!DOCTYPE html>
<head>
  <title>CSR</title>
</head>
<body>
  <div id="root"></div>
  <script>
    var __PRELOADED_STATE__ = <?php echo json_encode($preloadState, JSON_HEX_TAG);?>;
    console.log("__PRELOADED_STATE__",__PRELOADED_STATE__);
  </script>
  <script src="build/<?= $app ?>.bundle.js"></script>
</body>
</html>
