<script generic="T extends IModel" lang="ts" setup>
  import { type DefineComponent } from 'vue'
  import {
    type IColumnsItem,
    useCrudDataTable,
  } from '../../composables/crudDataTable'
  import { DataTable } from 'primevue'
  import type { RouteRecordName } from 'vue-router'
  import { useCrudDataFields } from '../../composables/crudDataFields'

  defineOptions({
    inheritAttrs: false,
  })

  interface IProps {
    api?: string
    expansionColumns?: string[]
    showColumnKeys?: string[]
    pronounce?: string
    relations?: string[]
    options?: {
      noSelection?: boolean
      noActions?: boolean
      noRouteEffect?: boolean
      noCard?: boolean
      noFilters?: boolean
    }
    formComponent: DefineComponent | RouteRecordName
    customColumnsName?: Record<IColumnsItem['key'], string>
  }

  const auth = useAuthStore()

  const props = defineProps<IProps>()

  const router = useRouter()

  const [pageName] =
    _isString(router.currentRoute.value.name) && props.options?.noRouteEffect
      ? _tail(router.currentRoute.value.name.split('-'))
      : _tail(props.api?.split('/')) || []

  const {
    data: dataFields,
    fetchFields,
    loading: fieldsLoading,
  } = useCrudDataFields<T>(`${useId()}-${pageName}`, props.api || pageName)

  const {
    data,
    onRestore,
    onDelete,
    onDuplicate,
    onBulk,
    filters,
    refresh,
    fetchData,
    paginationOptions,
    loading: dataLoading,
  } = useCrudDataTable<T>(`${useId()}-${pageName}`, props.api || pageName)

  watch(
    dataLoading,
    (newValue) => {
      if (!newValue) fetchFields()
    },
    { once: true },
  )

  const dataColumns = shallowRef<IColumnsItem[]>([])

  const loading = computed(
    () => fieldsLoading.value || dataLoading.value || !dataColumns.value.length,
  )

  watch(
    dataFields,
    (newValue) => {
      if (newValue) {
        const columns = props.showColumnKeys
          ? newValue.filter(
              ({ attribute, showable }) =>
                props.showColumnKeys?.includes(attribute.toString()) &&
                showable,
            )
          : newValue.filter(({ showable }) => showable)

        dataColumns.value = columns.map((item) => ({
          key: item.attribute.toString(),
          label: item.label,
          sortable: item.sortable,
        }))
      }
    },
    { once: true },
  )

  const emit = defineEmits<{
    (e: 'data:refresh'): void
    (e: 'data:restore', value: number | number[]): number | number[]
    (e: 'data:duplicate', value: number): number
  }>()

  const selectedItems = ref<T[] | T>()

  const columns = computed(
    () =>
      dataColumns.value?.filter(
        (item) => !props.expansionColumns?.includes(item.key),
      ) || [],
  )

  const confirm = useConfirm()

  const confirmationModal = (
    title: string,
    msg: string,
    action: () => void,
    actionTitle: string,
    color: 'danger' | 'info' | 'warn' = 'danger',
  ) =>
    confirm.require({
      message: msg,
      header: title,
      rejectLabel: t('Cancel'),
      rejectProps: {
        label: t('Cancel'),
        severity: 'secondary',
        outlined: true,
      },
      acceptProps: {
        label: actionTitle,
        severity: color,
      },
      accept: action,
    })

  const deleteItem = (id: number | number[]) => {
    confirmationModal(
      t('Delete', { name: props.pronounce || t('record') }),
      t('Do you want to delete this record?', {
        record: props.pronounce || t('record'),
      }),
      () => {
        onDelete(id)
      },
      t('Delete'),
    )
  }

  const restoreItem = (id: number | number[]) => {
    confirmationModal(
      t('Restore', { name: props.pronounce || t('record') }),
      _isArray(id)
        ? t('Do you want to restore this records?')
        : t('Do you want to restore this record?', {
            record: props.pronounce || t('record'),
          }),
      () => {
        onRestore(id)
      },
      t('Restore'),
      'info',
    )
  }

  const duplicateItem = (id: number) => {
    confirmationModal(
      t('Duplicate', { name: props.pronounce || t('record') }),
      t('Do you want to duplicate this record?', {
        record: props.pronounce || t('record'),
      }),
      () => {
        onDuplicate(id)
      },
      t('Duplicate'),
      'warn',
    )
  }

  const formDialog = reactive<{ dialog: boolean; id: number | null }>({
    dialog: false,
    id: null,
  })

  const device = useDevice()

  const bulkAction = shallowRef(false)

  const multipleActions = computed(() => {
    const selectedRecords = _isArray(selectedItems.value)
      ? selectedItems.value
      : []

    const getIds = (records: T[]) => _map(records, 'id')

    return [
      ...(auth.hasPermission(`${pageName}-restore`) ||
      selectedRecords.filter(({ deleted_at }) => deleted_at).length
        ? [
            {
              label: t('Restore'),
              icon: 'pi pi-undo',
              severity: 'info',
              command: () =>
                restoreItem(
                  getIds(
                    selectedRecords.filter(({ deleted_at }) => deleted_at),
                  ),
                ),
            },
            {
              separator: true,
            },
          ]
        : []),
      ...(auth.hasPermission(`${pageName}-edit`)
        ? [
            {
              label: t('Show'),
              icon: 'pi pi-pen-to-square',
              severity: 'info',
              command: () => (bulkAction.value = true),
            },
          ]
        : []),
      ...(auth.hasPermission(`${pageName}-delete`)
        ? [
            {
              label: t('Delete'),
              icon: 'pi pi-trash',
              severity: 'danger',
              command: () => deleteItem(getIds(selectedRecords)),
            },
          ]
        : []),
    ]
  })

  function onShowOrCreate(id?: number) {
    if (!_isString(props.formComponent)) {
      formDialog.id = id || null
      formDialog.dialog = true
    } else
      router.push({
        name: props.formComponent,
        params: { id },
      })
  }
</script>

<template>
  <Card
    :unstyled="
      options?.noCard || !!$attrs.unstyled || device.isMobileOrTablet.value
    "
  >
    <template #content>
      <LazyCrudPartialsDefaultFilters
        v-if="!options?.noFilters"
        v-model="filters"
        :fields="dataFields?.filter(({ filterable }) => filterable)"
        :loading="loading"
        @data:fetch="fetchData"
      >
        <template
          v-for="(item, i) in Object.keys($slots)"
          :key="i"
          #[item]="slotProps"
        >
          <slot v-bind="slotProps" :name="item"></slot>
        </template>
      </LazyCrudPartialsDefaultFilters>
      <LazyCrudPartialsDefaultWidgets />
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Button
            :loading="loading"
            @click="refresh()"
            icon="pi pi-sync"
            severity="info"
            variant="text"
          ></Button>
          <SplitButton
            v-if="auth.hasPermission(`${pageName}-bulk`)"
            :disabled="
              loading ||
              (_isArray(selectedItems) ? !selectedItems.length : true)
            "
            :label="`${$t('Selected Items')}: (${_isArray(selectedItems) ? selectedItems.length : 0})`"
            :model="multipleActions"
            severity="secondary"
            variant="outlined"
          >
          </SplitButton>
          <Button
            v-else-if="auth.hasPermission(`${pageName}-delete`)"
            :disabled="
              loading ||
              (_isArray(selectedItems) ? !selectedItems.length : true)
            "
            :label="`${$t('Delete')}: (${_isArray(selectedItems) ? selectedItems.length : 0})`"
            @click="
              deleteItem(
                _isArray(selectedItems) ? _map(selectedItems, 'id') : [],
              )
            "
            icon="pi pi-trash"
            severity="danger"
            variant="text"
          ></Button>
        </div>
        <slot :create="onShowOrCreate()" name="createBtn">
          <Button
            v-if="auth.hasPermission(`${pageName}-add`)"
            :label="
              $t('Add', {
                name: pronounce || t('record'),
              })
            "
            @click="onShowOrCreate()"
            icon="pi pi-plus-circle"
          ></Button>
        </slot>
      </div>
      <DataTable
        v-model:multi-sort-meta="paginationOptions.sortItems"
        v-model:selection="selectedItems"
        :meta-key-selection="!options?.noSelection"
        :rows="paginationOptions.perPage"
        :selection-mode="options?.noSelection ? 'single' : 'multiple'"
        :total-records="data?.total || 0"
        :value="data?.data || []"
        :virtual-scroller-options="{
          lazy: true,
          loading,
          showLoader: true,
          numToleratedItems: paginationOptions.perPage,
        }"
        dataKey="id"
        export-filename=""
        removable-sort
        row-hover
        sort-mode="multiple"
      >
        <Column
          class="w-1"
          :selection-mode="options?.noSelection ? 'single' : 'multiple'"
        ></Column>
        <Column
          v-for="(column, i) in columns"
          :field="column.key"
          :header="column.label"
          :header-style="column.style"
          :key="i"
          :sortable="column.sortable"
        >
          <template #body="{ data }">
            <slot
              :item="data"
              :name="`item-${column.key}`"
              :value="_result<T>(data, column.key)"
            >
              <CrudDataItem :item="data" />
            </slot>
          </template>
          <template #editor="{ data }">
            <slot :data="data" :name="`input-${column.key}`"></slot>
          </template>
        </Column>
        <Column v-if="!options?.noActions" key="actions">
          <template #body="{ data }">
            <slot
              :hasPermission="auth.hasPermission"
              :item="data"
              name="actions"
            >
              <div class="flex items-center gap-2">
                <slot
                  :hasPermission="auth.hasPermission"
                  :item="data"
                  name="prependActions"
                ></slot>
                <Divider v-if="$slots.prependActions" layout="vertical" />
                <CrudPartialsDefaultActions
                  :page-name="pageName"
                  :restorable="!!data.deleted_at"
                  @data:delete="deleteItem(data.id)"
                  @data:duplicate="duplicateItem(data.id)"
                  @data:restore="restoreItem(data.id)"
                  @data:show="onShowOrCreate(data.id)"
                />
                <Divider v-if="$slots.appendActions" layout="vertical" />
                <slot
                  :hasPermission="auth.hasPermission"
                  :item="data"
                  name="appendActions"
                ></slot>
              </div>
            </slot>
          </template>
        </Column>
        <Column
          class="w-1"
          v-if="
            expansionColumns?.length &&
            columns.length < (dataColumns || [])?.length
          "
          expander
        >
          <template #body="{ data }">
            <slot :item="data" name="expansion">
              <div class="grid grid-cols-2 md:grid-cols-3">
                <div
                  class="flex items-center gap-x-2"
                  v-for="(item, i) in expansionColumns"
                  :key="i"
                >
                  <span
                    >{{ _find(dataColumns, ['key', item])?.label }}:&nbsp;</span
                  >
                  <CrudDataItem :item="_result<T>(data, item)" />
                </div>
              </div>
            </slot>
          </template>
        </Column>
        <template #empty>
          <CrudPartialsDefaultEmpty
            :loading="loading"
            :page-name="pageName"
            :pronounce="pronounce"
            @data:create="onShowOrCreate()"
            @data:refresh="refresh()"
          />
        </template>
      </DataTable>
    </template>
    <template #footer>
      <div
        class="flex items-center flex-col xl:flex-row xl:justify-between justify-center gap-y-2"
        id="crud-footer"
      >
        <Paginator
          :rows="paginationOptions.perPage"
          :rows-per-page-options="[10, 20, 40, 60, 150]"
          :total-records="data?.total || 0"
        />
        <CrudPartialsDefaultMultipleActions
          :selected-items="selectedItems"
          @data:delete="deleteItem"
          @data:restore="restoreItem"
        />
      </div>
    </template>
  </Card>
  <Dialog
    v-if="!_isString(formComponent)"
    v-model:visible="formDialog.dialog"
    @update:visible="!$event ? (formDialog.id = null) : undefined"
    header="Flex Scroll"
    maximizable
    modal
  >
    <component v-bind="{ id: formDialog.id, dataFields }" :is="formComponent" />
  </Dialog>
  <LazyCrudPartialsDefaultBulkActions
    v-if="auth.hasPermission(`${pageName}-bulk`)"
    v-model:visible="bulkAction"
    @bulk="onBulk"
  />
</template>

<style lang="scss" scoped></style>
