<script lang="ts" setup>
  import {
    CircleStencil,
    Cropper,
    RectangleStencil,
  } from 'vue-advanced-cropper'
  import 'vue-advanced-cropper/dist/style.css'

  withDefaults(
    defineProps<{
      file?: File
      ratio?: number
      cropperType?: 'rect' | 'circle'
      noControls?: boolean
      cropperSize?: {
        maxHeight?: number
        maxWidth?: number
        minHeight?: number
        minWidth?: number
      }
    }>(),
    { cropperType: 'rect' },
  )

  const modal = defineModel({ default: false })

  const emit = defineEmits<{
    (e: 'changed', value: File): File
  }>()

  const cropperRef = useTemplateRef('cropperEl')

  function flip(x: boolean, y: boolean) {
    if (cropperRef.value) {
      const { image } = cropperRef.value.getResult()
      if (image.transforms.rotate % 180 !== 0) {
        cropperRef.value.flip(!x, !y)
      } else {
        cropperRef.value.flip(x, y)
      }
    }
  }
  function rotate(angle: number) {
    cropperRef.value?.rotate(angle)
  }

  function submit() {
    if (cropperRef.value) {
      const { canvas } = cropperRef.value.getResult()
      if (canvas) {
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `cropped_${+new Date()}.png`, {
              type: blob.type,
            })
            emit('changed', file)
            modal.value = false
          }
        })
      }
    }
  }
</script>

<template>
  <Dialog
    v-model:visible="modal"
    :header="$t('uploader.crop-image')"
    pt:mask:class="backdrop-blur-sm"
    modal
    pt:root:class="!border-0 !bg-transparent"
  >
    <div class="relative">
      <Cropper
        :maxHeight="cropperSize?.maxHeight"
        :maxWidth="cropperSize?.maxWidth"
        :minHeight="cropperSize?.minHeight"
        :minWidth="cropperSize?.minWidth"
        :src="file"
        :stencil-props="{
          aspectRatio: ratio || 10 / 12,
        }"
        :stencilComponent="
          cropperType === 'rect' ? RectangleStencil : CircleStencil
        "
        ref="cropperEl"
      />
      <div class="vertical-buttons" v-if="!noControls">
        <CropperBtn @click="flip(true, false)" title="Flip Horizontal">
          <SvgoFlipHorizontal />
        </CropperBtn>
        <CropperBtn @click="flip(false, true)" title="Flip Vertical">
          <SvgoFlipVertical />
        </CropperBtn>
        <CropperBtn @click="rotate(90)" title="Rotate Clockwise">
          <SvgoRotateClockwise />
        </CropperBtn>
        <CropperBtn @click="rotate(-90)" title="Rotate Counter-Clockwise">
          <SvgoRotateCounterClockwise />
        </CropperBtn>
        <CropperBtn
          @click="cropperRef?.reset()"
          title="Rotate Counter-Clockwise"
        >
          <SvgoReset />
        </CropperBtn>
      </div>
    </div>
    <template #footer>
      <Button
        :label="$t('Cancel')"
        @click="modal = false"
        autofocus
        severity="secondary"
        text
      />
      <Button
        :label="$t('Save')"
        @click="submit"
        autofocus
        outlined
        severity="secondary"
      />
    </template>
  </Dialog>
</template>

<style lang="scss" scoped>
  .vertical-buttons {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
</style>
