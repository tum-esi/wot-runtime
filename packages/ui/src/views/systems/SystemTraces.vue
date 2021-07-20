<template>
  <div class="subview system-traces">
    <splitpanes :first-splitter="false" :horizontal="!horizontal">
      <pane :size="40">
        <traces-waterfall></traces-waterfall>
      </pane>
      <pane class="scrollable-y">
        <v-data-table
          v-model="selected"
          :headers="headers"
          mobile-breakpoint="960"
          :items="traces"
          :loading="isPendingTraces"
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
            {{
              `${item.createdAt.slice(0, 10)} | ${item.createdAt.slice(11, 16)}`
            }}
          </template>

          <template #item.ts="{ item }">
            {{ Date(item.ts).slice(15, 24) }}
          </template>

          <template #item.end="{ item }">
            {{ Date(item.end).slice(15, 24) }}
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
      </pane>
    </splitpanes>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

import { useAPI } from '@/use/api.js'

export default {
  name: 'SystemTraces',
  components: {
    Splitpanes,
    Pane,
    TracesWaterfall: () => import('@/components/traces/TracesWaterfall.vue')
  },
  props: {
    hostId: { type: String, required: true }, // passed from vue-router
    id: { type: String, required: true }, // passed from vue-router
    system: { type: Object, required: true },
    srd: { type: Object, required: true },
    thing: { type: Object, required: true },
    horizontal: { type: Boolean }
  },
  setup() {
    const query = ref({})

    const {
      items: traces,
      isPendingItems: isPendingTraces,
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
    } = useAPI('Trace', query)

    tableOptions.value.sortBy = ['createdAt']
    tableOptions.value.sortDesc = [false]

    // watch(
    //   () => context.root.$route,
    //   $route => {
    //     const level = $route.query.level;
    //     query.value = level
    //       ? level === "traces"
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
        text: 'Path',
        align: 'center',
        sortable: false,
        value: 'path'
      },
      {
        text: 'Type',
        align: 'center',
        sortable: false,
        value: 'type'
      },
      {
        text: 'Method',
        align: 'center',
        sortable: false,
        value: 'method'
      },
      {
        text: 'Provider',
        align: 'center',
        sortable: false,
        value: 'provider'
      },
      {
        text: 'Timestamp',
        align: 'center',
        sortable: false,
        value: 'ts'
      },
      {
        text: 'Duration',
        align: 'center',
        sortable: false,
        value: 'duration'
      },
      {
        text: 'End',
        align: 'center',
        sortable: false,
        value: 'end'
      }
    ])

    return {
      traces,
      isPendingTraces,
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
