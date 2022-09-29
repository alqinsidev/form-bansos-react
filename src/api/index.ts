import axios from "axios";

const API_WILAYAH = axios.create({
    baseURL: `https://www.emsifa.com/api-wilayah-indonesia/api/`
})

export { API_WILAYAH }