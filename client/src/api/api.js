import axios from 'axios'
// import { api_url } from '../utils/config'

const local = 'http://localhost:5000/api'
const production = '' // you can fill this in later

const api = axios.create({
    baseURL: local,
    withCredentials: true
})

export default api
