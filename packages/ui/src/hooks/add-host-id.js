import $router from '@/router'

export async function addHostId(context) {
  if ($router.currentRoute.params.hostId) {
    context.data._hostId = $router.currentRoute.params.hostId
  }
  console.debug('context.data:', context.data)
  return context
}
