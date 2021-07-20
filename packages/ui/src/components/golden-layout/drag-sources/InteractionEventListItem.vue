<template>
  <v-list-item
    :id="`interaction-list-item-${interactionName}`"
    class="interaction-list-item drag-source-item"
    dense
  >
    <v-row align="center" justify="end">
      <!-- EVENT NAME -->
      <v-col>
        <v-list-item-title>
          {{ interactionName || interaction.title }}
        </v-list-item-title>
      </v-col>

      <!-- EVENT OUTPUT -->
      <!-- <v-col
        v-for="(output, i) in outputs"
        :key="`output-${output.name || output.type}-${i}`"
        class="justify-end pr-3"
        cols="2"
      >
        <v-text-field
          v-model="output.value"
          :label="output.name || output.type"
          hide-details="auto"
          outlined
          dense
        ></v-text-field>
      </v-col> -->

      <!-- EVENT INPUT (CAN BE MULTIPLE PROPERTIES) -->
      <!-- <v-col
        v-for="(input, i) in inputs"
        :key="`input-${input.name || input.type}-${i}`"
        class="justify-end pr-3"
        cols="2"
      >
        <template v-if="input.type === 'boolean'">
          <v-switch
            v-model="input.value"
            :label="input.name || input.type"
            class="ma-0 pa-0"
            hide-details="auto"
            dense
            inset
          ></v-switch>
        </template>

        <template v-else-if="input.type === 'enum'">
          <v-autocomplete
            hide-details="auto"
            :label="input.name || input.type"
          ></v-autocomplete>
        </template>

        <template
          v-else-if="
            input.type === 'integer' && input.type.min && input.type.max
          "
        >
          <v-slider
            v-model="input.value"
            :label="input.name || input.type"
            :min="input.type.min"
            :max="input.type.max"
            tick-labels
            hide-details="auto"
            ticks
          ></v-slider>
        </template>

        <template
          v-else-if="
            ['integer', 'number', 'string', 'object', 'array'].includes(
              input.type
            ) || !input
          "
          class="justify-end align-center"
        >
          <div width="80px" class="pr-3">
            <v-text-field
              v-model="input.value"
              :label="input.name || input.type"
              hide-details="auto"
              outlined
              dense
            ></v-text-field>
          </div>
        </template> -->
      <!-- input.type === 'null' does not render -->
      <!-- </v-col> -->

      <!-- EVENT INVOKE BUTTON -->
      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-switch
            v-model="input.value"
            true-value="Subscribed"
            false-value="Unubscribed"
            class="ma-0 pa-0"
            hide-details="auto"
            dense
            inset
            v-on="on"
          ></v-switch>
        </template>
        <span>
          {{ input.value ? 'Unsubscribe to event' : 'Subscribe to event' }}
        </span>
      </v-tooltip>
    </v-row>
  </v-list-item>
</template>

<script>
import { onMounted } from '@vue/composition-api'
import { useGoldenLayout } from '@/use/goldenLayout.js'

export default {
  name: 'InteractionEventListItem',
  components: {},
  props: {
    thing: { type: Object, required: true },
    interactionName: { type: String, required: true },
    interaction: { type: Object, required: true }
  },
  setup(props) {
    // golden-layout:

    const { registerDragSource } = useGoldenLayout('golden-layout-container')

    onMounted(async () => {
      setTimeout(() => {
        const el = document.getElementById(
          `interaction-list-item-${props.interactionName}`
        )
        const dragItemOrConfig = {
          type: 'component',
          title: props.interactionName,
          componentName: 'VueComponent',
          componentState: {
            name: 'InteractionEvent',
            propsData: {
              thing: props.thing,
              interactionType: 'event',
              interactionName: props.interactionName,
              interaction: props.interaction
            }
          }
        }
        registerDragSource(el, dragItemOrConfig)
      }, 0) // required to wait for vm.$goldenLayout to exist (TODO: replace with $nextTick?)    })
    })

    return {}
  }
}
</script>
