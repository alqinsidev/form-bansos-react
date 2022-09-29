import { API_WILAYAH } from '../../api'

const LocationServices = {
  getProvince: async () => {
    return API_WILAYAH.get('/provinces.json')
  },
  getRegencies: async (provinceId: string) => {
    return API_WILAYAH.get(`/regencies/${provinceId}.json`)
  },
  getDistricts: async (regenciesId: string) => {
    return API_WILAYAH.get(`/districts/${regenciesId}.json`)
  },
  getVilages: async (districtsId: string) => {
    return API_WILAYAH.get(`/villages/${districtsId}.json`)
  },
}

export default LocationServices
