<template>
  <v-card outlined class="fill-height">
    <v-card-subtitle class="pt-0 pb-0 font-weight-bold">{{
      title
    }}</v-card-subtitle>
    <v-card-text class="metric-value">
      <span class="text-h3">{{ value }}</span>
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
      type: [Number, String, Array, Object],
      required: true
    },
    asPercentage: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    const { percentToHSLColor } = useUtils()

    return { percentToHSLColor }
  }
}
</script>

<style scoped>
.metric-value {
  display: grid;
  place-items: center;
  height: calc(100% - 22px); /* minus toolbar */
}
</style>
