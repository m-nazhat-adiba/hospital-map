import axios from 'axios'
import { ref } from 'vue'

const fetchlocation = async () => {
  const data = ref(null)
  const loading = ref(true)
  try {
    const response = await axios.get('http://localhost:3000/api/covid19/hospitals') // Make request to the proxy server
    data.value = response.data
    loading.value = false
  } catch (error) {
    console.error(error)
  }

  return { data, loading }
}

export default fetchlocation
