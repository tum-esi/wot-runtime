<template>
  <v-list-item
    :id="`interaction-list-item-${interactionName}`"
    class="interaction-list-item drag-source-item"
    dense
  >
    <v-list-item-title>
      <router-link :to="`/things/${$route.params.id}/links/${linkName}`">
        {{ linkName || link.title }}
      </router-link>
    </v-list-item-title>
    <v-list-item-subtitle
      :id="`${linkName}-value`"
      class="text-right black--text"
    >
      <!-- initialized to link value -->
      {{ link.value }}
    </v-list-item-subtitle>
  </v-list-item>
</template>

<script>
import { onMounted } from '@vue/composition-api'
import { useGoldenLayout } from '@/use/goldenLayout.js'

export default {
  name: 'InteractionLinkListItem',
  components: {},
  props: {
    thing: { type: Object, required: true },
    interactionName: { type: String, required: true },
    interaction: { type: Object, required: true }
  },
  setup(props) {
    // golden-layout:

    const { registerDragSource } = useGoldenLayout('golden-layout-container')

    onMounted(() => {
      setTimeout(() => {
        const el = document.getElementById(
          `interaction-list-item-${props.interactionName}`
        )
        const dragItemOrConfig = {
          type: 'component',
          title: props.interactionName,
          componentName: 'VueComponent',
          componentState: {
            name: 'InteractionLink',
            propsData: {
              thing: props.thing,
              interactionType: 'link',
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
