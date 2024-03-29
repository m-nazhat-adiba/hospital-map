import express from 'express'
import cors from 'cors'
import axios from 'axios'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())

app.get('/api/covid19/hospitals', async (req, res) => {
  try {
    const response = await axios.get('https://dekontaminasi.com/api/id/covid19/hospitals')
    res.json(response.data)
  } catch (error) {
    res.status(error.response.status).json(error.response.data)
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
