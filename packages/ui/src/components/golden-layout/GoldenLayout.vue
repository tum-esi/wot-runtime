<template>
  <div id="golden-layout-container" ref="container"></div>
</template>

<script>
import { onMounted } from '@vue/composition-api'
import { useGoldenLayout } from '@/use/goldenLayout.js'

export default {
  name: 'GoldenLayout',
  setup() {
    const { init } = useGoldenLayout()

    onMounted(async () => await init('#golden-layout-container'))

    return {}
  }
}
</script>

<style>
#golden-layout-container {
  width: 100%;
  height: 100%;
}

.theme--dark .lm_header {
  background: black !important;
}
</style>
