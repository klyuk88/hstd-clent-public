export const useUpdateManuscript = async (id, files, locale) => {
    const token = useToken()
    const runtimeConfig = useRuntimeConfig()

    const formData = new FormData()

    if (files.manuscript) {
        formData.append(`files.manuscript`, files.manuscript, files.manuscript.name)
    }
    if (files.abstract) {
        formData.append(`files.abstract`, files.abstract, files.abstract.name)
    }

    formData.append("data", JSON.stringify({
        statusWork: locale === 'ru' ? 1 : 2,
        decision: null
    }));

    if (files.manuscript || files.abstract) {
        const {
            error,
            data
        } = await useFetch(`/api/manuscripts/${id.value}`, {
            headers: {
                authorization: `Bearer ${token.value}`
            },
            baseURL: runtimeConfig.public.api,
            method: "PUT",
            body: formData,

        })

        return {
            error,
            data
        }
    } else {
        return {
            error: null,
            data: null
        }
    }



}