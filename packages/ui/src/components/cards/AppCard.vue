<template>
  <v-card class="app-card" outlined width="100%">
    <v-toolbar v-if="$slots['toolbar']" dense flat>
      <slot name="toolbar"></slot>

      <template v-if="$slots['toolbar-extension']" #extension>
        <slot name="toolbar-extension"></slot>
      </template>
    </v-toolbar>

    <v-card-text class="pa-0">
      <slot></slot>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'AppCard'
}
</script>

<style>
.app-card {
  /* replicates <v-card flat outlined> styles for v-expansion-panels */
  margin-bottom: 20px !important;
  border: 1px solid #e0e0e0 !important;
}

.theme--dark .app-card {
  /* replicates <v-card flat outlined> styles for v-expansion-panels */
  border: 1px solid #555555 !important;
  background-color: #1f1f1f !important;
}

.app-card .v-toolbar__title {
  font-size: 16px;
  font-weight: 500;
  color: #555555;
  padding: 0px;
}
</style>
