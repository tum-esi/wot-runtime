<template>
  <div class="apexchart-container">
    <div v-if="series" class="apexchart-wrapper">
      <vue-apexchart
        :options.sync="options"
        :series.sync="series"
        height="100%"
        class="apexchart-chart"
      ></vue-apexchart>
    </div>
    <v-row v-else align="center" justify="center">
      <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
        class="mb-5"
      />
    </v-row>
  </div>
</template>

<script>
import { ref, computed } from '@vue/composition-api'

export default {
  name: 'SystemSeqd',
  components: {
    // AppSelect: () => import('@/components/AppSelect.vue'),
    VueApexchart: () => import('vue-apexcharts')
  },
  props: {
    name: { type: [String, String, Number], required: true },
    content: { type: Array, required: true }
  },
  setup(props) {
    const options = ref({
      chart: {
        type: 'line',
        zoom: { enabled: false }
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'straight' },
      title: { text: props.name, align: 'center' },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      }
    })

    const series = computed(() => {
      console.log(props.content)
      const content = props.content
      if (!content) return null
      else {
        // map to array of series objects
        // each series object is of form { name: string, type: string, data: array }
        if (typeof content[0] === 'object') {
          return [
            ...Object.entries(content[0]).map(([key, value]) => ({
              name: key,
              type: 'line',
              data: content.map((item) => item[key])
            }))
          ]
        } else if (typeof content[0] === 'number') {
          return [{ name: 'uptime', type: 'line', data: content }]
        }
      }
    })

    return { options, series }
  }
}
</script>

<style>
.apexchart-container,
.apexchart-wrapper {
  width: 100%;
  height: 100%;
}

.apexchart-chart {
  width: 100%;
}
</style>
