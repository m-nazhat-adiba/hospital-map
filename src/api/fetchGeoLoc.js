import axios from 'axios'
import { ref } from 'vue'

const fetchGeoLoc = async ({ city }) => {
  const data = ref(null)
  const loading = ref(true)
  const API_KEY = 'k0cRtLenmZeeWXMJTHoHfA==2suWWf7ZpBGEbATe'

  try {
    const response = await axios.get(`https://api.api-ninjas.com/v1/geocoding?city=${city}`, {
      headers: { 'X-Api-Key': API_KEY }
    })
    data.value = response.data
    loading.value = false
  } catch (error) {
    console.error(error)
  }

  return { data, loading }
}

export default fetchGeoLoc
