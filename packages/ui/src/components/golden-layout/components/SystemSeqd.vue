<template>
  <v-img v-if="url" :src="url" contain></v-img>
</template>

<script>
import { computed } from '@vue/composition-api'
import plantumlEncoder from 'plantuml-encoder'

export default {
  name: 'SystemSeqd',
  props: {
    content: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const encoded = computed(() =>
      props.content ? plantumlEncoder.encode(props.content) : ''
    ) // id of encoded image for ulr e.g. SrJGjLDmibBmICt9oGS0

    const url = computed(() =>
      encoded ? `http://www.plantuml.com/plantuml/img/${encoded.value}` : ''
    )

    return { url }
  }
}
</script>
