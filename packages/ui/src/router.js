import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: { name: 'Hosts' }
  },
  {
    path: '/hosts',
    name: 'Hosts',
    props: true,
    component: () =>
      import(/* webpackChunkName: "hosts" */ '@/views/Hosts.vue'),
    meta: { breadcrumbs: [{ text: 'Hosts' }] }
  },
  {
    path: '/hosts/:hostId',
    redirect: { name: 'Systems' },
    name: 'Host',
    props: true,
    component: {
      render(c) {
        return c('router-view')
      }
    },
    children: [
      {
        path: 'systems',
        name: 'Systems',
        props: true,
        component: () =>
          import(
            /* webpackChunkName: "systems" */ '@/views/systems/Systems.vue'
          ),
        meta: { breadcrumbs: [{ text: 'Systems' }] }
      },
      {
        path: 'systems/:id',
        redirect: { name: 'SystemOverview' },
        name: 'System',
        props: true,
        component: () =>
          import(/* webpackChunkName: "system" */ '@/views/systems/System.vue'),
        meta: {
          breadcrumbs: [
            { text: 'Systems', to: { name: 'Systems' } },
            { text: 'Systems' }
          ]
        },
        children: [
          {
            path: '',
            name: 'SystemOverview',
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "system-overview" */ '@/views/systems/SystemOverview.vue'
              ),
            meta: { breadcrumbs: [{ text: 'System' }] }
          },
          {
            path: 'logs',
            name: 'SystemLogs',
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "system-logs" */ '@/views/systems/SystemLogs.vue'
              ),
            meta: { breadcrumbs: [{ text: 'System' }] }
          },
          {
            path: 'metrics',
            name: 'SystemMetrics',
            component: () =>
              import(
                /* webpackChunkName: "system-metrics" */ '@/views/systems/SystemMetrics.vue'
              ),
            meta: { breadcrumbs: [{ text: '' }] }
          },
          {
            path: 'traces',
            name: 'SystemTraces',
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "system-traces" */ '@/views/systems/SystemTraces.vue'
              ),
            meta: { breadcrumbs: [{ text: 'System' }] }
          }
        ]
      },
      {
        path: 'things',
        name: 'Things',
        component: () =>
          import(/* webpackChunkName: "things" */ '@/views/things/Things.vue'),
        meta: { breadcrumbs: [{ text: 'Things' }] }
      },
      {
        path: 'things/:id',
        name: 'Thing',
        props: true,
        component: () =>
          import(/* webpackChunkName: "thing" */ '@/views/things/Thing.vue'),
        meta: {
          breadcrumbs: [
            { text: 'Things', to: { name: 'Things' } },
            { text: 'Things' }
          ]
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    props: true,
    component: () =>
      import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
    meta: { breadcrumbs: [{ text: 'Login' }] }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
