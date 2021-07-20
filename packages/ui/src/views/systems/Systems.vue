<template>
  <div class="view systems">
    <v-toolbar flat dense color="transparent">
      <v-toolbar-title>
        <span class="breadcrumb-link" @click="$router.push({ name: 'Hosts' })">
          Hosts
        </span>
        <v-icon class="pl-2 pr-2">keyboard_arrow_right</v-icon>Systems
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
            title="Total Systems"
            :value="totalSystemsMetric"
            :as-percentage="false"
          ></app-card-metric-value>
        </v-col>

        <v-col class="xs" cols="12" sm="4" md="2">
          <app-card-metric-value
            title="Idle Systems"
            :value="idleSystemsMetric"
            :as-percentage="false"
          ></app-card-metric-value>
        </v-col>

        <v-col class="xs" cols="12" sm="4" md="2">
          <app-card-metric-value
            title="Loading Systems"
            :value="loadingSystemsMetric"
            :as-percentage="false"
          ></app-card-metric-value>
        </v-col>

        <v-col class="xs" cols="12" sm="4" md="2">
          <app-card-metric-value
            title="Running Systems"
            :value="runningSystemsMetric"
            :as-percentage="false"
          ></app-card-metric-value>
        </v-col>

        <v-col class="xs" cols="12" sm="4" md="2">
          <app-card-metric-value
            title="Stopped Systems"
            :value="stoppedSystemsMetric"
            :as-percentage="false"
          ></app-card-metric-value>
        </v-col>

        <v-col class="xs" cols="12" sm="4" md="2">
          <app-card-metric-value
            title="Failed Systems"
            :value="failedSystemsMetric"
            :as-percentage="false"
          ></app-card-metric-value>
        </v-col>

        <!-- <v-col cols="12" xs="6" sm="4" md="2">
          <app-card-metric-progress-circular title="CPU" :value="57"></app-card-metric-progress-circular>
        </v-col>

        <v-col cols="12" xs="6" sm="4" md="2">
          <app-card-metric-progress-circular title="CPU" :value="19"></app-card-metric-progress-circular>
        </v-col>

        <v-col cols="12" xs="6" sm="4" md="2">
          <app-card-metric-progress-circular title="Memory" :value="78"></app-card-metric-progress-circular>
        </v-col>-->
      </v-row>
    </v-container>

    <v-row class="pl-3 pr-3">
      <v-col>
        <v-data-table
          :headers="headers"
          mobile-breakpoint="960"
          :items="systems"
          :loading="isPendingSystems"
          dense
          item-key="_id"
          multi-sort
          show-select
          :single-select="true"
          :options.sync="tableOptions"
          :footer-props="tableFooterProps"
          :server-items-length="systemsTotal"
          @current-items="(items) => (filteredItems = items)"
          @click:row="(item) => handleSystemClick(item)"
        >
          <template #top>
            <v-toolbar flat dense color="transparent">
              <v-tabs>
                <v-tab
                  v-for="(tab, i) in tabs"
                  :key="`v-tab-${i}`"
                  :to="tab.to"
                  exact
                >
                  <v-icon v-if="tab.icon" small left>{{ tab.icon }}</v-icon>
                  {{ tab.text }}
                </v-tab>
              </v-tabs>

              <v-spacer></v-spacer>

              <v-btn
                color="primary"
                small
                depressed
                class="mr-2"
                @click="dialog = true"
                >Create</v-btn
              >
              <v-btn
                color="accent"
                small
                outlined
                class="mr-2"
                @click="systems.forEach((system) => restart(system))"
                >Restart All</v-btn
              >
              <v-btn
                color="error"
                small
                outlined
                @click="systems.forEach((system) => stop(system))"
                >Stop All</v-btn
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

          <template #item.host="{ item }">
            <a
              :href="`http://localhost:8080/${item.name.toLowerCase()}`"
              @click.stop
            >
              {{ `http://localhost:8080/${item.name.toLowerCase()}` }}
            </a>
          </template>

          <template #item.status="{ item }">
            <v-chip small outlined :color="statusesEnum[item.status].color">
              {{ item.status }}
            </v-chip>
          </template>

          <template #item.sd="{ item }">
            <app-dialog-preview
              :name="item.name"
              icon="description"
              :content="item.sd"
            ></app-dialog-preview>
          </template>

          <template #item.seqD="{ item }">
            <app-dialog-preview
              :name="item.name"
              icon="insert_photo"
              :content="item.seqD"
            >
              <system-seqd :content="item.seqD"></system-seqd>
            </app-dialog-preview>
          </template>

          <template #item.code="{ item }">
            <app-dialog-preview
              v-if="item.code"
              :name="item.name"
              icon="code"
              :content="item.code"
            ></app-dialog-preview>
          </template>

          <template #item.actions="{ item }">
            <v-tooltip v-if="item.status === 'loading'" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon loading v-bind="attrs" v-on="on"></v-btn>
              </template>
              <span>Deploying...</span>
            </v-tooltip>

            <v-tooltip v-else-if="item.status === 'running'" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  color="error"
                  v-bind="attrs"
                  @click.stop="stop(item)"
                  v-on="on"
                >
                  <v-icon>stop</v-icon>
                </v-btn>
              </template>
              <span>Stop</span>
            </v-tooltip>

            <v-tooltip v-else-if="item.status === 'stopped'" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  color="success"
                  v-bind="attrs"
                  @click.stop="start(item)"
                  v-on="on"
                >
                  <v-icon>play_circle_outline</v-icon>
                </v-btn>
              </template>
              <span>Start</span>
            </v-tooltip>

            <v-tooltip v-else bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  color="warning"
                  v-bind="attrs"
                  @click.stop="restart(item)"
                  v-on="on"
                >
                  <v-icon>replay</v-icon>
                </v-btn>
              </template>
              <span>Restart</span>
            </v-tooltip>
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
                <label class="mr-5">System Description</label>
                <input
                  id="sd-input"
                  class="v-file-input"
                  type="file"
                  accept="application/json"
                  outlined
                  dense
                  @input="
                    (e) => loadTextFileInputIntoRefVariable(e, editedItem, 'sd')
                  "
                />
              </v-col>
              <!-- <v-col cols="12" sm="12" md="12">
                <label class="mr-5">Code</label>
                <v-textarea
                  v-model="editedItem.code"
                  outlined
                  hide-details="auto"
                  dense
                ></v-textarea>
                <input
                  id="code-input"
                  class="v-file-input"
                  type="file"
                  accept="text/javascript"
                  outlined
                  dense
                  @input="
                    e => loadTextFileInputIntoRefVariable(e, editedItem, 'code')
                  "
                />
              </v-col> -->
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
import { ref, computed, watch } from '@vue/composition-api'

import { useAPI } from '@/use/api.js'
import { useDeployment } from '@/use/systems.js'
import { useUtils } from '@/use/utils.js'

// import * as sdSchema from "@/utils/sdSchema.json";

export default {
  name: 'Systems',
  components: {
    AppCardMetricValue: () =>
      import('@/components/cards/AppCardMetricValue.vue'),
    // AppCardMetricProgressCircular: () =>
    //   import("@/components/cards/AppCardMetricProgressCircular.vue"),
    AppDialogPreview: () => import('@/components/AppDialogPreview.vue'),
    SystemSeqd: () =>
      import('@/components/golden-layout/components/SystemSeqd.vue')
  },
  props: {
    hostId: { type: String, required: true } // passed from vue-router
  },
  setup(props, context) {
    const { $api, $router, $store } = context.root

    const query = ref({ _hostId: props.hostId })

    const {
      items: systems,
      isPendingItems: isPendingSystems,
      haveLoaded,
      itemsTotal: systemsTotal,
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
    } = useAPI('System', query)

    // deployment:

    const { start, restart, stop } = useDeployment($api, query)

    // metrics:

    const totalSystemsMetric = computed(() => systemsTotal.value)

    const idleSystemsMetric = computed(
      () =>
        `${systems.value.filter((s) => s.status === 'idle').length}/${
          systemsTotal.value
        }`
    )

    const loadingSystemsMetric = computed(
      () =>
        `${systems.value.filter((s) => s.status === 'loading').length}/${
          systemsTotal.value
        }`
    )

    const runningSystemsMetric = computed(
      () =>
        `${systems.value.filter((s) => s.status === 'running').length}/${
          systemsTotal.value
        }`
    )

    const stoppedSystemsMetric = computed(
      () =>
        `${systems.value.filter((s) => s.status === 'stopped').length}/${
          systemsTotal.value
        }`
    )

    const failedSystemsMetric = computed(
      () =>
        `${systems.value.filter((s) => s.status === 'failed').length}/${
          systemsTotal.value
        }`
    )

    // local:

    function edit(item) {
      editedItem.value = { ...item }
      dialog.value = true
    }

    async function save(item) {
      if (item._id) await updateItem({ ...item, sd: JSON.stringify(item.sd) })
      else await createItem({ ...item, sd: JSON.stringify(item.sd) })
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

    const tabs = ref([
      { to: { name: 'Systems' }, text: 'All' },
      {
        to: { name: 'Systems', query: { ...query.value, status: 'idle' } },
        text: 'Idle'
      },
      {
        to: { name: 'Systems', query: { ...query.value, status: 'loading' } },
        text: 'Loading'
      },
      {
        to: { name: 'Systems', query: { ...query.value, status: 'running' } },
        text: 'Running'
      },
      {
        to: { name: 'Systems', query: { ...query.value, status: 'working' } },
        text: 'Waiting'
      },
      {
        to: { name: 'Systems', query: { ...query.value, status: 'stopped' } },
        text: 'Stopped'
      }
    ])

    // syncs $route query params with active feathers query
    watch(
      () => context.root.$route,
      (newVal) => {
        const status = newVal.query.status
        query.value = status ? { status } : {}
      }
    ) // destructuring looses reactivity

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
        text: 'Host',
        align: 'center',
        sortable: true,
        value: 'host'
      },
      {
        text: 'Status',
        align: 'center',
        sortable: true,
        value: 'status'
      },
      {
        text: 'SD',
        align: 'center',
        sortable: false,
        value: 'sd'
      },
      {
        text: 'SeqD',
        align: 'center',
        sortable: false,
        value: 'seqD'
      },
      {
        text: 'Code',
        align: 'center',
        sortable: false,
        value: 'code'
      },
      {
        text: 'Actions',
        align: 'right',
        sortable: false,
        value: 'actions'
      }
    ])

    const editedItem = ref({ name: '', status: 'idle', sd: '' })

    const statusesEnum = ref(
      Object.freeze({
        idle: { color: 'idle' },
        loading: { color: 'loading' },
        running: { color: 'running' },
        working: { color: 'working' },
        stopped: { color: 'stopped' },
        failed: { color: 'failed' }
      })
    )

    function handleSystemClick(item) {
      $router.push({ name: 'System', params: { id: item._id } })
      // alternatively disallow entering view without running system:
      // if (item.status === 'running') {
      //   $router.push({ name: 'System', params: { id: item._id } })
      // } else {
      //   $store.commit('SET', {
      //     prop: 'notification',
      //     value: {
      //       model: true,
      //       color: 'warning',
      //       text: `System not running`
      //     }
      //   })
      // }
    }

    // files:

    const { loadTextFileInputIntoRefVariable } = useUtils()

    return {
      systems,
      isPendingSystems,
      haveLoaded,
      systemsTotal,
      // utilities:
      tableOptions,
      tableFooterProps,
      filterItemByProps,
      filteredItems,
      // deployment:
      start,
      restart,
      stop,
      // metrics:
      totalSystemsMetric,
      idleSystemsMetric,
      loadingSystemsMetric,
      runningSystemsMetric,
      stoppedSystemsMetric,
      failedSystemsMetric,
      // local:
      edit,
      save,
      clone,
      remove,
      tabs,
      dialog,
      headers,
      editedItem,
      statusesEnum,
      handleSystemClick,
      // files:
      loadTextFileInputIntoRefVariable
    }
  }
}
</script>
