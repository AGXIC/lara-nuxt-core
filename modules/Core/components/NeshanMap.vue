<script lang="ts" setup>
  import { type IMap, useCoreStore } from '../stores/coreStore'
  import { twMerge } from 'tailwind-merge'

  defineOptions({
    inheritAttrs: false,
  })

  const id = `neshan_${useId()}`

  interface IProps {
    readonly?: boolean
    showLocationText?: boolean
    label?: string
    error?: string
    mapClass?: string | string[]
  }

  const props = withDefaults(defineProps<IProps>(), {
    readonly: false,
    showLocationText: false,
  })

  const emit = defineEmits<{
    (e: 'locationText', value: string): string
  }>()

  const value = defineModel<IMap>()

  const coreStore = useCoreStore()

  useHead({
    link: [
      {
        rel: 'stylesheet',
        href: 'https://static.neshan.org/sdk/leaflet/1.4.0/leaflet.css',
      },
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/leaflet.locatecontrol/dist/L.Control.Locate.min.css',
      },
    ],
  })

  const mapMarker = computed(() => value.value || coreStore.neshan_map)

  watch(
    mapMarker,
    (newValue) => {
      if (newValue) {
        const script = document.createElement('script')
        script.src = 'https://static.neshan.org/sdk/leaflet/1.4.0/leaflet.js'
        document.body.appendChild(script)
        script.onload = () => {
          const locatecontrolScript = document.createElement('script')
          locatecontrolScript.onload = () => {
            onWindowLoad()
          }
          locatecontrolScript.src =
            'https://cdn.jsdelivr.net/npm/leaflet.locatecontrol/dist/L.Control.Locate.min.js'
          document.body.appendChild(locatecontrolScript)
        }
        setTimeout(() => {
          let map = document.getElementById(id)
          if (map) map.lastChild?.remove()
        }, 500)
      }
    },
    { immediate: true },
  )

  const map = ref()

  const marker = ref()

  const locator = ref()

  const { public: runtime } = useRuntimeConfig()

  interface IGetAddressFromLoc {
    status: 'OK' | 'error'
    formatted_address: string
    route_name: string
    route_type: 'secondary'
    neighbourhood: string
    city: string
    state: string
    place: null
    municipality_zone: number
    in_traffic_zone: 'true'
    in_odd_even_zone: 'true'
    village: null | string
    county: string
    district: string
  }

  async function getAddressFromLoc(lat: number, lng: number) {
    await $fetch<string>(`/neshan/getLocationAddress/${lat}/${lng}`, {}).then(
      (data) => {
        emit(
          'locationText',
          useJsonParser<IGetAddressFromLoc>(data).formatted_address,
        )
      },
    )
  }

  function updateLatLng(lat: number, lng: number, reverse: boolean = false) {
    if (reverse) {
      marker.value.setLatLng([lat, lng])
      map.value.panTo([lat, lng])
    } else {
      map.value.flyTo([lat, lng], 18)
    }

    locator.value.stop()

    value.value = marker.value.getLatLng()

    if (props.showLocationText) {
      let { lat, lng } = marker.value.getLatLng()
      getAddressFromLoc(lat, lng)
    }
  }

  interface Window {
    L: any
  }

  declare const window: Window

  const defaultType = computed(() =>
    useColorMode().value === 'dark' ? 'standard-night' : 'neshan',
  )

  function onWindowLoad() {
    map.value = new window.L.Map(id, {
      key: runtime.mapApiKey,
      maptype: defaultType.value,
      poi: true,
      traffic: false,
      center: [mapMarker.value?.lat, mapMarker.value?.lng],
      zoom: 18,
    })

    marker.value = new window.L.Marker(
      [mapMarker.value?.lat, mapMarker.value?.lng],
      {
        draggable: true,
        autoPan: true,
      },
    ).addTo(map.value)

    if (!props.readonly) {
      locator.value = window.L.control
        .locate({
          clickBehavior: {
            inView: 'stop',
            outOfView: 'setView',
            inViewNotFollowing: 'setView',
          },
          locateOptions: {
            enableHighAccuracy: true,
          },
        })
        .addTo(map.value)

      marker.value.on('dragend', () => {
        updateLatLng(marker.value.getLatLng().lat, marker.value.getLatLng().lng)
      })
      map.value.on('click', (e: any) => {
        marker.value.setLatLng(e.latlng)
        updateLatLng(marker.value.getLatLng().lat, marker.value.getLatLng().lng)
      })
      map.value.on('locationfound', (e: any) => {
        marker.value.setLatLng(e.latlng)
        updateLatLng(marker.value.getLatLng().lat, marker.value.getLatLng().lng)
      })
    }
  }

  const mapClasses = computed(() =>
    twMerge(
      'min-h-40',
      props.mapClass,
      'dark:bg-dark-300',
      'z-0 rounded-lg bg-gray-200 ring-1 ring-gray-300',
    ),
  )
</script>

<template>
  <Fieldset :label="label">
    <div :class="[mapClasses]" :id="id"></div>
    <Message v-if="!!error" severity="error" size="small" variant="simple">{{
      error
    }}</Message>
  </Fieldset>
</template>
