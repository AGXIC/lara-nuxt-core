import { defineStore } from 'pinia'
import WaveSurfer from 'wavesurfer.js'

interface IPlayerInitiator {
  media?: HTMLVideoElement | null
  url?: string
}

declare global {
  interface Window {
    playingPlayer?: WaveSurfer
  }
}

export const useWaveSurferStore = defineStore('waveSurfer', () => {
  const soundPlayerInstance = ref<WaveSurfer>()
  const surferContainerRef = ref<HTMLDivElement>()
  const audioOptions = ref<{
    height?: number | 'auto'
    width?: number
    peaks?: number[]
  }>({ peaks: [] })
  const audioSeeker = reactive({
    current: '00:00',
    duration: '00:00',
    progress: 0,
  })
  const loading = ref(true)
  const isPlaying = ref(false)

  const seeker = computed(() => toRaw(audioSeeker))

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  function initPlayer({
    media = undefined,
    url = undefined,
  }: IPlayerInitiator) {
    if (surferContainerRef.value)
      soundPlayerInstance.value = WaveSurfer.create({
        container: surferContainerRef.value,
        cursorColor: '#6d77ab',
        barRadius: 10,
        barGap: 3.5,
        progressColor: '#a8caf3',
        waveColor: '#c1d5ed',
        backend: 'MediaElement',
        height: audioOptions.value?.height || 'auto',
        width: audioOptions.value?.width ? '90%' : 'auto',
        cursorWidth: audioOptions.value.peaks ? 1 : 4,
        partialRender: true,
        barWidth: 2.5,
        ...(!!media ? { media } : {}),
        url,
        // @ts-expect-error its correct value
        peaks: audioOptions.value.peaks,
      })
    if (soundPlayerInstance.value) {
      soundPlayerInstance.value.on('ready', () => {
        loading.value = false
        audioSeeker.duration = formatTime(
          soundPlayerInstance.value?.getDuration() || 0,
        )
      })

      soundPlayerInstance.value.on('play', () => {
        isPlaying.value = true
      })

      soundPlayerInstance.value.on('pause', () => {
        isPlaying.value = false
      })

      soundPlayerInstance.value.on('timeupdate', (currentTime) => {
        audioSeeker.current = formatTime(currentTime)
        const duration = soundPlayerInstance.value?.getDuration()
        if (duration) audioSeeker.progress = (currentTime / duration) * 100
      })
      soundPlayerInstance.value.on('seeking', (currentTime) => {
        audioSeeker.current = formatTime(currentTime)
        const duration = soundPlayerInstance.value?.getDuration()
        if (duration) audioSeeker.progress = (currentTime / duration) * 100
      })
    }
  }

  function playToggle() {
    soundPlayerInstance.value?.playPause()
  }

  return {
    // states
    soundPlayerInstance,
    surferContainerRef,
    audioOptions,
    loading,
    isPlaying,
    // getters
    seeker,
    // actions
    initPlayer,
    playToggle,
  }
})
