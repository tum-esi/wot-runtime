<template>
  <div class="subview system-metrics">
    <v-container fluid>
      <v-row class="fill-height" align="stretch">
        <v-col sm="6" md="3">
          <app-card-metric-progress-linear
            title="CPU"
            :value="57"
          ></app-card-metric-progress-linear>
        </v-col>

        <v-col sm="6" md="3">
          <app-card-metric-progress-linear
            title="Memory"
            :value="23"
          ></app-card-metric-progress-linear>
        </v-col>

        <v-col sm="6" md="3">
          <app-card-metric-progress-linear
            title="Memory"
            :value="90"
          ></app-card-metric-progress-linear>
        </v-col>

        <v-col sm="6" md="3">
          <app-card-metric-progress-linear
            title="Memory"
            :value="17"
          ></app-card-metric-progress-linear>
        </v-col>
      </v-row>
    </v-container>

    <v-data-table
      v-model="selected"
      :headers="headers"
      mobile-breakpoint="960"
      :items="metrics"
      :loading="isPendingMetrics"
      dense
      item-key="_id"
      multi-sort
      :options.sync="tableOptions"
      show-expand
      :footer-props="tableFooterProps"
      :server-items-length="itemsTotal"
      @current-items="(items) => (filteredItems = items)"
    >
      <template #item.createdAt="{ item }">
        {{ `${item.createdAt.slice(0, 10)} | ${item.createdAt.slice(11, 16)}` }}
      </template>

      <template #expanded-item="{ item, headers }">
        <td :colspan="headers.length" class="pa-0">
          <v-card flat>
            <pre
              style="
                padding: 12px 24px;
                background-color: #121212;
                color: #ffffff;
              "
              >{{ JSON.stringify(item, null, 2) }}</pre
            >
          </v-card>
        </td>
      </template>

      <template #no-data>
        <v-row justify="center" align="center">No data available</v-row>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api'

import { useAPI } from '@/use/api.js'

export default {
  name: 'SystemMetrics',
  components: {
    AppCardMetricProgressLinear: () =>
      import('@/components/cards/AppCardMetricProgressLinear.vue')
  },
  props: {
    hostId: { type: String, required: true }, // passed from vue-router
    id: { type: String, required: true }, // passed from vue-router
    system: { type: Object, required: true },
    srd: { type: Object, required: true },
    thing: { type: Object, required: true },
    horizontal: { type: Boolean }
  },
  setup(props) {
    const query = ref({ _systemId: props.id })

    const {
      items: metrics,
      isPendingItems: isPendingMetrics,
      haveLoaded,
      itemsTotal,
      // utilities:
      search,
      tableOptions,
      tableFooterProps,
      filterItemByProps,
      filteredItems,
      selected,
      isSelected,
      addOrRemoveSelection,
      dialog
    } = useAPI('Metric', query)

    tableOptions.value.sortBy = ['createdAt']
    tableOptions.value.sortDesc = [false]

    // watch(
    //   () => context.root.$route,
    //   $route => {
    //     const level = $route.query.level;
    //     query.value = level
    //       ? level === "metrics"
    //         ? { level: { $in: ["error", "warn", "info", "debug"] } }
    //         : { level }
    //       : {};
    //   }
    // ); // destructuring looses reactivity

    // table:

    const headers = ref([
      {
        text: 'Created at',
        align: 'left',
        sortable: true,
        value: 'createdAt'
      },
      // {
      //   text: "ID",
      //   align: "left",
      //   sortable: true,
      //   value: "_id"
      // },
      {
        text: 'Message',
        align: 'left',
        sortable: true,
        value: 'message'
      }
    ])

    return {
      metrics,
      isPendingMetrics,
      haveLoaded,
      itemsTotal,
      // utilities:
      search,
      tableOptions,
      tableFooterProps,
      filterItemByProps,
      filteredItems,
      selected,
      isSelected,
      addOrRemoveSelection,
      dialog,
      // table:
      headers
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/styles/logs.scss';
</style>
