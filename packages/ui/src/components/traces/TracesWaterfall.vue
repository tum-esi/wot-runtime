<template>
  <div id="traces-waterfall-container">
    <v-toolbar dense flat>
      <div style="align-self: center" class="ml-2 mr-2">
        <v-btn-toggle v-model="compact" label="Compact" hide-details="auto">
          <v-btn x-small icon>
            <v-icon>compare_arrows</v-icon>
          </v-btn>
        </v-btn-toggle>
      </div>
      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-btn
              x-small
              icon
              v-bind="attrs"
              :disabled="zoomOutDisabled"
              class="ml-2 mr-1"
              v-on="on"
              @click="zoomOut()"
            >
              <v-icon>zoom_out</v-icon>
            </v-btn>
          </template>
          <span>Zoom out</span>
        </v-tooltip>
        <v-btn x-small text class="pa-0" small @click="autozoom = true"
          >Auto</v-btn
        >
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-btn
              x-small
              icon
              v-bind="attrs"
              :disabled="zoomInDisabled"
              class="ml-2 mr-2"
              v-on="on"
              @click="zoomIn()"
            >
              <v-icon>zoom_in</v-icon>
            </v-btn>
          </template>
          <span>Zoom in</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-btn
              x-small
              icon
              v-bind="attrs"
              class="ml-1 mr-2"
              v-on="on"
              @click="clear()"
            >
              <v-icon>block</v-icon>
            </v-btn>
          </template>
          <span>Clear traces</span>
        </v-tooltip>
      </v-toolbar-items>

      <template #extension>
        <span class="pr-5">{{ `${items.length} traces` }}</span>
        <v-spacer></v-spacer>
        <v-btn-toggle v-model="timeframe" dense>
          <v-btn x-small :value="10">10s</v-btn>
          <v-btn x-small :value="30">30s</v-btn>
          <v-btn x-small :value="60">1m</v-btn>
          <v-btn x-small :value="180">3m</v-btn>
          <v-btn x-small :value="900">15m</v-btn>
        </v-btn-toggle>
      </template>
    </v-toolbar>

    <div v-if="!isPending && items.length" id="traces-waterfall">
      <traces-waterfall-item
        v-for="(item, i) in items"
        :key="i"
        :index="i"
        :item="item"
        :previous-item="items[i - 1]"
        :compact="compact === 0"
        :zoom-factor="zoomFactor"
        :start="start"
        class="traces-waterfall-item"
      ></traces-waterfall-item>
    </div>

    <template v-else-if="!isPending && !items.length">
      <v-row style="height: calc(100% - 48px)" align="center" justify="center"
        >NO TRACES YET</v-row
      >
    </template>

    <template v-else>
      <v-row style="height: calc(100% - 48px)" align="center" justify="center">
        <v-progress-circular
          :size="75"
          :width="5"
          indeterminate
        ></v-progress-circular>
      </v-row>
    </template>
  </div>
</template>

<script>
import { ref, computed, watch, watchEffect } from '@vue/composition-api'
import { useFind } from 'feathers-vuex'

export default {
  name: 'TracesWaterfall',
  components: {
    TracesWaterfallItem: () =>
      import('@/components/traces/TracesWaterfallItem.vue')
  },
  setup(props, context) {
    const { $api, $FeathersVuex } = context.root
    const { Trace } = $FeathersVuex.api

    const compact = ref(localStorage.getItem('compact') || 0) // 0 means true (v-toggle-btn requires index of button when true)
    const zoomFactor = ref(1)
    const timeframe = ref(Number(localStorage.getItem('timeframe')) || 180) // 180 seconds = 3 min
    const autozoom = ref(true)
    const tail = ref(!!localStorage.getItem('tail') || false)

    const params = computed(() => {
      return {
        query: {
          $limit: 500,
          $sort: {
            ts: -1
          },
          ts: {
            $gt: Date.now() - timeframe.value * 1000 // timeframe from seconds to ms
          }
        },
        debounceTime: 1000
      }
    })

    watchEffect(() => console.log(timeframe.value))

    const { items, isPending } = useFind({
      model: Trace,
      params: params
    })

    const toggleTail = (val) => {
      if (val) autozoom.value = true
      tail.value = val
    }

    const start = ref(items.value.length ? items.value[0].ts : 0)

    function setZoomFactor() {
      const lastItem = items.value[items.value.length - 1]
      const pixels = lastItem.end - start.value
      const zoomFct = (window.innerWidth / pixels) * 0.75 // 0.75 is correction factor
      zoomFactor.value = zoomFct
    }

    // setZoomFactor();

    watchEffect(() => {
      if (!items.value.length) return
      if (!autozoom.value) return
      if (compact.value) {
        zoomFactor.value = 0.5
        return
      }
      // setZoomFactor();
    })

    // Filters
    function clear() {
      const ids = items.value.map((item) => item._id)
      console.log(ids)
      $api.service('traces').remove(items.value)
    }

    // zoom:

    watch(compact, () => (autozoom.value = true))

    const zoomOutDisabled = computed(() => zoomFactor.value < 0.1)
    const zoomInDisabled = computed(() => zoomFactor.value > 10)

    function zoomOut() {
      autozoom.value = false
      zoomFactor.value = zoomFactor.value * 0.75
    }

    function zoomIn() {
      autozoom.value = false
      zoomFactor.value = zoomFactor.value / 0.75
    }

    return {
      items,
      isPending,
      compact,
      zoomFactor,
      timeframe,
      autozoom,
      tail,
      toggleTail,
      start,
      clear,
      zoomOutDisabled,
      zoomOut,
      zoomInDisabled,
      zoomIn
    }
  }
}
</script>

<style lang="scss">
#traces-waterfall-container {
  height: 100%;
  width: 100%;
}

#traces-waterfall-container .v-toolbar__content {
  padding-right: 0px;
}

#traces-waterfall {
  height: calc(100% - 48px);
  width: 100%;
  border-bottom: none;
  overflow-x: scroll;
  overflow-y: scroll;
  box-sizing: border-box;
  flex-grow: 1;
  background-color: white;
}

.theme--dark #traces-waterfall {
  background-color: #272727;
}

.theme--dark #traces-waterfall * {
  color: #dddddd;
}

.traces-waterfall-item {
  display: inline-block;
  min-width: 100%;
  flex-grow: 1;
}
</style>
