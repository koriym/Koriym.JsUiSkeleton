<?php
$page = $_GET['page'] ?? 'index';
list($app, $preloadState, $ssrMetas) = require(__DIR__ . "/config/{$page}.php");
?>
<script>
  var __PRELOADED_STATE__ = <?php echo json_encode($preloadState, JSON_HEX_TAG);?>;
  var __SSR_METAS__ = <?php echo json_encode($ssrMetas, JSON_HEX_TAG);?>;
</script>
<script src="build/<?=$app?>_ssr.bundle.js"></script>
<script>
  console.log("__PRELOADED_STATE__:", window.__PRELOADED_STATE__);
  console.log("__SSR_METAS__:", window.__SSR_METAS__);
  console.log("__SERVER_SIDE_MARKUP__:", window.__SERVER_SIDE_MARKUP__);
</script>
<script>
  document.write(window.__SERVER_SIDE_MARKUP__);
</script>
