<template>
  <!-- eslint-disable vue/no-v-html -->
  <v-list-item
    :id="`interaction-list-item-${interactionName}`"
    class="interaction-list-item drag-source-item"
    dense
  >
    <v-list-item-title>
      {{ interactionName || interaction.title }}
    </v-list-item-title>
    <v-list-item-subtitle
      :id="`${interactionName}-value`"
      class="text-right black--text"
    >
      <!-- initialized to property value -->
      <template v-if="thing && interactionName && propertyValue">
        <template
          v-if="interactionName === 'seqD' && typeof propertyValue === 'string'"
        >
          <app-dialog-preview
            :name="interactionName"
            icon="insert_photo"
            :content="propertyValue"
          >
            <system-seqd :content="propertyValue"></system-seqd>
          </app-dialog-preview>
        </template>
        <template v-else-if="interactionName === 'uptime'">
          <app-dialog-preview
            :name="interactionName"
            icon="data_usage"
            :content="propertyValue"
          >
            <system-metrics
              :name="interactionName"
              :content="propertyValue"
            ></system-metrics>
          </app-dialog-preview>
        </template>
        <template
          v-else-if="['statusSvg', 'statechartSvg'].includes(interactionName)"
        >
          <app-dialog-preview
            :name="interactionName"
            icon="insert_photo"
            :content="propertyValue"
          >
            <div align="center" v-html="propertyValue"></div>
          </app-dialog-preview>
        </template>
        <app-dialog-preview
          v-else-if="typeof propertyValue === 'string'"
          :name="interactionName"
          icon="text_fields"
          :content="propertyValue"
        ></app-dialog-preview>
        <app-dialog-preview
          v-else-if="typeof propertyValue === 'object'"
          :name="interactionName"
          icon="code"
          :content="propertyValue"
        ></app-dialog-preview>
        <app-dialog-preview
          v-else-if="Array.isArray(propertyValue)"
          :name="interactionName"
          icon="code"
          :content="propertyValue"
        ></app-dialog-preview>
        <!-- <app-dialog-preview
          v-else-if="typeof propertyValue === 'number'"
          :name="interactionName"
          icon="code"
          :content="propertyValue"
        ></app-dialog-preview>
        <app-dialog-preview
          v-else-if="typeof propertyValue === 'boolean'"
          :name="interactionName"
          icon="code"
          :content="propertyValue"
        ></app-dialog-preview> -->
        <app-dialog-preview
          v-else
          :name="interactionName"
          icon="home"
          :content="propertyValue"
        ></app-dialog-preview>
      </template>
    </v-list-item-subtitle>
  </v-list-item>
</template>

<script>
import { ref, onMounted } from '@vue/composition-api'
import { useGoldenLayout } from '@/use/goldenLayout.js'

export default {
  name: 'InteractionPropertyListItem',
  components: {
    SystemSeqd: () =>
      import('@/components/golden-layout/components/SystemSeqd.vue'),
    SystemMetrics: () =>
      import('@/components/golden-layout/components/SystemMetrics.vue'),
    AppDialogPreview: () => import('@/components/AppDialogPreview.vue')
  },
  props: {
    thing: { type: Object, required: true },
    interactionName: { type: String, required: true },
    interaction: { type: Object, required: true }
  },
  setup(props) {
    const propertyValue = ref(null)

    // golden-layout:

    const { registerDragSource } = useGoldenLayout('golden-layout-container')

    onMounted(async () => {
      // console.log(props.thing)
      const data = await props.thing.readProperty(props.interactionName)
      // console.log(data)
      propertyValue.value = data

      // wait for component to exist in DOM
      setTimeout(() => {
        const el = document.getElementById(
          `interaction-list-item-${props.interactionName}`
        )
        const dragItemOrConfig = {
          type: 'component',
          title: props.interactionName,
          componentName: 'VueComponent',
          componentState: {
            name: 'InteractionProperty',
            propsData: {
              thing: props.thing,
              interactionType: 'property',
              interactionName: props.interactionName,
              interaction: props.interaction
            }
          }
        }
        registerDragSource(el, dragItemOrConfig)
      }, 0) // required to wait for vm.$goldenLayout to exist (TODO: replace with $nextTick?)
    })

    return { propertyValue }
  }
}
</script>

<style></style>
