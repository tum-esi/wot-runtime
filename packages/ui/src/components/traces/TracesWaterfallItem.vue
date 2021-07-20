<template>
  <div class="waterfall-item">
    <v-tooltip bottom max-width="500">
      <template #activator="{ on }">
        <span class="gap" :style="{ width: gapWidth + 'px' }"></span>
        <div class="item" :style="{ width: width + '%' }" v-on="on">
          <span class="method" :style="{ color: darkerColor }">{{
            methodMap[item.method]
          }}</span>
          <span class="service">{{ item.path }}</span>
          <span class="duration">{{ item.duration }}ms</span>
          <small v-if="previousItem">+{{ prevOffsetLabel }}</small>
          <v-progress-linear
            height="5"
            :value="100"
            :color="color"
          ></v-progress-linear>
        </div>
      </template>
      <span>
        <table>
          <tr v-for="(entry, i) in Object.entries(item)" :key="`tr-${i}`">
            <td>
              <strong>{{ entry[0] }}</strong>
            </td>
            <td>{{ entry[1] }}</td>
          </tr>
        </table>
      </span>
    </v-tooltip>
  </div>
</template>

<script>
import { computed, ref, watchEffect } from '@vue/composition-api'
import stc from 'string-to-color'
import ms from 'ms'

export default {
  name: 'TracesWaterfallItem',
  props: {
    index: {
      type: Number,
      required: true
    },
    item: {
      type: Object,
      required: true
    },
    previousItem: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    },
    compact: {
      type: Boolean,
      required: true
    },
    zoomFactor: {
      type: Number,
      required: true
    },
    start: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    let prevOffset = ref(0)
    if (props.previousItem && props.previousItem.end <= props.item.ts) {
      prevOffset.value = props.item.ts - props.previousItem.end
    } else if (props.previousItem && props.previousItem.end > props.item.ts) {
      prevOffset.value = props.item.ts - props.previousItem.ts
    }

    const prevOffsetLabel = computed(() => ms(prevOffset.value))

    const gapWidth = ref((props.item.ts - props.start) * props.zoomFactor)

    watchEffect(() => {
      if (props.compact) gapWidth.value = props.index * 10
      else gapWidth.value = (props.item.ts - props.start) * props.zoomFactor
    })

    const width = computed(() => props.item.duration * props.zoomFactor)

    const color = computed(() => stc(props.item.path))

    const methodMap = ref({
      find: 'GET',
      get: 'GET',
      create: 'POST',
      update: 'PUT',
      patch: 'PATCH',
      remove: 'DELETE'
    })

    const darkerColor = computed(() => adjustBrightness(color.value, -50))

    function adjustBrightness(color, amt) {
      var usePound = false

      if (color[0] === '#') {
        color = color.slice(1)
        usePound = true
      }

      var R = parseInt(color.substring(0, 2), 16)
      var G = parseInt(color.substring(2, 4), 16)
      var B = parseInt(color.substring(4, 6), 16)

      // to make the color less bright than the input
      // change the following three "+" symbols to "-"
      R = R + amt
      G = G + amt
      B = B + amt

      if (R > 255) R = 255
      else if (R < 0) R = 0

      if (G > 255) G = 255
      else if (G < 0) G = 0

      if (B > 255) B = 255
      else if (B < 0) B = 0

      var RR =
        R.toString(16).length === 1 ? '0' + R.toString(16) : R.toString(16)
      var GG =
        G.toString(16).length === 1 ? '0' + G.toString(16) : G.toString(16)
      var BB =
        B.toString(16).length === 1 ? '0' + B.toString(16) : B.toString(16)

      return (usePound ? '#' : '') + RR + GG + BB
    }

    return {
      prevOffset,
      prevOffsetLabel,
      gapWidth,
      width,
      color,
      methodMap,
      darkerColor
    }
  }
}
</script>

<style scoped lang="scss">
:root {
  --themeBorder: grey;
  --themePrimary: blue;
  --themeBackground: #efefef;
  --themePrimary: blue;
}

.waterfall-item {
  display: inline-block;
  align-items: center;
  min-width: 100%;
  flex-grow: 1;
  padding: 4px 0;
  &:first-child {
    margin-top: 2px;
  }
  padding-top: 0;
  display: flex;
  border-bottom: 1px solid #eeeeee;
  transition: 0.3s background;
  &:hover {
    background: #ececec;
    cursor: pointer;
  }
  &:active {
    * {
      color: white;
    }
    background: var(--themePrimary);
  }
}

.duration-bar {
  height: 3px;
  transform: translateY(-2px);
  transition: width 0.3s;
}

.item {
  font-size: 11.5px;
  color: #333;
  small {
    opacity: 0.6;
  }
  white-space: nowrap;
}

.duration {
  margin: 0 5px;
  font-weight: bold;
  display: inline-block;
}

.method {
  display: inline-block;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 9px;
  font-weight: bold;
  margin-right: 5px;
}

.service {
  font-weight: bold;
}

.gap {
  transition: width 0.3s;
  animation: fadeIn 1s;
}
</style>
