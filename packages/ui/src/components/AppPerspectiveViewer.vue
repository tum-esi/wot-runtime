<template>
  <perspective-viewer id="view1"></perspective-viewer>
</template>

<script>
// import perspective from "@finos/perspective";
import '@finos/perspective-viewer'
import '@finos/perspective-viewer-datagrid'
import '@finos/perspective-viewer-d3fc'

//Themes based on Google's Material Design Language
// import "@finos/perspective-viewer/themes/material.css";
// import "@finos/perspective-viewer/themes/material.dark.css";
// import "@finos/perspective-viewer/themes/material-dense.css";
// import "@finos/perspective-viewer/themes/material-dense.dark.css";
//Vaporwave theme
// import "@finos/perspective-viewer/themes/vaporwave.css";

document.addEventListener('WebComponentsReady', () => {
  var viewer = document.getElementById('view1')

  const data = [
    { x: 1, y: 'a', z: true },
    { x: 2, y: 'b', z: false },
    { x: 3, y: 'c', z: true },
    { x: 4, y: 'd', z: false }
  ]

  // // Create a new worker, then a new table on that worker.
  //   var table = perspective.worker().table(data);

  //   // Bind a viewer element to this table.
  //   viewer.load(table);

  viewer.setAttribute('columns', JSON.stringify(['x', "y'"]))

  viewer.load(data)

  // Add new row
  viewer.update([{ x: 5, y: 'e', z: true }])

  console.log(viewer)
})

export default {
  name: 'AppPerspectiveViewer',
  props: {
    options: { type: Object, required: true }
  },
  setup() {
    //   console.log("onMounted", viewer);

    // onUnmounted(() => console.log("onUnmounted", viewer));

    return {}
  }
}
</script>

<style></style>
