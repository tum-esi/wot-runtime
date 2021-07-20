<template>
  <div v-if="system && srd" class="view systems">
    <v-toolbar flat dense color="transparent">
      <v-toolbar-title>
        <span class="breadcrumb-link" @click="$router.push({ name: 'Hosts' })">
          Hosts
        </span>
        <v-icon class="pl-2 pr-2">keyboard_arrow_right</v-icon>
        <span class="breadcrumb-link" @click="$router.push({ name: 'Systems' })"
          >Systems</span
        >
        <v-icon class="pl-2 pr-2">keyboard_arrow_right</v-icon>
        {{ system.name }}
      </v-toolbar-title>
      <v-spacer></v-spacer>

      {{ $store.state.app }}

      <!-- <div class="mr-3">
        <app-dialog-preview
          v-if="system.sd"
          :name="`SD: ${system.name}`"
          icon="description"
          :content="system.sd"
          class="mr-4"
        ></app-dialog-preview>
      </div> -->
      <div class="mr-1">
        <app-dialog-preview
          :name="`SRD: ${system.name}`"
          icon="description"
          :content="srd"
        ></app-dialog-preview>
      </div>
      <v-btn icon @click="horizontal = !horizontal">
        <v-icon>{{ horizontal ? 'view_column' : 'view_quilt' }}</v-icon>
      </v-btn>
      <v-btn icon @click="$vuetify.theme.dark = !$vuetify.theme.dark">
        <v-icon>{{ $vuetify.theme.dark ? 'nights_stay' : 'wb_sunny' }}</v-icon>
      </v-btn>
    </v-toolbar>

    <!-- <template v-if="system.status === 'stopped'">
      <div class="not-running-placeholder">
        <div class="mb-5">
          <v-row class="pa-2 mb-5" justify="center">
            <v-icon size="96">cancel</v-icon>
          </v-row>
          <v-row class="pa-2" justify="center">
            <span>
              System
              <strong>{{ system.name }}</strong>
              is not running. It is {{ system.status }}.
            </span>
          </v-row>
          <v-row class="pa-2 mb-5" justify="center">
            <v-btn
              depressed
              color="accent"
              @click="$router.push({ name: 'Systems' })"
              >Go back</v-btn
            >
          </v-row>
        </div>
      </div>
    </template> -->

    <template>
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
      </v-toolbar>

      <router-view
        v-if="srd && thing"
        :id="id"
        :host-id="hostId"
        :system="system"
        :srd="srd"
        :thing="thing"
        :horizontal="horizontal"
      ></router-view>
    </template>
  </div>
</template>

<script>
import { ref, computed, watchEffect } from '@vue/composition-api'
import { useGet } from 'feathers-vuex'
import { useUtils } from '@/use/utils.js'

// wot: @node-wot/browser-bundle imported via CDN
/* eslint-disable no-undef */
// import { Servient } from '@node-wot/core'
// import { HttpClientFactory } from '@node-wot/binding-http'
// import { WebSocketClientFactory } from '@node-wot/binding-websockets'

export default {
  name: 'System',
  components: {
    AppDialogPreview: () => import('@/components/AppDialogPreview.vue')
  },
  props: {
    hostId: { type: String, required: true }, // passed from vue-router
    id: { type: String, required: true } // passed from vue-router
  },
  setup(props, context) {
    const { $FeathersVuex } = context.root
    const { System } = $FeathersVuex.api

    const id = computed(() => props.id) // uses vue-router props: true (otherwise $route not reactive)
    const query = ref({ _hostId: props.hostId })
    const params = computed(() => ({ query: query.value }))

    const notInStore = computed(() => !System.getFromStore(props.id))

    const { item: system, isPending: isPendingSystem } = useGet({
      model: System,
      id: id,
      params: params,
      queryWhen: notInStore // prevents unnecessary fetching
    }) // option values must be refs (or computed, since they return ref instances)

    // ui:

    const horizontal = ref(false)

    const { loadJsonFileInputIntoRefVariable } = useUtils()

    // tabs:

    const tabs = ref([
      {
        to: { name: 'SystemOverview' },
        text: 'Overview',
        icon: 'multiline_chart'
      },
      { to: { name: 'SystemLogs' }, text: 'Logs', icon: 'bug_report' },
      { to: { name: 'SystemTraces' }, text: 'Traces', icon: 'track_changes' },
      { to: { name: 'SystemMetrics' }, text: 'Metrics', icon: 'bar_chart' }
    ])

    // wot:

    const srd = ref(null)
    const thing = ref(null)

    watchEffect(async () => {
      if (system.value && system.value.name) {
        const url = `http://localhost:8080/${system.value.name.toLowerCase()}`
        console.log(url)
        let response = await fetch(url, {})
        srd.value = await response.json()
        thing.value = await consumeDescription(srd.value)
        // console.log(thing.value)
        // Object.keys(srd.value.events).forEach((event) => {
        //   console.log(event)
        //   thing.value.subscribeEvent(event, (data) => {
        //     console.log('Data:' + data)
        //   })
        // })
      }
    })

    async function consumeDescription(td) {
      const servient = new Wot.Core.Servient() // create servient
      servient.addClientFactory(new Wot.Http.HttpClientFactory()) // add http binding
      servient.addClientFactory(new Wot.WebSocket.WebSocketClientFactory()) // add websocket binding
      console.debug(servient)
      const wot = await servient.start()
      console.debug(wot)
      const thing = await wot.consume(td)
      console.debug(thing)
      return thing
    }

    return {
      system,
      isPendingSystem,
      // runtime description:
      srd,
      // ui:
      horizontal,
      loadJsonFileInputIntoRefVariable,
      // tabs:
      tabs,
      // wot:
      thing
    }
  }
}
</script>

<style scoped>
.not-running-placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  padding-bottom: 100px;
}
</style>
