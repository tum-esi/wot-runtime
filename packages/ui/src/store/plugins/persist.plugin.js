import createPersistedState from 'vuex-persistedstate'

export const persistPlugin = (namespace, paths) =>
  createPersistedState({
    key: namespace,
    storage: window.localStorage,
    paths: paths || [namespace], // [namespace] will store everything per-module e.g. ["dashboards"] stores ["dashboards.dashbaordLimit", "dashboards.dashbaordUpdateFrequency"]
    rehydrated: (store) => {
      const state = store.state[namespace]
      const commit = store.commit
      if (state && state.keyedById) {
        Object.keys(state.keyedById).forEach((id) => {
          const record = state.keyedById[id]
          commit(`${namespace}/removeItem`, record)
          commit(`${namespace}/addItem`, record)
        })
        console.warn(`[REHYDRATED] ${namespace}`)
      }
    }
  })
