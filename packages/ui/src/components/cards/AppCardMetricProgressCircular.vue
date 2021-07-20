<template>
  <v-card outlined class="fill-height">
    <v-card-subtitle class="pt-0 pb-0 font-weight-bold">{{
      title
    }}</v-card-subtitle>
    <v-card-text align="center" class="fill-height">
      <v-progress-circular
        :value="value"
        :rotate="90"
        :size="100"
        :width="15"
        :color="percentToHSLColor(value, 0, 100)"
      >
        <v-card-subtitle class="font-weight-bold"
          >{{ Math.ceil(value) }}{{ asPercentage ? '%' : '' }}</v-card-subtitle
        >
      </v-progress-circular>
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

<style></style>
