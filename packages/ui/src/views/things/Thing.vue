<template>
  <div class="view things scrollable-y">
    <v-toolbar flat dense color="transparent">
      <v-toolbar-title>
        <span class="breadcrumb-link" @click="$router.push({ name: 'Hosts' })">
          Hosts
        </span>
        <v-icon class="pl-2 pr-2">keyboard_arrow_right</v-icon>
        <span class="breadcrumb-link" @click="$router.push({ name: 'Things' })"
          >Things</span
        >
        <v-icon class="pl-2 pr-2">keyboard_arrow_right</v-icon>
        {{ thing.name }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <app-dialog-preview
        :name="`TD: ${thing.name}`"
        icon="description"
        :content="thing.td"
      ></app-dialog-preview>
      <!-- <v-btn icon @click="horizontal = !horizontal">
        <v-icon>{{ horizontal ? "view_column" : "view_quilt"}}</v-icon>
      </v-btn>-->

      <v-btn icon @click="$vuetify.theme.dark = !$vuetify.theme.dark">
        <v-icon>{{ $vuetify.theme.dark ? 'nights_stay' : 'wb_sunny' }}</v-icon>
      </v-btn>
    </v-toolbar>

    <thing-component :thing="thing"></thing-component>
  </div>
</template>

<script>
import { ref, computed } from '@vue/composition-api'
import { useGet } from 'feathers-vuex'
import { useUtils } from '@/use/utils.js'

export default {
  name: 'Things',
  components: {
    // ThingComponent: () =>
    //   import("@/components/interactions/ThingComponent.vue"),
    AppDialogPreview: () => import('@/components/AppDialogPreview.vue')
  },
  props: {
    id: { type: String, required: true } // passed from vue-router
  },
  setup(props, context) {
    const { $FeathersVuex } = context.root
    const { Thing } = $FeathersVuex.api

    const id = computed(() => props.id) // uses vue-router props: true (otherwise $route not reactive)
    const query = computed(() => ({}))
    const params = computed(() => ({ query: query.value }))

    const notInStore = computed(() => !Thing.getFromStore(props.id))

    const { item: thing, isPending: isPendingThing } = useGet({
      model: Thing,
      id: id,
      params: params,
      queryWhen: notInStore // prevents unnecessary fetching
    }) // option values must be refs (or computed, since they return ref instances)

    const horizontal = ref(true)

    const { loadJsonFileInputIntoRefVariable } = useUtils()

    console.debug(thing.value)

    return {
      thing,
      isPendingThing,
      horizontal,
      loadJsonFileInputIntoRefVariable
    }
  }
}
</script>
