<template>
  <div class="subview system-logs">
    <v-data-table
      v-model="selected"
      :headers="headers"
      mobile-breakpoint="960"
      :items="logs"
      :loading="isPendingLogs"
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

      <template #item.message="{ item }">
        <v-container style="word-wrap: break-word">{{
          item.message
        }}</v-container>
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
  name: 'SystemLogs',
  props: {
    hostId: { type: String, required: true }, // passed from vue-router
    id: { type: String, required: true }, // passed from vue-router
    system: { type: Object, required: true },
    srd: { type: Object, required: true },
    thing: { type: Object, required: true }
  },
  setup(props) {
    const query = ref({
      _systemId: props.id,
      $sort: {
        createdAt: -1
      }
    })

    const {
      items: logs,
      isPendingItems: isPendingLogs,
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
    } = useAPI('Log', query)

    tableOptions.value.sortBy = ['createdAt']
    tableOptions.value.sortDesc = [false]

    // watch(
    //   () => context.root.$route,
    //   $route => {
    //     const level = $route.query.level;
    //     query.value = level
    //       ? level === "logs"
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
        text: 'Service',
        align: 'center',
        sortable: true,
        value: 'service'
      },
      {
        text: 'Message',
        align: 'left',
        sortable: true,
        value: 'message'
      }
    ])

    return {
      logs,
      isPendingLogs,
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
