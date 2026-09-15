import { push } from 'notivue'

const toast = {
  success: (text: string) => push.success(text),
  error: (text: string) => push.error(text)
}

export default toast
