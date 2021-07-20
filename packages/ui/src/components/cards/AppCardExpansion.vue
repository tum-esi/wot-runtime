<template>
  <v-expansion-panels
    hover
    :value="[0]"
    multiple
    flat
    class="app-card-expansion"
  >
    <v-expansion-panel @change="$emit('change')">
      <v-expansion-panel-header class="font-weight-medium">
        <slot name="header"></slot>
      </v-expansion-panel-header>

      <v-expansion-panel-content>
        <slot name="content"></slot>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  name: 'AppCardExpansion'
}
</script>

<style>
.app-card-expansion {
  /* replicates <v-card flat outlined> styles for v-expansion-panels */
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
}

.theme--dark .app-card-expansion {
  /* replicates <v-card flat outlined> styles for v-expansion-panels */
  border: 1px solid #555555;
}

.app-card-expansion .v-expansion-panel-header {
  min-height: 48px;
  height: 48px;
  padding-top: 0px;
  padding-bottom: 0px;
}

.theme--dark .app-card-expansion .v-expansion-panel-header {
  background-color: #1f1f1f !important;
  color: white;
}

.theme--dark .app-card-expansion .v-expansion-panel,
.theme--dark .app-card-expansion .v-expansion-panel-content .v-card {
  background-color: #1f1f1f !important;
}

.v-expansion-panel a {
  flex: none !important;
}

.v-expansion-panel a:hover {
  text-decoration: underline;
}
</style>
