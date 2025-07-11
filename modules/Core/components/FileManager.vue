<script lang="ts" setup>
  import { Dialog } from '#components'

  defineOptions({
    inheritAttrs: false,
  })

  interface IProps {
    noDialogMode?: boolean
    multiple?: boolean
    collection?: string
    fileTypes?: string[]
    withCopyLink?: boolean
  }

  const props = defineProps<IProps>()

  const id = useId()

  const authStore = useAuthStore()

  const modal = defineModel('visible', { default: false })
  const value = defineModel<IMediaItem | IMediaItem[]>()

  const fileStore = useFileManagerStore()
  const { search, fileItems, fetchOptions } = storeToRefs(fileStore)

  function mediaSelectionHandler(mediaItem: IMediaItem) {
    if (Array.isArray(value.value) && props.multiple) {
      value.value = _find(value.value, ['id', mediaItem.id])
        ? _remove(value.value, ({ id }) => id !== mediaItem.id)
        : [...(value.value || []), mediaItem]
    } else value.value = value.value === mediaItem ? undefined : mediaItem
  }

  function mediaSelected(mediaItem: IMediaItem) {
    return Array.isArray(value.value)
      ? _find(value.value, ['id', mediaItem.id])
      : value.value === mediaItem
  }

  const confirm = useConfirm()
  const toast = useNotify()

  const deleteFileItemDialog = (event: any, id: number | number[]) => {
    confirm.require({
      target: event.currentTarget,
      group: 'deleteFile',
      message: _isArray(id)
        ? t('Do you want to delete this files?')
        : t('Do you want to delete this file?'),
      icon: 'pi pi-info-circle',
      rejectProps: {
        label: t('Cancel'),
        severity: 'secondary',
        outlined: true,
      },
      acceptProps: {
        label: t('Delete'),
        severity: 'danger',
      },
      accept: () => {
        fileStore
          .deleteFile(id)
          .then((msg) => {
            if (typeof msg === 'string')
              toast.add({
                msg,
              })
          })
          .catch((err) =>
            toast.add({
              type: 'error',
              msg: err,
            }),
          )
      },
    })
  }

  const filesContainerRef = useTemplateRef('filesContainerEl')

  useInfiniteScroll(
    filesContainerRef,
    () => {
      fileStore.fetchItems()
    },
    { interval: 4000, canLoadMore: () => fileStore.canLoadMore && isMounted() },
  )

  const { copy, copied } = useClipboard()

  watch(copied, (newValue) => {
    if (newValue)
      toast.add({
        msg: t('File Url Copied'),
        type: 'info',
      })
  })

  onBeforeMount(() => {
    fetchOptions.value.collection = props.collection
    fetchOptions.value.fileTypes = props.fileTypes
  })

  onUnmounted(() => {
    fileStore.$reset()
  })
</script>

<template>
  <component
    v-bind="{
      ...(!noDialogMode
        ? {
            modal: true,
            maximizable: true,
            'pt:root:class': '!border-0 !bg-transparent',
            'pt:mask:class': 'backdrop-blur-sm',
            visible: modal,
            breakpoints: { '1199px': '75vw', '575px': '90vw' },
            style: { width: '50rem' },
            header: $t('media-library.index'),
          }
        : { class: 'h-svh' }),
    }"
    :is="noDialogMode ? 'div' : Dialog"
  >
    <div :class="['relative', noDialogMode && 'h-full']">
      <div class="flex items-center p-3 gap-3">
        <FileUploader
          v-slot="{ loading, open }"
          @upload-succeeded="fileItems.unshift"
        >
          <Button
            :label="$t('media-library.upload')"
            :loading="loading"
            @click="open()"
            icon="pi pi-cloud-upload"
            iconPos="right"
          ></Button>
        </FileUploader>
        <div class="grow">
          <FloatLabel variant="on">
            <label :for="`file-manager-search-${id}`">{{ $t('Search') }}</label>
            <InputText
              v-model="search"
              :id="`file-manager-search-${id}`"
              fluid
            ></InputText>
          </FloatLabel>
        </div>
        <div :class="[noDialogMode ? 'xl:w-1/6' : 'xl:w-1/5', 'w-1/3']">
          <FloatLabel variant="on">
            <label :for="`file-manager-sort-${id}`">{{ $t('SortBy') }}</label>
            <Select
              v-model="fetchOptions.sort.created_at"
              :id="`file-manager-sort-${id}`"
              :options="fileStore.fileDateSortItems"
              @update:model-value="fileStore.fetchItems(true)"
              fluid
              option-label="label"
              option-value="value"
            />
          </FloatLabel>
        </div>
        <Button
          v-if="multiple && authStore.hasPermission('delete-files')"
          :disabled="_isArray(value) && !value.length"
          :label="
            $t('Delete', { name: `(${_isArray(value) ? value.length : 0})` })
          "
          @click="
            _isArray(value)
              ? deleteFileItemDialog($event, _map(value, 'id'))
              : undefined
          "
          icon="pi pi-trash"
          severity="danger"
        ></Button>
      </div>
      <div
        class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-3 h-[90%]"
        ref="filesContainerEl"
      >
        <TransitionGroup
          class="col-span-full flex flex-col items-center justify-center gap-y-2 min-h-40"
          v-if="fileStore.loading || !fileStore.fileItems.length"
          appear
          name="fade"
          tag="div"
        >
          <template v-if="fileStore.loading">
            <ProgressSpinner
              class="size-12"
              animationDuration=".5s"
              fill="transparent"
              strokeWidth="8"
            />
            <span>{{ $t('media-library.loading') }}</span>
          </template>
          <template v-else>
            <SvgoIconsSquares class="!size-14" />
            <span>{{ $t('media-library.no-files') }}</span>
          </template>
        </TransitionGroup>
        <template v-for="(item, i) in fileStore.fileItems" :key="i">
          <slot
            :index="i"
            :item="item"
            :selected="mediaSelected(item)"
            :selectionHandler="mediaSelectionHandler"
            name="item"
          >
            <Card
              :class="[
                'cursor-pointer ring-2',
                mediaSelected(item) ? 'ring-primary-500' : 'ring-transparent',
              ]"
            >
              <template #header>
                <div
                  class="relative rounded-xl overflow-hidden size-full child:h-44"
                >
                  <Image v-if="item.type.includes('image')" :alt="item.title">
                    <template #previewicon>
                      <i class="pi pi-eye"></i>
                    </template>
                    <template #image>
                      <NuxtImg
                        :alt="`${item.title}-image`"
                        :src="item.path_url"
                      />
                    </template>
                    <template #original="{ style, previewCallback }">
                      <img
                        :src="item.path_url"
                        :style="style"
                        @click="previewCallback()"
                        alt="preview"
                      />
                    </template>
                  </Image>
                  <MediaPlayer
                    v-else-if="
                      ['audio', 'video'].filter((type) =>
                        item.type.includes(type),
                      ).length
                    "
                    :peaks="item.peaks"
                    :src="item.path_url"
                  />
                  <div
                    class="flex flex-col items-center justify-center bg-primary/20 text-primary rounded-2xl"
                    v-else
                  >
                    <Icon class="size-1/2" name="tabler:file-filled" />
                  </div>
                  <Badge
                    class="absolute top-2 end-2"
                    :severity="fileStore.colorType(item.type)"
                    >{{ item.type.split('/')?.[1] }}</Badge
                  >
                  <Checkbox
                    class="absolute top-2 start-2"
                    :model-value="mediaSelected(item)"
                    @change="mediaSelectionHandler(item)"
                    size="large"
                  />
                </div>
              </template>
              <template #title>{{ item.title }}</template>
              <template #subtitle>{{ d(item.created_at, 'long') }}</template>
              <template #footer>
                <div class="flex gap-4 mt-1">
                  <div class="flex gap-x-2">
                    <Button
                      v-if="authStore.hasPermission('delete-files')"
                      :label="$t('Delete')"
                      @click="deleteFileItemDialog($event, item.id)"
                      icon="pi pi-trash"
                      severity="danger"
                    />
                    <Button
                      :label="$t('Download')"
                      @click="downloadFile(item.id)"
                      icon="pi pi-cloud-download"
                      severity="info"
                    />
                  </div>
                  <div class="grow" v-if="withCopyLink">
                    <Button
                      class="w-full"
                      :label="$t('Copy Link')"
                      @click="copy(item.path_url)"
                      icon="pi pi-clone"
                      outlined
                    />
                  </div>
                </div>
              </template>
            </Card>
          </slot>
        </template>
      </div>
    </div>
  </component>
  <ConfirmPopup group="deleteFile">
    <template #message="slotProps">
      <div
        class="flex flex-col items-center w-full gap-4 border-b border-surface-200 dark:border-surface-700 p-4 mb-4 pb-0"
      >
        <i
          class="text-6xl text-primary-500"
          :class="slotProps.message.icon"
        ></i>
        <p>{{ slotProps.message.message }}</p>
      </div>
    </template>
  </ConfirmPopup>
</template>

<style lang="scss" scoped></style>
