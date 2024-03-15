export const useToken = () => useState<string>(() => {
  const tokenCookie = useCookie('token')
  return tokenCookie.value || ''
})
export const useUser = () => useState(() => {
  const userCookie = useCookie('user')
  return userCookie.value || {}
})
export const useSuccessManuscript = () => useState(() => false)
export const usePaymentInfoModal = () => useState<boolean>('paymentInfoModal', () => false)
