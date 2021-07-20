import Vue from 'vue/dist/vue.js'
import vm from '@/main.js'
import GoldenLayout from 'golden-layout'
import 'golden-layout/dist/goldenlayout.min.js'
import 'golden-layout/src/css/goldenlayout-base.css'
import 'golden-layout/src/css/default-theme.css'
if (vm.$vuetify.theme.dark) {
  import('golden-layout/src/css/goldenlayout-dark-theme.css')
} else {
  import('golden-layout/src/css/goldenlayout-light-theme.css')
}
// import 'golden-layout/src/css/goldenlayout-soda-theme.css'

// golden-layout panels: TODO: remove

const propsDataMixed = {
  chartSeries: [
    {
      name: 'TEAM A',
      type: 'column',
      data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30]
    },
    {
      name: 'TEAM B',
      type: 'area',
      data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43]
    },
    {
      name: 'TEAM C',
      type: 'line',
      data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39]
    }
  ],
  chartOptions: {
    chart: {
      height: 350,
      type: 'line',
      stacked: false
    },
    stroke: {
      width: [0, 2, 5],
      curve: 'smooth'
    },
    plotOptions: {
      bar: {
        columnWidth: '50%'
      }
    },

    fill: {
      opacity: [0.85, 0.25, 1],
      gradient: {
        inverseColors: false,
        shade: 'light',
        type: 'vertical',
        opacityFrom: 0.85,
        opacityTo: 0.55,
        stops: [0, 100, 100, 100]
      }
    },
    labels: [
      '01/01/2003',
      '02/01/2003',
      '03/01/2003',
      '04/01/2003',
      '05/01/2003',
      '06/01/2003',
      '07/01/2003',
      '08/01/2003',
      '09/01/2003',
      '10/01/2003',
      '11/01/2003'
    ],
    markers: {
      size: 0
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      title: {
        text: 'Points'
      },
      min: 0
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return y.toFixed(0) + ' points'
          }
          return y
        }
      }
    }
  }
}

const propsDataLine = {
  chartSeries: [
    {
      name: 'TEAM A',
      type: 'column',
      data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30]
    },
    {
      name: 'TEAM B',
      type: 'area',
      data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43]
    },
    {
      name: 'TEAM C',
      type: 'line',
      data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39]
    }
  ],
  chartOptions: {
    chart: {
      id: 'realtime',
      height: 350,
      type: 'line',
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000
        }
      },
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    title: {
      text: 'Dynamic Updating Chart',
      align: 'left'
    },
    markers: {
      size: 0
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      max: 100
    },
    legend: {
      show: false
    }
  }
}

const propsDataRadar = {
  chartSeries: [
    {
      name: 'Series 1',
      data: [80, 50, 30, 40, 100, 20]
    },
    {
      name: 'Series 2',
      data: [20, 30, 40, 80, 20, 80]
    },
    {
      name: 'Series 3',
      data: [44, 76, 78, 13, 43, 10]
    }
  ],
  chartOptions: {
    chart: {
      height: 350,
      type: 'radar',
      dropShadow: {
        enabled: true,
        blur: 1,
        left: 1,
        top: 1
      }
    },
    title: {
      text: 'Radar Chart - Multi Series'
    },
    stroke: {
      width: 2
    },
    fill: {
      opacity: 0.1
    },
    markers: {
      size: 0
    },
    xaxis: {
      categories: ['2011', '2012', '2013', '2014', '2015', '2016']
    }
  }
}

const propsDataTree = {
  chartSeries: [
    {
      name: 'Desktops',
      data: [
        {
          x: 'ABC',
          y: 10
        },
        {
          x: 'DEF',
          y: 60
        },
        {
          x: 'XYZ',
          y: 41
        }
      ]
    },
    {
      name: 'Mobile',
      data: [
        {
          x: 'ABCD',
          y: 10
        },
        {
          x: 'DEFG',
          y: 20
        },
        {
          x: 'WXYZ',
          y: 51
        },
        {
          x: 'PQR',
          y: 30
        },
        {
          x: 'MNO',
          y: 20
        },
        {
          x: 'CDE',
          y: 30
        }
      ]
    }
  ],
  chartOptions: {
    legend: {
      show: false
    },
    chart: {
      height: 350,
      type: 'treemap'
    },
    title: {
      text: 'Multi-dimensional Treemap',
      align: 'center'
    }
  }
}

/** A composition function to bundle all golden-layout functionlaity together
 *
 * @see https://github.com/arun-prakash-fokus/vue-goldenlayout-dynamic/blob/master/src/App.vue
 */
export function useGoldenLayout() {
  Vue.prototype.$goldenLayout = {} // single global golden layout instance througout app (vm.$goldenLayout)

  const content = [
    {
      type: 'row',
      content: [
        {
          type: 'component',
          title: 'Mixed chart',
          componentName: 'VueComponent',
          componentState: {
            name: 'Apexchart',
            propsData: propsDataMixed
          }
        },
        {
          type: 'component',
          title: 'Radar chart',
          componentName: 'VueComponent',
          componentState: {
            name: 'Apexchart',
            propsData: propsDataRadar
          }
        },
        {
          type: 'column',
          content: [
            {
              type: 'component',
              title: 'Mixed chart 2',
              componentName: 'VueComponent',
              componentState: {
                name: 'Apexchart',
                propsData: propsDataMixed
              }
            },
            {
              type: 'component',
              title: 'Tree chart',
              componentName: 'VueComponent',
              componentState: {
                name: 'Apexchart',
                propsData: propsDataTree
              }
            }
          ]
        }
      ]
    }
  ]

  const defaultConfig = {
    settings: {
      hasHeaders: true,
      constrainDragToContainer: true,
      reorderEnabled: true,
      selectionEnabled: false,
      popoutWholeStack: false,
      blockedPopoutsThrowError: true,
      closePopoutsOnUnload: true,
      showPopoutIcon: true,
      showMaximiseIcon: true,
      showCloseIcon: true
    },
    dimensions: {
      borderWidth: 5,
      minItemHeight: 10,
      minItemWidth: 10,
      headerHeight: 20,
      dragProxyWidth: 300,
      dragProxyHeight: 200
    },
    labels: {
      close: 'close',
      maximise: 'maximise',
      minimise: 'minimise',
      popout: 'open in new window'
    },
    content
  }

  async function init(query) {
    //  Load saved layout config state from localstorage
    const goldenLayoutState = localStorage.getItem('goldenlayout-state')
    const config = goldenLayoutState
      ? JSON.parse(goldenLayoutState)
      : defaultConfig

    // NOTE: ensure that the following are only done in the mounted lifecycle.
    // create a new GL instance.
    vm.$goldenLayout = new GoldenLayout(config, document.querySelector(query))

    // console.log(vm.$goldenLayout)

    /**
     * Registers either a component constructor or a component factory function
     * with GoldenLayout. registerComponent is the counterpart to the componentName
     * and componentState config keys in the item config.
     *
     * @see http://golden-layout.com/docs/GoldenLayout.html#registerComponent
     *
     * @param {String} name of the component, as referred to by componentName in
     * the component configuration
     * @param {Constructor | Function} constructor or factory function. Will be
     * invoked with new and two arguments, a container object and a component state
     */
    vm.$goldenLayout.registerComponent(
      'VueComponent',
      async (container, componentState) => {
        // 'component' accepts fileName of component [string] or module [module]
        const Component = await getComponent(componentState)

        // console.log(Component)

        // create Vue component instances dynamically (doesn't mount it yet)
        // https://css-tricks.com/creating-vue-js-component-instances-programmatically/
        const instance = new Vue({ ...Component, ...componentState }) // spred instance $options

        // console.log(instance)

        instance.$mount() // pass nothing

        // append it to the GL container.
        container.getElement().append(instance.$el)
      }
    )

    window.addEventListener('resize', () => vm.$goldenLayout.updateSize())

    vm.$goldenLayout.on('stateChanged', () =>
      onLayoutStateChanged(vm.$goldenLayout.toConfig())
    )

    function onLayoutStateChanged(state) {
      localStorage.setItem('goldenlayout-state', JSON.stringify(state))
    }

    vm.$goldenLayout.init()
  }

  function resetLayout() {
    localStorage.removeItem('goldenlayout-state')
    vm.$goldenLayout.destroy()
    // TODO: vm.$goldenLayout.init()
  }

  /**
   * Returns the vue component from the passed-in state (based on state.name)
   *
   * @param {*} componentState any serialisable object to be passed-down to the component
   * @returns Component
   */
  async function getComponent(componentState) {
    const { default: Component } = await import(
      `@/components/golden-layout/components/${componentState.name}.vue`
    )
    return Component
  }

  // adding items (see http://golden-layout.com/tutorials/dynamically-adding-components.html)

  function registerDragSource(el, dragItemOrConfig) {
    // converts element into a 'dragSource' which allows creating
    // components by simply dragging the element onto the layout
    vm.$goldenLayout.createDragSource(el, dragItemOrConfig)
  }

  return { init, resetLayout, registerDragSource }
}
