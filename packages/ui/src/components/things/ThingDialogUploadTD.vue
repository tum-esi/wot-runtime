<template>
  <v-container class="mb-5">
    <v-subheader>1. Import from file</v-subheader>
    <v-file-input
      outlined
      dense
      hide-details="true"
      label="File"
      class="mt-3"
    ></v-file-input>
    <v-subheader>2. Import from URL</v-subheader>
    <v-text-field
      v-model="tdURL"
      outlined
      dense
      hide-details="true"
      label="URL"
      class="mt-3"
      prepend-icon="link"
    ></v-text-field>
  </v-container>
</template>

<script>
import { ref } from '@vue/composition-api'
import { useUtils } from '@/use/utils.js'

export default {
  name: 'ThingDialogUploadTD',
  setup() {
    const tdURL = ref('')

    async function fetchTDFromURL() {
      const res = fetch(tdURL)
      const td = await res.json()
      console.log(td)
    }

    const { loadJsonFileInputIntoRefVariable } = useUtils()

    return {
      tdURL,
      fetchTDFromURL,
      loadJsonFileInputIntoRefVariable
    }
  }
}
</script>

<style></style>
