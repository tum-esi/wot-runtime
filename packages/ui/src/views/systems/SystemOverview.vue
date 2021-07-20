<template>
  <div class="subview system-overview">
    <splitpanes :first-splitter="false" :horizontal="horizontal">
      <pane :size="20" class="scrollable-y">
        <v-expansion-panels
          :value="[0, 1, 2, 3]"
          class="system-overview-panels"
          accordion
          multiple
          focusable
          flat
        >
          <v-expansion-panel>
            <v-expansion-panel-header>
              <v-list-item-subtitle class="interaction-list-item" @click.stop>
                Properties
              </v-list-item-subtitle>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <interaction-property-list-item
                v-for="(property, propertyName, i) in srd.properties"
                :key="`srd-${propertyName}-${i}`"
                :thing="thing"
                :interaction-name="propertyName"
                :interaction="property"
              ></interaction-property-list-item>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel
            v-if="srd.actions && Object.keys(srd.actions).length"
          >
            <v-expansion-panel-header>
              <v-list-item-subtitle class="interaction-list-item" @click.stop>
                Actions
              </v-list-item-subtitle>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <interaction-action-list-item
                v-for="(action, actionName, i) in srd.actions"
                :key="`srd-${actionName}-${i}`"
                :thing="thing"
                :interaction-name="actionName"
                :interaction="action"
              ></interaction-action-list-item>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel
            v-if="srd.events && Object.keys(srd.events).length"
          >
            <v-expansion-panel-header>
              <v-list-item-subtitle class="interaction-list-item" @click.stop>
                Events
              </v-list-item-subtitle>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <interaction-event-list-item
                v-for="(event, eventName, i) in srd.events"
                :key="`srd-${eventName}-${i}`"
                :thing="thing"
                :interaction-name="eventName"
                :interaction="event"
              ></interaction-event-list-item>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!--  <v-expansion-panel v-if="srd.links && Object.keys(srd.links).length">
            <v-expansion-panel-header>
              <v-list-item-subtitle class="interaction-list-item" @click.stop>
                Links
              </v-list-item-subtitle>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <interaction-link-list-item
                v-for="(link, linkName, i) in srd.links"
                :key="`srd-${linkName}-${i}`"
                :thing="thing"
                :interaction-name="linkName"
                :interaction="link"
              ></interaction-link-list-item>
            </v-expansion-panel-content>
          </v-expansion-panel> -->

          <!-- <system-component :srd="srd" :thing="thing"></system-component> -->
        </v-expansion-panels>
      </pane>
      <pane>
        <golden-layout></golden-layout>
      </pane>
    </splitpanes>
  </div>
</template>

<script>
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
// import { useWot } from '@/use/wot.js'

// import * as tdSchema from "@/utils/tdSchema.json";

export default {
  name: 'SystemOverview',
  components: {
    Splitpanes,
    Pane,
    GoldenLayout: () => import('@/components//golden-layout/GoldenLayout.vue'),
    InteractionPropertyListItem: () =>
      import(
        '@/components/golden-layout/drag-sources/InteractionPropertyListItem.vue'
      ),
    InteractionActionListItem: () =>
      import(
        '@/components/golden-layout/drag-sources/InteractionActionListItem.vue'
      ),
    InteractionEventListItem: () =>
      import(
        '@/components/golden-layout/drag-sources/InteractionEventListItem.vue'
      )
    // InteractionLinkListItem: () =>
    //   import(
    //     '@/components/golden-layout/drag-sources/InteractionLinkListItem.vue'
    //   )
  },
  props: {
    hostId: { type: String, required: true }, // passed from vue-router
    id: { type: String, required: true }, // passed from vue-router
    system: { type: Object, required: true },
    srd: { type: Object, required: true },
    thing: { type: Object, required: true },
    horizontal: { type: Boolean }
  },
  setup() {
    return {}
  }
}
</script>

<style>
.small-text td {
  font-size: small !important;
}

.system-overview-panels .v-expansion-panel-header {
  padding: 0px 6px !important;
  min-height: auto !important;
  height: 32px;
}

.system-overview-panels .v-expansion-panel-content__wrap {
  padding: 0px;
}

.system-overview-panels .v-btn.v-size--x-small {
  padding: 0px 4px;
}

.interaction-list-item:hover,
.interaction-list-item:hover .v-list-item__title {
  cursor: pointer;
  font-weight: 700 !important;
}

.interaction-list-item,
.interaction-list-item .v-list-item__title {
  font-size: 16px !important;
}
</style>
