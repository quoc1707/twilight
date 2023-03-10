import { BASE_URL } from '../constants'
import axios from 'axios'
import { tmdbApiKey } from '../env'

const instance = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: tmdbApiKey,
    },
})

export default instance
