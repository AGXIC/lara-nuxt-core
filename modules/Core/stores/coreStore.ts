import { defineStore } from 'pinia'

export interface IUploader {
  avatar: fileByTypeSize
  audio: fileByTypeSize
  video: fileByTypeSize
  file: fileByTypeSize
  image: fileByTypeSize
}
interface fileByTypeSize {
  types: string[]
  size: Size
}
interface Size {
  min?: any
  max: number
  chunk: number
}

export interface IMap {
  lat: number
  lng: number
}

interface ISiteInfo {
  logo?: string
  descriptions: string
  title: string
}

export const useCoreStore = defineStore('core', () => {
  const uploader = ref<IUploader>()
  const neshan_map = ref<IMap>()
  const siteInfo = ref<ISiteInfo>()

  function fetchConfigs() {
    useSanctumFetch('/configs').then((res) => {
      uploader.value = res.uploader
      neshan_map.value = res.neshan_map
      siteInfo.value = res.siteInfo
    })
  }

  return {
    //states
    uploader,
    neshan_map,
    siteInfo,
    // actions
    fetchConfigs,
  }
})
