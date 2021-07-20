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
                system.name
              }}</v-list-item-title>
              <v-list-item-subtitle>{{ system._id }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
    </app-card>

    <!-- THING PROPERTIES PANE -->
    <app-card-expansion v-if="thing" id="properties">
      <template #header>
        <a @click.stop="$router.push(`${$route.path}/properties`)"
          >Properties</a
        >
      </template>
      <template #content>
        <v-card flat width="100%">
          <v-list>
            <interaction-property-list-item
              v-for="(property, propertyName, i) in srd.properties"
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
    <app-card-expansion v-if="thing" id="actions">
      <template #header>
        <a @click.stop="$router.push(`${$route.path}/actions`)">Actions</a>
      </template>
      <template #content>
        <v-card flat width="100%">
          <v-list>
            <interaction-action-list-item
              v-for="(action, actionName, i) in srd.actions"
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
    <app-card-expansion v-if="thing" id="events">
      <template #header>
        <a @click.stop="$router.push(`${$route.path}/events`)">Events</a>
      </template>
      <template #content>
        <v-card flat width="100%">
          <v-list>
            <!-- FIXME: for loop not needed if timeline used -->
            <interaction-event-list-item
              v-for="(event, eventName, i) in srd.events"
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
    <app-card-expansion v-if="thing" id="links">
      <template #header>
        <a @click.stop="$router.push(`${$route.path}/links`)">Links</a>
      </template>
      <template #content>
        <v-card flat width="100%">
          <v-list>
            <interaction-link-list-item
              v-for="(link, linkName, i) in srd.links"
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
export default {
  name: 'SrdComponent',
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
    },
    srd: {
      type: Object,
      required: true
    }
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
