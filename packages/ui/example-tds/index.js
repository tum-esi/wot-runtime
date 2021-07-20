// Uses Webpack's require.context(directory, useSubdirectories = true, regExp = /^\.\/.*$/, mode = 'sync'):

// TDS: requires all plugin.json files under example-tds/ recursively
const requireTd = require.context('./', true, /.json$/)
const exampleTds = requireTd.keys().map((path) => requireTd(path))
export default exampleTds
