const customAxiosWithBaseUrl = axios.create({
    baseURL: import.meta.env.PROD ? import.meta.env.VITE_API : ''
})

export default customAxiosWithBaseUrl