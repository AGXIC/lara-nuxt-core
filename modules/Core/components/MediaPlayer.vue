<script lang="ts" setup>
  import { twJoin } from 'tailwind-merge'

  defineOptions({
    inheritAttrs: false,
  })

  interface IProps {
    src?: string
    peaks?: number[]
    cover?: string
    ui?: {
      videoClasses?: string
      audioClasses?: string
      audioOptions?: { height?: string; width?: string; showSeekTime?: boolean }
      videoOptions?: { noAudioBar?: boolean }
    }
  }

  const id = useId()

  const props = withDefaults(defineProps<IProps>(), { peaks: () => [] })

  const videoPlayer = useTemplateRef('videoEl')
  const videoControlsMenuRef = useTemplateRef('videoControlsMenuEl')

  const {
    playing,
    volume,
    togglePictureInPicture,
    muted,
    supportsPictureInPicture,
  } = useMediaControls(videoPlayer)

  const waveStore = useWaveSurferStore()
  const { surferContainerRef, audioOptions, isPlaying, soundPlayerInstance } =
    storeToRefs(waveStore)

  const attrs = useAttrs()

  const containerClass = attrs.class as string | undefined

  const teleported = ref(false)
  const isFullscreen = ref(false)

  const fullscreen = async () => {
    const elem = videoPlayer.value
    if (elem) {
      if (!document.fullscreenElement) {
        teleported.value = true
        await nextTick(async () => {
          if (!elem.isConnected) {
            console.error('Video element is not connected after teleport.')
            return
          }
          try {
            await elem.requestFullscreen()
            isFullscreen.value = true
          } catch (error) {
            console.error('Error entering fullscreen:', error)
            teleported.value = false
          }
        })
      } else {
        try {
          // @ts-expect-error exist fullscreen
          await elem.exitFullscreen()
          isFullscreen.value = false
          teleported.value = false
        } catch (error) {
          console.error('Error exiting fullscreen:', error)
        }
      }
    }
  }

  const playbackRate = ref(1)

  const setPlaybackRate = (rate: number) => {
    playbackRate.value = rate
    if (soundPlayerInstance.value) {
      soundPlayerInstance.value.setPlaybackRate(rate)
    }
    if (videoPlayer.value) {
      videoPlayer.value.playbackRate = rate
    }
  }

  const soundIcon = computed(() => {
    switch (true) {
      case muted.value:
        return 'ph:speaker-x'
      case volume.value < 0.5:
        return 'ph:speaker-low'
      case volume.value > 0 && volume.value > 0.5:
        return 'ph:speaker-high'
      default:
        return 'ph:speaker-none'
    }
  })

  const coreStore = useCoreStore()

  const isVideo = computed(() =>
    coreStore.uploader?.video.types.includes(
      `.${props.src?.split('.').reverse()[0]}` || '',
    ),
  )

  watch(
    surferContainerRef,
    (newValue) => {
      if (newValue) {
        audioOptions.value = {
          ...Object.fromEntries(
            Object.entries(props.ui?.audioOptions || {}).filter(([key]) =>
              ['width', 'height'].includes(key),
            ),
          ),
          peaks: props.peaks,
        }
        if (isVideo.value) {
          videoPlayer.value?.addEventListener('loadeddata', () => {
            waveStore.initPlayer({ media: videoPlayer.value })
          })

          videoPlayer.value?.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
              teleported.value = false
              isFullscreen.value = false
            }
          })

          videoPlayer.value?.addEventListener('webkitfullscreenchange', () => {
            // @ts-expect-error chrome support
            if (!document.webkitFullscreenElement) {
              teleported.value = false
              isFullscreen.value = false
            }
          })
        } else {
          waveStore.initPlayer({ url: props.src })
        }
      }
    },
    { immediate: true, once: true },
  )

  function playToggle() {
    if (typeof window !== 'undefined') {
      if (
        window.playingPlayer &&
        window.playingPlayer !== soundPlayerInstance.value
      ) {
        window.playingPlayer.stop()
      }
      window.playingPlayer = soundPlayerInstance.value
    }
    waveStore.playToggle()
  }

  onUnmounted(() => {
    waveStore.$reset()
  })

  defineExpose({
    ...waveStore.seeker,
    play: waveStore.playToggle,
    isPlaying: isVideo.value ? playing : isPlaying,
  })
</script>

<template>
  <div
    :class="
      twJoin(
        containerClass,
        'flex flex-col gap-y-2 rounded-xl p-2 bg-gray-200 dark:bg-slate-800',
      )
    "
  >
    <div class="relative group" @click="playToggle">
      <Teleport :disabled="!teleported" to="body">
        <video
          :class="
            twJoin(
              ui?.videoClasses,
              'rounded-t-2xl rounded-b-lg aspect-video w-full',
            )
          "
          :id="`media-video-${id}`"
          :poster="cover"
          ref="videoEl"
        />
      </Teleport>
      <div
        :class="[
          'absolute size-full rounded-t-2xl rounded-b-lg transition duration-300',
          playing && 'opacity-0 group-hover:opacity-100',
        ]"
      >
        <Button :loading="waveStore.loading" rounded size="small">
          <Icon :name="playing ? 'ph:play-fill' : 'ph:pause-fill'" />
        </Button>
      </div>
    </div>
    <div
      :class="
        twJoin(
          ui?.audioClasses,
          'bg-primary/10 dark:bg-slate-500/50',
          isVideo ? 'rounded-b-2xl rounded-t-lg' : 'rounded-lg',
          'flex flex-nowrap items-center gap-x-1',
        )
      "
    >
      <slot :playing="isPlaying" :playToggle="playToggle" name="playBtn">
        <Button
          :loading="waveStore.loading"
          @click="playToggle"
          size="small"
          unstyled
        >
          <Icon :name="isPlaying ? 'ph:play-fill' : 'ph:pause-fill'" />
        </Button>
      </slot>
      <div
        :class="[
          'overflow-hidden flex-1',
          audioOptions.height === 'auto' && 'max-h-8',
          audioOptions.width && 'relative',
        ]"
        ref="surferContainerRef"
      >
        <Skeleton class="size-full" v-if="waveStore.loading" />
        <div class="absolute h-full end-0 top-0 flex items-center" v-else>
          <div
            class="text-xs me-3"
            v-if="ui?.audioOptions?.showSeekTime && !waveStore.loading"
          >
            {{ waveStore.seeker.current }}/{{ waveStore.seeker.duration }}
          </div>
        </div>
      </div>
      <template v-if="isVideo">
        <Button @click="videoControlsMenuRef?.toggle">
          <Icon name="fluent:options-20-filled" />
        </Button>
        <Popover ref="videoControlsMenuEl">
          <div class="flex flex-col">
            <div
              class="flex items-center gap-x-2 flex-nowrap rtl:flex-row-reverse"
            >
              <div
                class="hover:bg-gray-250 dark:hover:bg-slate-600 rounded-lg p-1 size-7"
                v-tooltip.top="!muted ? $t('Mute') : $t('Sound')"
                @click="muted = !muted"
              >
                <Icon class="text-xl" :name="soundIcon"></Icon>
              </div>
              <Slider
                v-model="volume"
                :max="1"
                :min="0"
                :step="0.1"
                dir="ltr"
              />
            </div>
            <div class="pb-2 pt-1">
              <div
                class="flex items-center gap-x-2 flex-nowrap rtl:flex-row-reverse"
              >
                <div
                  class="hover:bg-gray-250 dark:hover:bg-slate-600 rounded-lg p-1 size-7"
                  v-tooltip.top="$t('Reset')"
                  @click="playbackRate = 1"
                >
                  <Icon class="text-xl" name="ph:speedometer" />
                </div>
                <Slider
                  v-model="playbackRate"
                  :max="2"
                  :min="0.5"
                  :step="0.1"
                  @change="setPlaybackRate"
                  dir="ltr"
                />
                <div class="text-sm">{{ playbackRate }}x</div>
              </div>
            </div>
            <div class="px-2 py-0.5" v-if="supportsPictureInPicture">
              <div
                class="cursor-pointer flex items-center gap-x-2 p-2 flex-nowrap hover:bg-gray-250 dark:hover:bg-slate-600 rounded-lg rtl:flex-row-reverse"
                @click="togglePictureInPicture"
              >
                <div class="p-1 size-7">
                  <Icon
                    class="text-xl"
                    name="tabler:picture-in-picture-on"
                  ></Icon>
                </div>
                <div class="grow">
                  {{ $t('Show thumbnail') }}
                </div>
              </div>
            </div>
            <div class="px-2 pt-1">
              <div
                class="cursor-pointer flex items-center gap-x-2 p-2 flex-nowrap hover:bg-gray-250 dark:hover:bg-slate-600 rounded-lg rtl:flex-row-reverse"
                @click="fullscreen"
              >
                <div class="p-1 size-7">
                  <Icon
                    class="text-xl"
                    name="mingcute:fullscreen-2-line"
                  ></Icon>
                </div>
                <div class="grow">
                  {{ $t('Fullscreen') }}
                </div>
              </div>
            </div>
          </div>
        </Popover>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  :deep(video:fullscreen),
  :deep(video:-webkit-full-screen) {
    width: 100vw !important;
    height: 100vh !important;
    object-fit: contain;
    background-color: black;
  }
</style>
