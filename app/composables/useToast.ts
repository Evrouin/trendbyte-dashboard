export const useToast = () => {
  const message = useState<string | null>('toast-message', () => null)

  const show = (msg: string, duration = 3000) => {
    message.value = msg
    setTimeout(() => {
      message.value = null
    }, duration)
  }

  return { message, show }
}
