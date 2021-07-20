<template>
  <div class="interaction-event-container">
    {{ interactionName }}: {{ event }}
  </div>
</template>

<script>
/**
 * IMPORTANT: dynamically mounted components (this will be inside golden-layout)
 * cannot declare stuff inside of setup(), as setup() runs before component mounts.
 * Doing so throws errors despite utilizing v-if in the template to work for when
 * this 'stuff' (refs/functions) become defined (they somehow never do). The current
 * workaround is declaring everything with the traditional options API (data, methods,
 * mounted, etc) instead of using the newer composition API
 */

export default {
  name: 'InteractionEvent',
  components: {},
  props: {
    thing: { type: Object, required: true },
    interactionName: { type: String, required: true },
    interaction: { type: Object, required: true }
  },
  // setup() { IMPORTANT: cannot use setup()! },
  // IMPORTANT: props are not defined till nextTick() (mounted means el mounted, not that all props exist)\
  async mounted() {
    this.$nextTick(() => {})
  }
}
</script>

<style scoped>
.interaction-event-container {
  height: 100%;
}
</style>
