<template>
  <v-app>
    <v-app-bar app color="primary" dense :dark="!$vuetify.theme.dark">
      <v-app-bar-nav-icon @click="$router.push({ name: 'Hosts' })">
        <v-img src="@/assets/logo-wot.png" contain height="44"></v-img>
      </v-app-bar-nav-icon>
      <v-toolbar-title>WoT Runtime</v-toolbar-title>
      <v-spacer></v-spacer>
      <app-nav v-if="$route.path.includes('/hosts/')" />
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-snackbar
      v-if="notification"
      v-model="notification.model"
      :color="notification.color"
      :timeout="4000"
      text
      outlined
      dense
    >
      {{ notification.text }}
      <template #action="{ attrs }">
        <v-btn text small v-bind="attrs" @click="notification.model = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { computed, ref, watchEffect, watch } from '@vue/composition-api'
import { useLocalStorage } from '@vueuse/core'

export default {
  name: 'App',
  components: {
    AppNav: () => import('@/components/AppNav.vue')
  },
  setup(props, context) {
    const { $store, $vuetify } = context.root

    const host = ref('http://localhost:3030')

    const notification = computed(() => $store.state.notification)

    // TODO: Redirect to home page if there's a user, otherwise to login page.
    // watch(
    //   () => $store.state.auth.user,
    //   user => $router.replace({ name: user ? "Hosts" : "Login" }),
    //   { lazy: true }
    // );

    // TODO: Attempt jwt auth when the app mounts.
    // onMounted(() => {
    //   $store.dispatch("auth/authenticate").catch(error => {
    //     if (!error.message.includes("Could not find stored JWT")) {
    //       console.error(error);
    //     }
    //   });
    // });

    // dark-theme:

    const themeDark = useLocalStorage('theme-dark', $vuetify.theme.dark)
    $vuetify.theme.dark = themeDark.value // initialize once
    watchEffect(() => (themeDark.value = $vuetify.theme.dark))
    watch(
      () => themeDark.value,
      () => window.location.reload() // else some components (golden-layout) won't update theme
    )

    return { host, notification }
  }
}
</script>

<style lang="scss">
@import 'src/assets/styles/main.scss';
@import 'src/assets/styles/splitpanes.scss';
</style>
