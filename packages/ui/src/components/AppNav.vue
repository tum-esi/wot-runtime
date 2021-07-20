<template>
  <v-tabs right color="white">
    <v-tab v-for="(route, i) in routes" :key="`v-tab-${i}`" :to="route.to">{{
      route.text
    }}</v-tab>
  </v-tabs>
</template>

<script>
export default {
  setup() {
    const routes = [
      { to: { name: 'Systems' }, text: 'Systems' },
      { to: { name: 'Things' }, text: 'Things' }
    ]

    return { routes }
  }
}
</script>
