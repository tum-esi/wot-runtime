<template>
  <div class="system-drawer-left-wrapper">
    <v-card class="system-drawer-left-container top" flat>
      <v-treeview
        open-all
        :items="items"
        item-key="name"
        open-on-click
        dense
        hoverable
        activatable
      >
        <template #label="{ item, open }">
          <div @click="handleTreeviewClick(item)">
            <v-icon v-if="item.children" small>{{
              open ? 'folder_open' : 'folder'
            }}</v-icon>
            <v-icon v-else small>{{ getIconDatatype(item) }}</v-icon>
            {{ item.name }}
          </div>
        </template>
        <!-- <template #append="{ item, active }">
          <v-btn icon>
            <v-icon v-show="active" small>delete</v-icon>
          </v-btn>
        </template>-->
      </v-treeview>
    </v-card>

    <!-- Bottom -->
    <!-- <v-row class="system-drawer-left-container bottom pa-4">
      <v-btn color="secondary" outlined block class="mt-2">{{
        sd ? "Update" : "Add"
      }}</v-btn>
    </v-row>-->
  </div>
</template>

<script>
import { computed, ref } from '@vue/composition-api'
import { useWot } from '@/use/wot.js'

export default {
  name: 'SrdTreeview',
  props: {
    sd: {
      type: [Object, Array],
      required: true
    }
  },
  setup(props) {
    console.debug('ThingsDrawerLeft', props.sd)
    const search = ref('')
    const items = computed(() => buildThingTree(props.sd))
    // const filteredItems = computed(() => {
    //   return items.value ? filterItemsByProps(items.value) : null;
    // });
    // function filterItemsByProps(items) {
    //   // v-data-table custom-filter prop expects no params to be passed
    //   let lowercaseSearch = search.value.toString().toLowerCase();
    //   const interactionAffordances = [
    //     ...Object.entries(items.properties),
    //     ...Object.entries(items.actions),
    //     ...Object.entries(items.events)
    //   ];
    //   return interactionAffordances.filter(entry => {
    //     return entry[0]["name"].toLowerCase().match(lowercaseSearch);
    //   });
    // }
    function buildThingTree(sd) {
      let tree = []
      if (sd.properties)
        tree.push({
          id: 'properties',
          name: 'Properties',
          children: [
            ...Object.entries(sd.properties).map(([name, property]) => {
              // console.debug(name, property);
              return {
                id: name,
                name: name,
                interactionType: 'properties',
                ...property
              }
            })
          ]
        })
      if (sd.actions)
        tree.push({
          id: 'actions',
          name: 'Actions',
          children: [
            ...Object.entries(sd.actions).map(([name, action]) => {
              // console.debug(name, action);
              return {
                id: name,
                name: name,
                interactionType: 'actions',
                ...action
              }
            })
          ]
        })
      if (sd.events)
        tree.push({
          id: 'events',
          name: 'Events',
          children: [
            ...Object.entries(sd.events).map(([name, event]) => {
              // console.debug(name, event);
              return {
                id: name,
                name: name,
                interactionType: 'events',
                ...event
              }
            })
          ]
        })
      if (sd.links)
        tree.push({
          id: 'links',
          name: 'Links',
          children: [
            ...Object.entries(sd.links).map(([name, link]) => {
              // console.debug(name, link);
              return {
                id: name,
                name: name,
                interactionType: 'links',
                ...link
              }
            })
          ]
        })
      return tree
    }
    const addButtonItems = ref([
      { type: 'Form' },
      { type: 'Property' },
      { type: 'Action' },
      { type: 'Event' },
      { type: 'Link' },
      { type: 'Datasource' } // For external decoupled integrations
    ])

    function handleTreeviewClick(item) {
      console.log(item)
      //   $router.push(
      //     item.interactionType
      //       ? `/systems/${$route.params.id}/${item.interactionType}/${item.name}`
      //       : `/systems/${$route.params.id}/${item.name.toLowerCase()}`
      //   );
    }

    const { getIconDatatype } = useWot()

    return {
      search,
      items,
      addButtonItems,
      handleTreeviewClick,
      getIconDatatype
    }
  }
}
</script>

<style>
.system-drawer-left-wrapper {
  width: 100%;
  padding: 0px 4px;
  overflow: hidden;
}
.system-drawer-left-wrapper .v-toolbar__content {
  padding: 0px;
}
.system-drawer-left-container {
  width: 100%;
}
</style>
