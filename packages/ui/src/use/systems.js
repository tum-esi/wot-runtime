export function useDeployment($api, query = null) {
  // deployment:

  async function start(item) {
    item.status = 'loading'
    const system = await $api
      .service('systems')
      .patch(item._id, { ...item, status: 'running' })
    if (query) query.value = { ...query.value } // refetch items
    return system
  }

  async function restart(item) {
    item.status = 'loading'
    const system = await $api
      .service('systems')
      .patch(item._id, { ...item, status: 'running' })
    if (query) query.value = { ...query.value } // refetch items
    return system
  }

  async function stop(item) {
    item.status = 'loading'
    const system = await $api
      .service('systems')
      .patch(item._id, { ...item, status: 'stopped' })
    if (query) query.value = { ...query.value } // refetch items
    return system
  }

  return { start, restart, stop }
}
