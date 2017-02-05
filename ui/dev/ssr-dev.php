<?php
$page = $_GET['page'] ?? 'index';
list($app, $preloadState, $ssrMetas) = require(__DIR__ . "/config/{$page}.php");
$preloadStateJson = json_encode($preloadState, JSON_HEX_TAG);
$ssrMetasJspm = json_encode($ssrMetas, JSON_HEX_TAG);
?>
<script src="build/<?=$app?>_ssr.bundle.js"></script>
<script>
  var markup = render(<?= $preloadStateJson ?>,<?= $ssrMetasJspm ?>);
  console.log("__PRELOADED_STATE__:", <?= $preloadStateJson ?>);
  console.log("METAS:", <?= $ssrMetasJspm ?>);
  console.log("MARKUP:\n",markup);
</script>
<script>
  document.write(markup);
</script>
