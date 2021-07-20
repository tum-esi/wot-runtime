<template>
  <div class="things-drawer-left-wrapper">
    <v-toolbar flat dense color="transparent">
      <div class="search-field-container">
        <v-text-field
          v-model="search"
          flat
          label="Filter by keyword..."
          single-line
          hide-details="auto"
          outlined
          dense
          hide
          clearable
          class="pl-2 pr-2 drop"
        ></v-text-field>
      </div>

      <!-- DROPDOWN BUTTON -->
      <v-menu close-on-click offset-y left>
        <template #activator="{ on }">
          <v-btn
            color="primary"
            depressed
            outlined
            class="application-drawer-button-dropdown pl-2"
            medium
            v-on="on"
          >
            <v-icon>add</v-icon>
            <v-icon>arrow_drop_down</v-icon>
          </v-btn>
        </template>

        <v-list class="app-toolbar-dropdown-list">
          <v-list-item
            v-for="(item, index) in addButtonItems"
            :key="`dropdown-item-${index}`"
            dense
            @click="createObject(item)"
          >
            <v-list-item-content>{{ item.type }}</v-list-item-content>
            <v-list-item-icon class="pl-3">
              <v-icon>keyboard_arrow_right</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>

    <v-card class="things-drawer-left-container top" flat>
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
    <!-- <v-row class="things-drawer-left-container bottom pa-4">
      <v-btn color="secondary" outlined block class="mt-2" medium>{{
        td ? "Update" : "Add"
      }}</v-btn>
    </v-row>-->
  </div>
</template>

<script>
import { computed, ref } from '@vue/composition-api'
import { useWot } from '@/use/wot.js'
// 'vuedraggable' component handles re-sorting of list via drag&drop while
// import draggable from "vuedraggable";
// 'vue-drag-drop' directive handles dropping elements and passing data

export default {
  name: 'ThingsDrawerLeft',
  // components: { draggable },
  props: {
    td: {
      type: [Object, Array],
      required: true
    }
  },
  setup(props, context) {
    const { $router, $route } = context.root

    console.debug('ThingsDrawerLeft', props.td)

    const search = ref('')

    const items = computed(() => buildThingTree(props.td))

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

    function buildThingTree(td) {
      let tree = []
      if (td.properties)
        tree.push({
          id: 'properties',
          name: 'Properties',
          children: [
            ...Object.entries(td.properties).map(([name, property]) => {
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

      if (td.actions)
        tree.push({
          id: 'actions',
          name: 'Actions',
          children: [
            ...Object.entries(td.actions).map(([name, action]) => {
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

      if (td.events)
        tree.push({
          id: 'events',
          name: 'Events',
          children: [
            ...Object.entries(td.events).map(([name, event]) => {
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

      if (td.links)
        tree.push({
          id: 'links',
          name: 'Links',
          children: [
            ...Object.entries(td.links).map(([name, link]) => {
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
      $router.push(
        item.interactionType
          ? `/things/${$route.params.id}/${item.interactionType}/${item.name}`
          : `/things/${$route.params.id}/${item.name.toLowerCase()}`
      )
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
.things-drawer-left-wrapper {
  width: 100%;
  padding: 0px 4px;
  overflow: hidden;
}

.things-drawer-left-wrapper .v-toolbar__content {
  padding: 0px;
}

.things-drawer-left-container {
  width: 100%;
}
</style>
