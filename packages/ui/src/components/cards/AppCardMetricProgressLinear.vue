<template>
  <v-card outlined class="fill-height">
    <v-card-subtitle class="pt-0 pb-0 font-weight-bold">{{
      title
    }}</v-card-subtitle>
    <v-card-text class="metric-progress-linear">
      <v-progress-linear
        :value="value"
        :color="percentToHSLColor(value, 0, 100)"
        height="25"
      >
        <template v-slot="{ value: metricValue }">
          <v-card-subtitle class="font-weight-bold"
            >{{ Math.ceil(metricValue)
            }}{{ asPercentage ? '%' : '' }}</v-card-subtitle
          >
        </template>
      </v-progress-linear>
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
.metric-progress-linear {
  display: grid;
  place-items: center;
  height: calc(100% - 22px); /* minus toolbar */
}
</style>
