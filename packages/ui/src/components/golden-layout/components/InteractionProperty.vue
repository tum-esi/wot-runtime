<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="interaction-property-container">
    <v-card v-if="propertyValue" flat class="fill-height" color="transparent">
      <!-- <v-card-title>{{ interactionName }}</v-card-title> -->
      <v-card-text :key="interactionName" class="fill-height">
        <v-row v-if="!propertyValue" align="center" justify="center">
          <v-progress-circular
            :size="50"
            color="primary"
            indeterminate
            class="mb-5"
          />
        </v-row>
        <template v-else>
          <!-- BY INTERACTION NAME -->
          <system-seqd
            v-if="
              interactionName === 'seqD' && typeof propertyValue === 'string'
            "
            :content="propertyValue"
          ></system-seqd>

          <system-metrics
            v-else-if="
              ['memoryUsage', 'resourceUsage'].includes(interactionName)
            "
            :name="interactionName"
            :content="propertyValue"
          ></system-metrics>

          <!-- <system-logs
            v-else-if="interactionName === 'logs'"
            :logs="propertyValue"
            v-bind="$props"
            class="scrollable-y"
          ></system-logs> -->

          <v-simple-table
            v-else-if="interactionName === 'logs'"
            :items="propertyValue"
            class="scrollable-y"
          >
            <template #default>
              <thead>
                <tr>
                  <th
                    v-for="key in Object.keys(propertyValue[0])"
                    :key="key"
                    class="text-left"
                  >
                    {{ key }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in propertyValue" :key="`table-row-${i}`">
                  <td
                    v-for="(value, j) in Object.values(item)"
                    :key="`table-cell-${j}`"
                  >
                    {{ value }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>

          <div
            v-else-if="['statusSvg', 'statechartSvg'].includes(interactionName)"
            class="svg-container"
            v-html="propertyValue"
          ></div>

          <pre
            v-else-if="
              ['codeTS', 'baseTS', 'code', 'base'].includes(interactionName)
            "
            class="language-js enable-scroll"
          >
            <code> {{formatJson(propertyValue)}}</code>
          </pre>

          <!-- BY INTERACTION DATA TYPE -->

          <pre
            v-else-if="typeof formatJson(propertyValue) === 'object'"
            class="language-js enable-scroll"
          >
            <code>{{ formatJson(propertyValue) }}</code>
          </pre>

          <pre
            v-else-if="typeof formatJson(propertyValue) === 'string'"
            class="language-js enable-scroll"
          >
            <code>{{ formatJson(propertyValue) }}</code>
          </pre>

          <pre
            v-else-if="Array.isArray(formatJson(propertyValue))"
            class="language-js enable-scroll"
          >
            <code>{{ formatJson(propertyValue) }}</code>
          </pre>

          <pre v-else class="enable-scroll"> {{ propertyValue }} </pre>
        </template>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { useIntervalFn } from '@vueuse/core'

/**
 * IMPORTANT: dynamically mounted components (this will be inside golden-layout)
 * cannot declare stuff inside of setup(), as setup() runs before component mounts.
 * Doing so throws errors despite utilizing v-if in the template to work for when
 * this 'stuff' (refs/functions) become defined (they somehow never do). The current
 * workaround is declaring everything with the traditional options API (data, methods,
 * mounted, etc) instead of using the newer composition API
 */

export default {
  name: 'InteractionProperty',
  components: {
    SystemSeqd: () =>
      import('@/components/golden-layout/components/SystemSeqd.vue'),
    SystemMetrics: () =>
      import('@/components/golden-layout/components/SystemMetrics.vue')
    // SystemLogs: () =>
    //   import('@/components/golden-layout/components/SystemLogs.vue')
    // Apexchart: () => import('@/components/Apexchart.vue')
  },
  props: {
    thing: { type: Object, required: true },
    interactionName: { type: String, required: true },
    interaction: { type: Object, required: true }
  },
  // setup() { IMPORTANT: cannot use setup()! },
  data() {
    return { propertyValue: null, interval: null }
  },
  // IMPORTANT: props are not defined till nextTick() (mounted means el mounted, not that all props exist)
  mounted() {
    // wait for props to be defined
    this.$nextTick(async () => {
      if (this.thing) this.initProperty()
    })
  },
  destroyed() {
    this.interval.pause()
    console.log('Destroyed')
  },
  methods: {
    async initProperty() {
      // wait for props to be defined
      const data = await this.thing.readProperty(this.interactionName)
      console.log(`${this.interactionName} =`, data)
      this.propertyValue = data

      if (this.interaction.observable) {
        // TODO: longpoll throwing error on client observe (recurring to
        // setInterval with manual fetch)
        // see https://github.com/eclipse/thingweb.node-wot/issues/323
        // and https://github.com/eclipse/thingweb.node-wot/issues/256
        //   this.thing.observeProperty(this.interactionName, (value) => {
        //     console.log(value)
        //     this.propertyValue = value
        //   })
        this.interval = useIntervalFn(async () => {
          const data = await this.thing.readProperty(this.interactionName)
          // console.log(data)
          this.propertyValue = data
        }, 1000)
      }
    },
    formatJson(content) {
      try {
        return JSON.parse(content, null, 2)
      } catch {
        return typeof content === 'string' ? content.trim() : content
      }
    }
  }
}
</script>

<style scoped>
.interaction-property-container {
  height: 100%;
}

.enable-scroll {
  position: absolute;
  top: 0px;
  bottom: 0;
  left: 0;
  right: 0;
}

.svg-container {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}
</style>
