<template>
  <div class="view">
    <v-toolbar flat dense color="transparent">
      <v-toolbar-title> Hosts </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="$vuetify.theme.dark = !$vuetify.theme.dark">
        <v-icon>{{ $vuetify.theme.dark ? 'nights_stay' : 'wb_sunny' }}</v-icon>
      </v-btn>
    </v-toolbar>

    <v-row class="pl-3 pr-3">
      <v-col>
        <v-data-table
          :headers="headers"
          mobile-breakpoint="960"
          :items="items"
          dense
          item-key="name"
          multi-sort
          show-select
          :single-select="true"
          :options.sync="tableOptions"
          :footer-props="tableFooterProps"
          :server-items-length="itemsTotal"
          @current-items="(items) => (filteredItems = items)"
          @click:row="(item) => handleHostClick(item)"
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
                @click="items.forEach((item) => restart(item))"
                >Restart All</v-btn
              >
              <v-btn
                color="error"
                small
                outlined
                @click="items.forEach((item) => stop(item))"
                >Stop All</v-btn
              >
            </v-toolbar>
          </template>

          <template #item.data-table-select="{ item }">
            <div style="display: flex">
              <v-btn icon small @click.stop="edit(item)">
                <v-icon small>edit</v-icon>
              </v-btn>
              <v-btn icon small @click.stop="remove(item)">
                <v-icon small>delete</v-icon>
              </v-btn>
            </div>
          </template>

          <template #item.name="{ item }">
            <strong>{{ item.name }}</strong>
          </template>

          <template #item.host="{ item }">
            <a :href="item.host" @click.stop>{{ item.host }}</a>
          </template>

          <template #item.protocols="{ item }">
            <v-chip
              v-for="(p, i) in Object.keys(item.config).filter(
                (k) => !['host', 'credentials', 'log'].includes(k)
              )"
              :key="`protocol-${i}`"
              small
              class="mr-1"
              outlined
            >
              {{ p }}
            </v-chip>
          </template>

          <template #item.credentials="{ item }">
            <v-chip small class="mr-1" outlined>
              {{ Object.keys(item.config.credentials).length }}
            </v-chip>
          </template>

          <template #item.status="{ item }">
            <v-chip small outlined :color="statusesEnum[item.status].color">
              {{ item.status }}
            </v-chip>
          </template>

          <template #item.config="{ item }">
            <app-dialog-preview
              :name="`Host Config: ${item.name}`"
              icon="description"
              :content="item.config"
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
              <v-form ref="form" v-model="valid">
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    v-model="editedItem.name"
                    label="Name"
                    outlined
                    dense
                    hide-details="auto"
                    :rules="[rules.required, rules.uniqueName]"
                    :autofocus="true"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    v-model="editedItem.host"
                    label="Host"
                    outlined
                    dense
                    hide-details="auto"
                    :rules="[rules.required, rules.url, rules.uniqueHost]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <label class="mr-5">
                    Use <strong>Default Configurations</strong> or upload JSON
                    file
                  </label>
                  <input
                    id="config-input"
                    class="v-file-input"
                    type="file"
                    accept="application/json"
                    outlined
                    dense
                    hide-details="auto"
                    :rules="[rules.required, rules.unique]"
                    @input="
                      (e) =>
                        loadJsonFileInputIntoRefVariable(
                          e,
                          editedItem,
                          'config',
                          'config-input'
                        )
                    "
                  />
                </v-col>
              </v-form>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false">Cancel</v-btn>
          <v-btn
            color="primary"
            depressed
            :disabled="!valid"
            @click="save(editedItem)"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api'

import { useHosts } from '@/use/hosts.js'
import { useAPI } from '@/use/api.js'
import { useUtils } from '@/use/utils.js'

export default {
  name: '',
  components: {
    // AppCardMetricValue: () =>
    //   import("@/components/cards/AppCardMetricValue.vue")
    AppDialogPreview: () => import('@/components/AppDialogPreview.vue')
  },
  setup(props, context) {
    const { $store, $api, $router } = context.root

    const query = ref({})

    const {
      items,
      itemsTotal,
      // CRUD:
      createItem,
      updateItem,
      removeItem,
      // deployment:
      start,
      restart,
      stop,
      // utilities:
      editedItem
    } = useHosts($api, query)

    const {
      // items,
      // utilities:
      // search,
      tableOptions,
      tableFooterProps,
      filterItemByProps,
      filteredItems,
      dialog
    } = useAPI('Servient', query) // "Host" does not exist

    // local:

    function edit(item) {
      editedItem.value = { ...item }
      dialog.value = true
    }

    async function save(item) {
      if (item._id) await updateItem(item)
      else await createItem(item)
      dialog.value = false
    }

    async function remove(item) {
      await removeItem(item)
    }

    const tabs = ref([{ to: { name: '' }, text: 'All' }])

    const headers = ref([
      {
        text: 'Name',
        align: 'left',
        sortable: true,
        value: 'name'
      },
      {
        text: 'WoT Runtime Host',
        align: 'center',
        sortable: true,
        value: 'host'
      },
      {
        text: 'Protocols',
        align: 'center',
        sortable: false,
        value: 'protocols'
      },
      {
        text: 'Total Credentials',
        align: 'center',
        sortable: false,
        value: 'credentials'
      },
      {
        text: 'Status',
        align: 'center',
        sortable: false,
        value: 'status'
      },
      {
        text: 'WoT Servient Config',
        align: 'center',
        sortable: false,
        value: 'config'
      },
      {
        text: 'Actions',
        align: 'right',
        sortable: false,
        value: 'actions'
      }
    ])

    const rules = ref({
      required: (value) => !!value || 'Name is required',
      uniqueName: (value) =>
        !items.value ||
        !items.value.find((i) => i.name === value && i._id !== value._id) ||
        'Name must be unique',
      uniqueHost: (value) =>
        !items.value.find((i) => i.host === value && i._id !== value._id) ||
        'Host must be unique',
      counter: (value) => value.length <= 20 || 'Max 20 characters',
      url: (value) => {
        const pattern = /(?:^|\s)((https?:\/\/)?(?:localhost|[\w-]+(?:\.[\w-]+)+)(:\d+)?(\/\S*)?)/
        return (
          pattern.test(value) ||
          'Invalid URL (e.g. http://localhost:3030, google.com)'
        )
      },
      email: (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail'
      }
    })

    const valid = ref(false)

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

    const protocolsEnum = ref(
      Object.freeze({
        http: { color: 'black' },
        coap: { color: 'grey' },
        mqtt: { color: 'pink' }
      })
    )

    function handleHostClick(item) {
      if (item.status === 'running') {
        $router.push({ name: 'Host', params: { hostId: item._id } })
      } else {
        $store.commit('SET', {
          prop: 'notification',
          value: {
            model: true,
            color: 'warning',
            text: `Servient not running`
          }
        })
      }
    }

    // files:

    const { loadJsonFileInputIntoRefVariable } = useUtils()

    return {
      // useAPI:
      items,
      itemsTotal,
      createItem,
      updateItem,
      removeItem,
      start,
      restart,
      stop,
      edit,
      save,
      remove,
      editedItem,
      // utilities:
      tableOptions,
      tableFooterProps,
      filterItemByProps,
      filteredItems,
      // local:
      tabs,
      dialog,
      headers,
      rules,
      valid,
      statusesEnum,
      protocolsEnum,
      handleHostClick,
      // files:
      loadJsonFileInputIntoRefVariable
    }
  }
}
</script>

<style>
.v-input__slot {
  padding-right: 0px !important;
}

.v-input__append-inner {
  margin: 0px !important;
}
.input-btn {
  /* height: 100% !important; */
  margin: 0px !important;
  border-top-left-radius: 0px !important;
  border-bottom-left-radius: 0px !important;
}
</style>
