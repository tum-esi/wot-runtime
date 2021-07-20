import { saveAs } from 'file-saver'

export function useUtils() {
  function percentToHSLColor(percent, start, end) {
    //Change the start and end values to reflect the hue map
    //Refernece : http://www.ncl.ucar.edu/Applications/Images/colormap_6_3_lg.png

    /* Quick ref:
          0 – red
          60 – yellow
          120 – green
          180 – turquoise
          240 – blue
          300 – pink
          360 – red
      */

    var a = (100 - percent) / 100,
      b = (end - start) * a,
      c = b + start

    // Return a CSS HSL string
    return 'hsl(' + c + ', 100%, 50%)'
  }

  function camelToKebabCase(string) {
    // e.g. HTMLInputElement --> html-input-element
    return string
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1-$2')
      .toLowerCase()
  }

  // files:

  function downloadAs(filename = 'config', data) {
    filename = `${filename.replace(/\s+/g, '')}.json`
    let file = new Blob([JSON.stringify(data)], {
      type: 'application/json',
      name: filename // removes spaces
    })
    saveAs(file, filename)
  }

  function loadJsonFileInputIntoRefVariable(event, refVar, key) {
    // loads JSON input from HTML <input type="file"> into a refVar on input event
    const file = event.target.files[0] // input element returns event
    const reader = new FileReader()

    reader.onload = (e) => (refVar[key] = onJsonFileRead(e))
    reader.readAsText(file)
  }

  function loadVuetifyJsonFileInputIntoRefVariable(elId, refVar, key) {
    // loads JSON input from Vuetify's <v-file-input> into a refVar on input event
    const file = document.getElementById(elId).files[0] // v-file-input does not return event (get directly)
    const reader = new FileReader()

    reader.onload = (e) => (refVar[key] = onJsonFileRead(e))
    reader.readAsText(file)
  }

  function onJsonFileRead(event) {
    const json = JSON.parse(event.target.result)
    console.debug(json)
    return json
  }

  function loadTextFileInputIntoRefVariable(event, refVar, key) {
    // loads JSON input from HTML <input type="file"> into a refVar on input event
    const file = event.target.files[0] // input element returns event
    const reader = new FileReader()

    reader.onload = (e) => (refVar[key] = onTextFileRead(e))
    reader.readAsText(file)
  }

  function loadVuetifyTextFileInputIntoRefVariable(elId, refVar, key) {
    // loads JSON input from Vuetify's <v-file-input> into a refVar on input event
    const file = document.getElementById(elId).files[0] // v-file-input does not return event (get directly)
    const reader = new FileReader()

    reader.onload = (e) => (refVar[key] = onTextFileRead(e))
    reader.readAsText(file)
  }

  function onTextFileRead(event) {
    const text = event.target.result
    console.debug(text)
    return text
  }

  return {
    percentToHSLColor,
    camelToKebabCase,
    // files:
    downloadAs,
    loadJsonFileInputIntoRefVariable,
    loadVuetifyJsonFileInputIntoRefVariable,
    loadTextFileInputIntoRefVariable,
    loadVuetifyTextFileInputIntoRefVariable
  }
}
