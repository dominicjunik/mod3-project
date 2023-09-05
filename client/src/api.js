import axios from 'axios'

const customAxiosWithBaseUrl = axios.create({
    baseURL: import.meta.env.PROD ? import.meta.env.VITE_APP : ''
})

export default customAxiosWithBaseUrl