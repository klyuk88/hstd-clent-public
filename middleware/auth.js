export default defineNuxtRouteMiddleware((to, from) => {
    const tokenData = useToken()
    const localPath = useLocalePath()
    if (tokenData.value !== '') {
        return
    } else {
        return navigateTo(localPath('/login'))
    }

})