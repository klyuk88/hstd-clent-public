import { ref } from 'vue'
export const usePostAuthors = async (authors) => {
  const token = useToken()
  const runtimeConfig = useRuntimeConfig()
  
  const authorsArr = ref([])
  const authorsError = ref(null)

  for (let index = 0; index < authors.value.length; index++) {
    let author = authors.value[index];
    let {data, error} = await useFetch(() => "/api/authors", {
      headers: {
        authorization: `Bearer ${token.value}`
      },
      baseURL: runtimeConfig.public.api,
      method: 'POST',
      body: JSON.stringify({data: author})
    });
    if(!error.value) {
      authorsArr.value.push(data.value.data.id)
    } else {
      authorsError.value = error.value
      break;
    }
  }

  return {
    data: authorsArr,
    error: authorsError
  }

}