import { useToast as primeToast } from 'primevue/usetoast'

interface IToast {
  title?: string
  msg: string
  type?: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast'
  closable?: boolean
  timeout?: number
  styleClass?: any
  contentStyleClass?: any
}

export const useNotify = () => {
  const toast = primeToast()

  function add({
    msg,
    type,
    title,
    closable,
    timeout,
    styleClass,
    contentStyleClass,
  }: IToast) {
    toast.add({
      detail: msg,
      severity: type || 'success',
      closable,
      summary: title,
      life: timeout || typeof closable === 'undefined' ? undefined : 3000,
      contentStyleClass,
      styleClass,
    })
  }

  function error({
    msg,
    title,
    closable,
  }: Pick<IToast, 'msg' | 'title' | 'closable'>) {
    add({ msg, type: 'error', title, closable })
  }

  function warning({
    msg,
    title,
    closable,
  }: Pick<IToast, 'msg' | 'title' | 'closable'>) {
    add({ msg, type: 'warn', title, closable })
  }

  const clear = () => {
    toast.removeAllGroups()
  }

  return { add, clear, error, warning }
}
