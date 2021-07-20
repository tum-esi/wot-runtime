<template>
  <!-- eslint-disable prettier/prettier -->
  <v-list-item class="interaction-action-container">
    <v-row align="center" justify="end">
      <!-- ACTION NAME -->
      <v-col>
        <router-link
          :to="`/systems/${$route.params.id}/actions/${interactionName}`"
          >{{ interactionName }}</router-link
        >
      </v-col>

      {{ interactionName }}

      <!-- ACTION OUTPUT -->
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

      <!-- ACTION INPUT (CAN BE MULTIPLE PROPERTIES) -->
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
        </template>
      </v-col> -->

      <!-- ACTION INVOKE BUTTON -->
      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-btn
            outlined
            text
            x-small
            v-on="on"
            @click="thing.invokeAction(interactionName, {}, {})"
            >Invoke</v-btn
          >
        </template>
        <span>Invoke action</span>
      </v-tooltip>
    </v-row>
  </v-list-item>
</template>

<script>
/**
 * IMPORTANT: dynamically mounted components (this will be inside golden-layout)
 * cannot declare stuff inside of setup(), as setup() runs before component mounts.
 * Doing so throws errors despite utilizing v-if in the template to work for when
 * this 'stuff' (refs/functions) become defined (they somehow never do). The current
 * workaround is declaring everything with the traditional options API (data, methods,
 * mounted, etc) instead of using the newer composition API
 */
// import { computed } from '@vue/composition-api'

export default {
  name: 'InteractionAction',
  components: {},
  props: {
    thing: { type: Object, required: true },
    interactionName: { type: String, required: true },
    interaction: { type: Object, required: true }
  },
  // setup(props) {
  //   const inputs = computed(() => {
  //     let inputs = []
  //     if (!props.interaction.input) inputs = []
  //     else {
  //       if (!props.interaction.input.properties)
  //         inputs = [{ type: props.interaction.input.type, value: null }]
  //       else {
  //         const entries = Object.entries(props.interaction.input.properties)
  //         let inputs = entries.map((entry) => {
  //           const type = entry[1].type
  //           return { name: entry[0], type, value: null }
  //         })
  //         // let input = props.interaction.required.includes(entry[0])
  //         //   ? { required: true }
  //         //   : {};
  //         console.log(inputs)
  //         return inputs
  //       }
  //     }
  //     return inputs
  //   })

  //   const outputs = computed(() => {
  //     if (!props.interaction.output) return []

  //     let outputs = []
  //     if (!props.interaction.output.properties)
  //       outputs = [{ type: props.interaction.output.type, value: null }]
  //     else {
  //       const entries = Object.entries(props.interaction.output.properties)
  //       let outputs = entries.map((entry) => {
  //         return { name: entry[0], type: entry[1].type, value: null }
  //       })
  //       // let output = props.interaction.required.includes(entry[0])
  //       //   ? { required: true }
  //       //   : {};
  //       console.log(outputs)
  //     }
  //     return outputs
  //   })

  //   return { inputs, outputs }
  // },
  // IMPORTANT: props are not defined till nextTick() (mounted means el mounted, not that all props exist)
  async mounted() {
    this.$nextTick(() => {})
  }
}
</script>

<style scoped>
.interaction-action-container {
  height: 100%;
}
</style>
