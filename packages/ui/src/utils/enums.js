export const ElementTypeEnum = Object.freeze({
  FOLDER: 'folder',
  TD: 'td',
  MASHUP: 'mashup'
})

/**
 * Available Tabs for Thing Description elements
 */
export const TDTabsEnum = Object.freeze({
  EDITOR: 'editor',
  CONFIG: 'config',
  PERFORMANCE: 'performance'
})

export const ElementTitleEnum = Object.freeze({
  FOLDER: 'Folder',
  TD: 'Thing Description',
  MASHUP: 'Mashup'
})

export const PossibleInteractionTypesEnum = Object.freeze({
  PROP_READ: 'property-read',
  PROP_WRITE: 'property-write',
  PROP_OBSERVE_READ: 'property-observe-read',
  PROP_OBSERVE_WRITE: 'property-observe-write',
  ACTION: 'action-invoke',
  EVENT_SUB: 'event-subscribe',
  EVENT_UNSUB: 'event-unsubscribe'
})

export const InteractionStateEnum = Object.freeze({
  // No / invalid td
  NO_INTERACTIONS: 'No interactions can be shown.',
  NOT_SELECTED: 'Select an interaction to invoke it.',
  NOT_INVOKED: 'Interactions are selected. Click invoke button to invoke them.',
  INVOKED: 'Interactions have been invoked.'
})

// Results messages
export const RESULT_MESSAGES = Object.freeze({
  NO_INTERACTIONS_SELECTED: 'No interactions have been selected',
  NO_INTERACTIONS_INVOKED: 'Interactions have not been invoked yet'
})

export const TdStateEnum = Object.freeze({
  NO_TD: 'NO TD: Paste or upload a Thing Description.',
  VALID_TD_JSON: 'VALID JSON: TD is valid JSON.',
  INVALID_TD_JSON: 'INVALID JSON: TD is invalid JSON.',
  VALID_CONSUMED_TD: 'CONSUMED: TD has been successfully consumed.',
  VALID_TD_FETCHED: 'FETCH SUCCESS: TD has successfully been fetched.',
  INVALID_TD_FETCHED: 'FETCH ERROR: TD could not be fetched.',
  INVALID_TD_EMPTY: 'INVALID TD: TD may not be empty object.',
  INVALID_CONSUMED_TD: 'CONSUME ERROR: TD could not be consumed.',
  INVALID_TD: 'INVALID TD: TD is invalid.',
  VALID_TD: 'VALID TD: TD is valid.'
})

export const TdConfigEnum = Object.freeze({
  INFO: 'This config will be used for your TD.',
  UNSAVED: 'Please save your changes to apply them',
  SAVE_SUCCESS: 'Config was safed successfully.',
  RESET: 'Config was resetted to default config. Click save to apply this.',
  ERROR: 'Error: Wrong data format. Change config to make it saveable.'
})

/* The enum values indexes of SAVE_SUCCESS and ERROR must be equal
 to the indexes at the TdConfigEnum, to ensure that aConfigStatusBar
 highliting works */
export const TdVirtualConfigEnum = Object.freeze({
  INFO: 'This config will be used to generate a Virtual Thing for your TD',
  UNSAVED: 'Please save your changes to apply them',
  SAVE_SUCCESS: 'Virtual Thing config was safed successfully.',
  RESET: 'Virtual Thing config was resetted to default config. Save to apply!',
  ERROR:
    'Error: Wrong data format. Change Virtual Thing config to make it saveable.'
})

export const ProtocolEnum = Object.freeze({
  HTTP: 'http',
  HTTPS: 'https',
  COAP: 'coap',
  COAPS: 'coaps',
  MQTT: 'mqtt'
})

export const VtStatus = Object.freeze({
  NOT_CREATED: 'Virtual Thing is not running for this TD',
  STARTUP: 'a Virtual Thing is currently being created',
  RUNNING: 'Virtual Thing is up',
  STOPPED: 'the virtualization is being stopped',
  ERROR: 'there has been an error with Virtual Thing'
})

export const MeasurementTypeEnum = Object.freeze({
  NUM_RUNS: 'Iteration',
  DURATION_RUN: 'Duration',
  NUM_CLIENTS_NUM_RUN: 'Multiple Clients with iterations',
  NUM_CLIENTS_DURATION_RUN: 'Multiple Clients with duration'
})

export const DelayTypeEnum = Object.freeze({
  NO_DELAY: 'No Delay',
  BEFORE_EACH: 'Delay before each',
  BEFORE_BEGIN: 'Delay before beginning'
})

export const StatusEnum = Object.freeze({
  NOT_STARTED: 'not-started',
  LOADING: 'loading',
  COMPUTED: 'computed',
  ERROR: 'error'
})

// For InteractionTiming vocabulary
export const TypeOfMeasurementContext = Object.freeze({
  DYNAMIC_PROPERTY_READ: 'dynamicTimingContext_property_read',
  DYNAMIC_PROPERTY_WRITE: 'dynamicTimingContext_property_write',
  DYNAMIC_ACTION: 'dynamicTimingContext_action',
  NULL: 'null'
})
