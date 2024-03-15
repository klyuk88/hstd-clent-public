export const usePostManuscript = async (manuscriptForm, manuscriptFile, abstractFile, expertOpinion) => {
  const token = useToken()
  const runtimeConfig = useRuntimeConfig()
  manuscriptForm.value.participation =
    manuscriptForm.value.participation.id;

  const formData = new FormData();


  if (manuscriptFile.value) {
    formData.append(
      `files.manuscript`,
      manuscriptFile.value,
      manuscriptFile.value.name
    );
  }

  if (abstractFile.value) {
    formData.append(
      `files.abstract`,
      abstractFile.value,
      abstractFile.value.name
    );
  }

  if (expertOpinion.value) {
    formData.append(
      `files.expertOpinion`,
      abstractFile.value,
      abstractFile.value.name
    );
  }


  formData.append("data", JSON.stringify(manuscriptForm.value));

  const { error, data } = await useFetch("/api/manuscripts?populate=authors", {
    headers: {
      Authorization:
        `Bearer ${token.value}`,
    },
    baseURL: runtimeConfig.public.api,
    method: "POST",
    body: formData,
  });

  return { error, data }

}