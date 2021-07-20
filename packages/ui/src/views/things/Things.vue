<template>
  <div class="view things">
    <v-toolbar flat dense color="transparent">
      <v-toolbar-title>
        <span class="breadcrumb-link" @click="$router.push({ name: 'Hosts' })">
          Hosts
        </span>
        <v-icon class="pl-2 pr-2">keyboard_arrow_right</v-icon>Things
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="$vuetify.theme.dark = !$vuetify.theme.dark">
        <v-icon>{{ $vuetify.theme.dark ? 'nights_stay' : 'wb_sunny' }}</v-icon>
      </v-btn>
    </v-toolbar>

    <v-container fluid>
      <v-row class="fill-height" align="stretch">
        <v-col class="xs" cols="12" sm="4" md="2">
          <app-card-metric-value
            title="Total Things"
            :value="totalThingsMetric"
            :as-percentage="false"
          ></app-card-metric-value>
        </v-col>

        <v-col class="xs" cols="12" sm="4" md="2">
          <app-card-metric-value
            title="Consumed Things"
            :value="thingsMetric"
            :as-percentage="false"
          ></app-card-metric-value>
        </v-col>

        <v-col class="xs" cols="12" sm="4" md="2">
          <app-card-metric-value
            title="Exposed Things"
            :value="exposedThingsMetric"
            :as-percentage="false"
          ></app-card-metric-value>
        </v-col>

        <v-col class="xs" cols="12" sm="4" md="2">
          <app-card-metric-progress-circular
            title="CPU"
            :value="26"
          ></app-card-metric-progress-circular>
        </v-col>

        <v-col class="xs" cols="12" sm="4" md="2">
          <app-card-metric-progress-circular
            title="CPU"
            :value="56"
          ></app-card-metric-progress-circular>
        </v-col>

        <v-col class="xs" cols="12" sm="4" md="2">
          <app-card-metric-progress-circular
            title="Memory"
            :value="78"
          ></app-card-metric-progress-circular>
        </v-col>
      </v-row>
    </v-container>

    <v-row class="pl-3 pr-3">
      <v-col>
        <v-data-table
          :headers="headers"
          mobile-breakpoint="960"
          :items="things"
          :loading="isPendingThings"
          dense
          item-key="_id"
          multi-sort
          show-select
          :single-select="true"
          :options.sync="tableOptions"
          :footer-props="tableFooterProps"
          :server-items-length="thingsTotal"
          @current-items="(items) => (filteredItems = items)"
          @click:row="
            (item) => $router.push({ name: 'Thing', params: { id: item._id } })
          "
        >
          <template #top>
            <v-toolbar flat dense color="transparent">
              <v-spacer></v-spacer>

              <v-btn color="primary" small depressed @click="dialog = true"
                >Create</v-btn
              >
            </v-toolbar>
          </template>

          <template #item.data-table-select="{ item }">
            <div style="display: flex">
              <v-btn icon small @click.stop="edit(item)">
                <v-icon small>edit</v-icon>
              </v-btn>
              <v-btn icon small @click.stop="clone(item)">
                <v-icon small>content_copy</v-icon>
              </v-btn>
              <v-btn icon small @click.stop="remove(item)">
                <v-icon small>delete</v-icon>
              </v-btn>
            </div>
          </template>

          <template #item.createdAt="{ item }">
            {{
              `${item.createdAt.slice(0, 10)} | ${item.createdAt.slice(11, 16)}`
            }}
          </template>

          <template #item.name="{ item }">
            <strong>{{ item.name }}</strong>
          </template>

          <template #item.td="{ item }">
            <app-dialog-preview
              :name="item.name"
              icon="description"
              :content="item.td"
            ></app-dialog-preview>
          </template>

          <template #no-data>
            <v-row justify="center" align="center">No data available</v-row>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-toolbar flat color="transparent">
          <v-card-title class="headline">Create</v-card-title>
          <v-spacer></v-spacer>
          <v-btn color="primary" icon @click="dialog = false">
            <v-icon>clear</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  v-model="editedItem.name"
                  label="Name"
                  outlined
                  hide-details="auto"
                  dense
                  :autofocus="true"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <label class="mr-5">Thin Description</label>
                <input
                  id="file-input"
                  class="v-file-input"
                  type="file"
                  accept="application/json"
                  outlined
                  dense
                  @input="
                    (e) => loadJsonFileInputIntoRefVariable(e, editedItem, 'td')
                  "
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" depressed @click="save(editedItem)"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, computed } from '@vue/composition-api'

import { useAPI } from '@/use/api.js'

export default {
  name: 'Things',
  components: {
    AppCardMetricValue: () =>
      import('@/components/cards/AppCardMetricValue.vue'),
    AppCardMetricProgressCircular: () =>
      import('@/components/cards/AppCardMetricProgressCircular.vue'),
    AppDialogPreview: () => import('@/components/AppDialogPreview.vue')
  },
  setup(props) {
    const query = ref({ _hostId: props.hostId })

    const {
      items: things,
      isPendingItems: isPendingThings,
      haveLoaded,
      itemsTotal: thingsTotal,
      // utilities:
      tableOptions,
      tableFooterProps,
      filterItemByProps,
      filteredItems,
      dialog,
      // CRUD:
      createItem,
      updateItem,
      removeItem,
      cloneItems
    } = useAPI('Thing', query)

    // metrics:

    const totalThingsMetric = computed(() => thingsTotal.value)

    const thingsMetric = computed(() => `${8}/${20}`)

    const exposedThingsMetric = computed(() => `${12}/${20}`)

    // local:

    function edit(item) {
      editedItem.value = { ...item }
      dialog.value = true
    }

    async function save(item) {
      if (item._id) await updateItem({ ...item, td: JSON.stringify(item.td) })
      else await createItem({ ...item, td: JSON.stringify(item.td) })
      query.value = { ...query.value } // refetch items
      dialog.value = false
    }

    async function clone(item) {
      cloneItems([item])
      query.value = { ...query.value } // refetch items
    }

    async function remove(item) {
      removeItem(item)
      query.value = { ...query.value } // refetch items
    }

    const headers = ref([
      {
        text: 'Created at',
        align: 'left',
        sortable: true,
        value: 'createdAt'
      },
      {
        text: 'ID',
        align: 'left',
        sortable: true,
        value: '_id'
      },
      {
        text: 'Name',
        align: 'left',
        sortable: true,
        value: 'name'
      },
      {
        text: 'TD',
        align: 'center',
        sortable: false,
        value: 'td'
      }
    ])

    const editedItem = ref({ name: '', td: '' })

    // files:

    function loadJsonFileInputIntoRefVariable(event, refVar, key) {
      const file = event.target
        ? event.target.files[0] // input element returns event
        : document.getElementById('file-input').files[0] // v-file-input does not return event (get directly)
      const reader = new FileReader()

      function onFileRead(event) {
        const json = JSON.parse(event.target.result)
        console.debug(json)
        refVar[key] = json
      }

      reader.onload = (e) => onFileRead(e)
      reader.readAsText(file)
    }

    return {
      things,
      isPendingThings,
      haveLoaded,
      thingsTotal,
      // utilities:
      tableOptions,
      tableFooterProps,
      filterItemByProps,
      filteredItems,
      // metrics:
      totalThingsMetric,
      thingsMetric,
      exposedThingsMetric,
      // local:
      edit,
      save,
      clone,
      remove,
      dialog,
      headers,
      editedItem,
      // files:
      loadJsonFileInputIntoRefVariable
    }
  }
}
</script>
