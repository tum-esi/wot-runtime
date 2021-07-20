<template>
  <v-card outlined class="fill-height">
    <v-card-subtitle class="pt-0 pb-0 font-weight-bold">{{
      title
    }}</v-card-subtitle>
    <v-card-text align="center">
      <v-progress-circular
        :rotate="90"
        :size="100"
        :width="15"
        :value="75"
        :color="percentToHSLColor(value, 0, 100)"
        >{{ value }}</v-progress-circular
      >
    </v-card-text>
  </v-card>
</template>

<script>
import { useUtils } from '@/use/utils.js'

export default {
  name: 'AppCardMetric',
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Number,
      required: true
    }
  },
  setup() {
    const { percentToHSLColor } = useUtils()

    return { percentToHSLColor }
  }
}
</script>

<style></style>
