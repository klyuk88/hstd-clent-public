export default defineNuxtRouteMiddleware((to, from) => {
  const localPath = useLocalePath()
  if (to.query.code) {
    return
  } else {
    navigateTo(localPath('/login'))
  }
})