<template>
  <v-dialog v-model="dialog" width="800">
    <template #activator="{ on }">
      <v-icon v-on="on">{{ icon }}</v-icon>
    </template>

    <v-card flat>
      <v-toolbar flat color="transparent">
        <v-card-title>{{ name }}</v-card-title>
        <v-spacer></v-spacer>
        <v-btn color="primary" icon @click="dialog = false">
          <v-icon>clear</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <slot>
          <pre class="language-js">
            <code> {{formatJson(content)}} </code>
          </pre>
        </slot>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref } from '@vue/composition-api'

export default {
  name: 'AppDialogPreview',
  props: {
    name: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: 'remove_red_eye'
    },
    content: {
      type: [String, Object, Array, Number],
      required: true
    }
  },
  setup() {
    const dialog = ref(false)

    // utils:

    function formatJson(content) {
      try {
        return JSON.parse(content, null, 2)
      } catch {
        return typeof content === 'string' ? content.trim() : content
      }
    }

    return {
      dialog,
      // utils:
      formatJson
    }
  }
}
</script>

<style></style>
