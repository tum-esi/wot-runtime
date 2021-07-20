<template>
  <div class="fill-height">
    <!-- THING METADATA PANE -->
    <app-card id="metadata">
      <!-- THING METADATA  -->
      <v-row class="ma-0">
        <v-col>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title class="title">{{
                thing.name
              }}</v-list-item-title>
              <v-list-item-subtitle>{{ thing._id }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
    </app-card>

    <!-- THING PROPERTIES PANE -->
    <app-card-expansion
      v-if="td.properties && Object.keys(td.properties).length"
      id="properties"
    >
      <template #header>
        <a @click.stop="$router.push(`${$route.path}/properties`)"
          >Properties</a
        >
      </template>
      <template #content>
        <v-card flat width="100%">
          <v-list>
            <interaction-property-list-item
              v-for="(property, propertyName, i) in td.properties"
              :key="`interaction-property-${propertyName}-${i}`"
              :thing="thing"
              :interaction-name="propertyName"
              :interaction="property"
            ></interaction-property-list-item>
          </v-list>
        </v-card>
      </template>
    </app-card-expansion>

    <!-- THING ACTIONS PANE -->
    <app-card-expansion
      v-if="td.actions && Object.keys(td.actions).length"
      id="actions"
    >
      <template #header>
        <a @click.stop="$router.push(`${$route.path}/actions`)">Actions</a>
      </template>
      <template #content>
        <v-card flat width="100%">
          <v-list>
            <interaction-action-list-item
              v-for="(action, actionName, i) in td.actions"
              :key="`interaction-action-${actionName}-${i}`"
              :thing="thing"
              :interaction-name="actionName"
              :interaction="action"
            ></interaction-action-list-item>
          </v-list>
        </v-card>
      </template>
    </app-card-expansion>

    <!-- THING EVENTS PANE -->
    <app-card-expansion
      v-if="td.events && Object.keys(td.events).length"
      id="events"
    >
      <template #header>
        <a @click.stop="$router.push(`${$route.path}/events`)">Events</a>
      </template>
      <template #content>
        <v-card flat width="100%">
          <v-list>
            <!-- FIXME: for loop not needed if timeline used -->
            <interaction-event-list-item
              v-for="(event, eventName, i) in td.events"
              :key="`interaction-event-${eventName}-${i}`"
              :thing="thing"
              :interaction-name="eventName"
              :interaction="event"
            ></interaction-event-list-item>
          </v-list>
        </v-card>
      </template>
    </app-card-expansion>

    <!-- THING LINKS PANE -->
    <app-card-expansion
      v-if="td.links && Object.keys(td.links).length"
      id="links"
    >
      <template #header>
        <a @click.stop="$router.push(`${$route.path}/links`)">Links</a>
      </template>
      <template #content>
        <v-card flat width="100%">
          <v-list>
            <interaction-link-list-item
              v-for="(link, linkName, i) in td.links"
              :key="`interaction-link-${linkName}-${i}`"
              :thing="thing"
              :interaction-name="linkName"
              :interaction="link"
            ></interaction-link-list-item>
          </v-list>
        </v-card>
      </template>
    </app-card-expansion>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api'

export default {
  name: 'ThingComponent',
  components: {
    AppCard: () => import('@/components/cards/AppCard'),
    AppCardExpansion: () => import('@/components/cards/AppCardExpansion'),
    InteractionPropertyListItem: () =>
      import(
        '@/components/golden-layout/drag-sources/InteractionPropertyListItem'
      ),
    InteractionActionListItem: () =>
      import(
        '@/components/golden-layout/drag-sources/InteractionActionListItem'
      ),
    InteractionEventListItem: () =>
      import(
        '@/components/golden-layout/drag-sources/InteractionEventListItem'
      ),
    InteractionLinkListItem: () =>
      import('@/components/golden-layout/drag-sources/InteractionLinkListItem')
  },
  props: {
    thing: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const td = ref(JSON.parse(props.thing.td))

    console.debug('TD:', td.value)

    return { td }
  }
}
</script>

<style scoped>
.thing-metadata-title {
  /* aligns label to the top if value overflows to multiple lines */
  margin-top: 12px;
  align-self: flex-start;
}
</style>
