<script lang="ts" setup>
  import { Button, LazyImageCropper } from '#components'
  import { type IUploader } from '../stores/coreStore'
  import {
    compressIfImageBeforeUpload,
    convertPsdToWebp,
    isPSDFile,
  } from '../utils/imageTools'
  import Resumable from 'resumablejs'

  defineOptions({
    inheritAttrs: false,
  })

  const props = withDefaults(
    defineProps<{
      multiple?: boolean
      fileType?: keyof IUploader
      maxFileSize?: number
      customTypes?: string
      crop?: boolean
    }>(),
    { fileType: 'file' },
  )

  const emit = defineEmits<{
    (e: 'uploadStarted', value: boolean): boolean
    (e: 'uploadPercentage', value: number): number
    (e: 'uploadFailed', value: string): string
    (e: 'uploadSucceeded', value: null | any): null | any
  }>()

  const resumable = ref<Resumable>()

  const localFiles = ref()

  const cropFile = ref<File>()

  const showCropperDialog = shallowRef(false)
  const uploadingToast = shallowRef(false)

  const initUploader = {
    uploadSpeed: 0,
    upPercentage: 0,
    upIsDone: false,
    upFailed: false,
    upStarted: false,
    upPause: false,
    startTime: 0,
  }
  const uploaderOpts = reactive(initUploader)

  const { locale } = useI18n()

  const nuxtApp = useNuxtApp()

  const token = await useTokenStorage(nuxtApp).get()

  const coreStore = useCoreStore()

  const toast = useNotify()

  const runtime = useRuntimeConfig()

  function initResumable() {
    resumable.value = new Resumable({
      target: `${runtime.public.apiUrl}/media-library/upload`,
      chunkSize: (coreStore.uploader?.[props.fileType].size.chunk || 1) * 1024,
      setChunkTypeFromFile: true,
      testChunks: true,
      testMethod: 'GET',
      maxChunkRetries: 3,
      headers: {
        'Accept-Language': locale.value,
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
      withCredentials: true,
    })

    resumable.value.on('filesAdded', (files) => {
      uploaderOpts.upFailed = false
      uploaderOpts.upStarted = false
      uploaderOpts.upIsDone = false
      uploaderOpts.upPercentage = 0
      files.forEach(
        (file) =>
          (file.uniqueIdentifier = `${file.file.size}-${file.file.name.replace(/[^a-zA-Z0-9_-]/g, '')}-${+new Date()}`),
      )
      localFiles.value = files
      uploaderOpts.startTime = Date.now()
      resumable.value?.upload()
    })

    resumable.value.on('fileProgress', (file: any) => {
      uploaderOpts.upPercentage = Math.floor(file.progress() * 100)
      const elapsedTime = (Date.now() - uploaderOpts.startTime) / 1000
      const uploadedBytes = file.size * file.progress()
      uploaderOpts.uploadSpeed = parseFloat(
        (uploadedBytes / 1024 / elapsedTime).toFixed(2),
      ) // Speed in KB/s
      emit('uploadPercentage', uploaderOpts.upPercentage)
    })

    resumable.value.on('fileSuccess', (file: File, message: string) => {
      uploadingToast.value = false
      toast.add({ msg: t('File uploaded successfully.') })

      uploaderOpts.upIsDone = true
      emit('uploadSucceeded', { ...JSON.parse(message), file: file })
    })

    resumable.value.on('uploadStart', () => {
      uploaderOpts.upStarted = true
      uploadingToast.value = true
      emit('uploadStarted', true)
    })

    resumable.value.on('fileError', (file, message) => {
      toast.add({
        type: 'error',
        msg: t(
          'Unfortunately, the upload encountered an issue. Please try again!',
        ),
      })
      uploaderOpts.upFailed = true
      emit('uploadFailed', message)
    })

    resumable.value.on('cancel', () => {
      Object.entries(initUploader).forEach(
        // @ts-expect-error
        ([key, value]) => (uploaderOpts[key] = value),
      )
      reset()

      toast.add({
        msg: t('File upload successfully canceled!'),
      })

      emit('uploadStarted', false)
      emit('uploadSucceeded', null)
    })
  }

  const { open, onChange, reset } = useFileDialog({
    multiple: props.multiple,
    accept:
      props.customTypes ||
      coreStore.uploader?.[props.fileType]?.types
        .map((ext) => `.${ext}`)
        .join(', '),
  })

  const uploadCroppedImage = async (file: File) => {
    initResumable()
    const optimizedFile = await compressIfImageBeforeUpload(file)
    await resumable.value?.addFiles([optimizedFile])
    cropFile.value = undefined
  }

  onChange(async (files) => {
    let fileItems: File[] = []
    if (files) {
      for (let i = 0; i < files.length; i++) {
        let file = files.item(i)
        if (file) {
          if (props.fileType === 'image') {
            const isPSD = await isPSDFile(file)
            if (isPSD) {
              const webpFile = await convertPsdToWebp(file)
              fileItems.push(webpFile) // Add the converted WebP file
            } else {
              const optimizedFile = await compressIfImageBeforeUpload(file)
              fileItems.push(optimizedFile) // Add the optimized file
            }
          } else fileItems.push(file)
        }
      }
      if (props.crop) {
        cropFile.value = fileItems[0]
        showCropperDialog.value = true
      } else if (fileItems.length) await resumable.value?.addFiles(fileItems)
    }
  })

  const { isOnline } = useNetworkStatus()

  watch(isOnline, (newValue) => {
    if (!newValue) resumable.value?.pause()
    else resumable.value?.upload()
  })

  onMounted(() => {
    initResumable()
  })

  onUnmounted(() => {
    if (resumable.value?.isUploading()) resumable.value.cancel()
  })
</script>

<template>
  <Toast @close="uploadingToast = false" group="uploader" position="top-center">
    <template #container="{ message, closeCallback }">
      <section class="flex flex-col p-4 gap-4 w-full bg-primary/70 rounded-xl">
        <div class="flex items-center gap-5">
          <i class="pi pi-cloud-upload text-white dark:text-black text-2xl"></i>
          <span class="font-bold text-base text-white dark:text-black">{{
            message.summary
          }}</span>
        </div>
        <div class="flex flex-col gap-2">
          <ProgressBar
            class="!bg-primary/80"
            :showValue="false"
            :style="{ height: '4px' }"
            :value="uploaderOpts.upPercentage / 100"
            pt:value:class="!bg-primary-50 dark:!bg-primary-900"
          ></ProgressBar>
          <label class="text-sm font-bold text-white dark:text-black"
            >{{ Math.ceil(uploaderOpts.upPercentage) }}%</label
          >
        </div>
        <div class="flex gap-4 mb-4 justify-end">
          <Button
            :label="resumable?.isUploading() ? $t('Pause') : $t('Resume')"
            @click="
              resumable?.isUploading()
                ? resumable?.pause()
                : resumable?.upload()
            "
            size="small"
          ></Button>
          <Button
            :label="$t('Cancel')"
            @click="
              () => {
                resumable?.cancel()
                closeCallback()
              }
            "
            security="danger"
            size="small"
          ></Button>
        </div>
      </section>
    </template>
  </Toast>
  <slot :loading="uploaderOpts.upStarted" :open="open">
    <div @click="open()">{{ $t('Upload') }}</div>
  </slot>
  <LazyImageCropper
    v-if="!multiple && crop"
    v-model="showCropperDialog"
    :file="cropFile"
    @changed="uploadCroppedImage"
  />
</template>
