<template>
  <vue-mermaid
    :nodes="data"
    :config="config"
    type="graph LR"
    @nodeClick="editNode"
  ></vue-mermaid>
</template>

<script>
import { ref } from '@vue/composition-api'

export default {
  name: 'SystemSeqdMermaid',
  setup() {
    const data = ref([
      {
        id: '1',
        text: 'A',
        link: '---',
        next: ['2'],
        editable: true,
        style: 'fill:#f9f,stroke:#333,stroke-width:4px'
      },
      { id: '2', text: 'B', edgeType: 'circle', next: ['3'] },
      { id: '3', text: 'C', next: ['4', '6'] },
      { id: '4', text: 'D', link: '-- This is the text ---', next: ['5'] },
      { id: '5', text: 'E' },
      { id: '6', text: 'F' }
    ])

    const config = ref({ theme: 'neutral' })

    function editNode(nodeId) {
      console.debug(nodeId)
    }

    return { data, config, editNode }
  }
}
</script>
