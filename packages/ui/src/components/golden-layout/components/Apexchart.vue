<template>
  <div class="apexchart-container">
    <!-- <app-select
      :items="types"
      :item="type"
      :options="{
        style: 'max-width: 83px; display: inline-block;'
      }"
      @changed="(val) => (type = val)"
    /> -->
    <div class="apexchart-wrapper">
      <vue-apexchart
        v-if="Array.isArray(series)"
        :options="options"
        :series="series"
        height="100%"
        class="apexchart-chart"
      ></vue-apexchart>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Apexchart',
  components: {
    // AppSelect: () => import('@/components/AppSelect.vue'),
    VueApexchart: () => import('vue-apexcharts')
  },
  props: {
    chartSeries: {
      type: Array,
      required: true
    },
    chartOptions: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    types: ['bar', 'line', 'area'],
    options: null,
    series: null
  }),
  mounted() {
    this.options = this.chartOptions
    this.series = this.chartSeries
  },
  methods: {
    updateChart() {
      const max = 90
      const min = 20
      const newData = this.series[0].data.map(() => {
        return Math.floor(Math.random() * (max - min + 1)) + min
      })
      // In the same way, update the series option
      this.series = [
        {
          data: newData
        }
      ]
    }
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
