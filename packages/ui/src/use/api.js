// import vm from '../main.js'
import { ref, computed } from '@vue/composition-api'
import $store from '@/store'
import { models, useFind } from 'feathers-vuex'

export function useAPI(modelName, query) {
  // const $api = vm.$api

  // get items:

  const ModelClass = models.api[modelName]
  const path = ModelClass.servicePath

  // utilities:

  const search = ref('')

  const tableOptions = ref({
    page: 1,
    itemsPerPage: 25,
    sortBy: ['name'],
    sortDesc: [true],
    groupBy: [], // string array of props (currently only group-by one column supported, but its a planned feature and will be implemented in this way)
    groupDesc: [],
    mustSort: false,
    multiSort: true
  })

  const tableFooterProps = ref({ 'items-per-page-options': [10, 25, 50, 100] })

  const sort = computed(() => {
    const sortObject = {}
    tableOptions.value.sortBy.map((prop, i) => {
      sortObject[prop] = tableOptions.value.sortDesc[i] === true ? 1 : -1
    })
    // console.debug(sortObject);
    return sortObject
  })

  // watch(sort, (newVal) => console.debug(newVal));

  function filterItemByProps(modelName, search, item) {
    // vue-data-table custom-filter function to filter items
    // (value: any, search: string | null, item: any) => boolean
    const lowerCaseSearch = search.toString().toLowerCase()
    switch (modelName) {
      case 'Host':
      case 'Thing':
      case 'System':
      default:
        return item._id.toLowerCase().match(lowerCaseSearch)
    }
  }

  let selected = computed({
    get: () => {
      return $store.state.selected
    },
    set: (value) => {
      $store.commit('SET', { prop: 'selected', value: value })
    }
  })

  function isSelected(_id, idKey = '_id') {
    return selected.value.find((i) => i[idKey] === _id)
  }

  function addOrRemoveSelection(item) {
    var index = selected.value.indexOf(item)
    if (index === -1) {
      selected.value.push(item)
    } else {
      selected.value.splice(index, 1)
    }
  }

  const params = computed(() => {
    if (!query.value) return null
    const props = ['name']
    const filters = {} // TODO: object of objects with format: { PROP: { $regex: SEARCH_STRING, $options: OPTIONAL_OBJ } }
    props.forEach((prop) => (filters[prop] = { $regex: search.value }))
    // console.debug(filters);
    // console.debug(query.value);

    const $limit = tableOptions.value.itemsPerPage
    const $skip = (tableOptions.value.page - 1) * $limit

    // NeDB does not accept $regex prop
    return {
      query: { ...query.value, $sort: sort.value, $limit, $skip },
      debounce: 500,
      pagination: false
    }
  })

  const {
    items,
    isPending: isPendingItems,
    haveLoaded,
    paginationData
    // isLocal,
  } = useFind({
    model: ModelClass,
    params: params
    // queryWhen: queryWhen, // prevents unnecessary fetching
  }) // passed-in values must be refs (or computed, since they return ref instances)

  const itemsTotal = computed(() =>
    paginationData.value.default
      ? paginationData.value.default.mostRecent.total
      : 0
  )

  const filteredItems = ref(items.value) // items with current filter (required for grid view)

  // CRUD: feathers-vuex wrapper functions

  async function getItem(id, params = {}) {
    try {
      const item = await ModelClass.get(id, params)
      // const item = await $api.service(path).get(id, params)
      console.debug('get', path, item)
      return item
    } catch (error) {
      console.debug('get', path, error)
    }
  }

  async function getItemFromStore(id, params = {}) {
    try {
      const item = await ModelClass.getFromStore(id, params)
      // const item = await $api.service(path).get(id, params)
      console.debug('getFromStore', path, item)
      return item
    } catch (error) {
      console.debug('get', path, error)
    }
  }

  async function createItem(data, params = {}) {
    try {
      // data._userId = user.value._id;
      let item = await new ModelClass(data).create(params)
      // const item = await $api.service(path).create(data, params)
      console.debug('create', path, item)
      return item
    } catch (error) {
      console.debug('create', path, error)
    }
  }

  async function patchItem(data, params = {}) {
    try {
      const item = new ModelClass(data) // data requires _id
      // const item = await $api.service(path).patch(data._id, data, params)
      item.save(data)
      console.debug('patch', path, item)
      return item
    } catch (error) {
      console.debug('patch', path, error)
    }
  }

  async function updateItem(data, params = {}) {
    try {
      const item = new ModelClass(data)
      // const item = await $api.service(path).update(data._id, data, params)
      item.save(params)
      console.debug('update', path, item)
      return item
    } catch (error) {
      console.debug('update', path, error)
    }
  }

  async function removeItem(data, params = {}) {
    try {
      const item = await new ModelClass(data).remove(params) // instance's id field is used for the remove id
      // const item = await $api.service(path).remove(data._id, params)
      console.debug('remove', path, item)
      return item
    } catch (error) {
      console.debug('remove', path, error)
    }
  }

  async function findItems(params = {}) {
    try {
      const items = await ModelClass.find(params)
      // const items = await $api.service(path).find(params)
      console.debug('find', path, items)
      return items
    } catch (error) {
      console.debug('find', path, error)
    }
  }

  async function findItemsInStore(params = {}) {
    try {
      const items = await ModelClass.findInStore(params)
      // const items = await $api.service(path).find(params)
      console.debug('findInStore', path, items)
      return items
    } catch (error) {
      console.debug('findInStore', path, error)
    }
  }

  async function cloneItems(items) {
    console.debug(items)
    try {
      // eslint-disable-next-line no-unused-vars
      await items.forEach(
        ({ _id, ...clone }) => new ModelClass(clone).create()
        // $api.service(path).create(clone)
      )
      console.debug('cloneItems', path, items)
    } catch (error) {
      console.debug('cloneItems', path, error)
    }
  }

  async function removeItems(items) {
    try {
      await items.forEach((item) => {
        new ModelClass(item).remove()
        // $api.service(path).remove(item._id)
      })
      console.debug('removeItems', path, items)
    } catch (error) {
      console.debug('removeItems', path, error)
    }
  }

  const dialog = computed({
    get: () => $store.state.dialog,
    set: (val) => $store.commit('SET', { prop: 'dialog', value: val })
  })

  return {
    items,
    isPendingItems,
    haveLoaded,
    itemsTotal,
    // utilities:
    search,
    tableOptions,
    tableFooterProps,
    filterItemByProps,
    filteredItems,
    selected,
    isSelected,
    addOrRemoveSelection,
    dialog,
    // CRUD:
    getItem,
    getItemFromStore,
    createItem,
    patchItem,
    updateItem,
    removeItem,
    findItems,
    findItemsInStore,
    cloneItems,
    removeItems
  }
}
