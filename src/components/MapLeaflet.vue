<template>
  <div id="map" ref="mapContainer"></div>
</template>

<script setup>
import leaflet from 'leaflet'
import { onMounted, ref } from 'vue'
import fetchLocation from '../api/fetchLocation.js'
import fetchGeoLoc from '../api/fetchGeoLoc.js'

const lat = ref(0)
const long = ref(0)
const map = ref()
const mapContainer = ref()

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      lat.value = position.coords.latitude
      long.value = position.coords.longitude
      map.value.setView([lat.value, long.value], 13)
      leaflet.marker([lat.value, long.value]).addTo(map.value)
    })
  }
}

const getRegion = (str) => {
  const region = str.toLowerCase().trim()
  const commaIndex = region.indexOf(',')

  if (commaIndex !== -1) {
    let substringBeforeComma = region.substring(0, commaIndex).trim()
    if (substringBeforeComma.startsWith('kota ')) {
      substringBeforeComma = substringBeforeComma.replace('kota ', '')
    }
    return substringBeforeComma
  } else {
    const parts = region.split(/\s+/)
    const lastPart = parts[parts.length - 1]
    if (lastPart.toLowerCase() === 'kota' || lastPart.toLowerCase() === 'kabupaten') {
      parts.pop()
      return parts.join(' ').trim()
    } else {
      return region
    }
  }
}

const mapGeoLocation = async (array) => {
  const geoData = []

  for (let i = 0; i < 10; i++) {
    const city = getRegion(array[i].region)
    console.log('City:', city)

    const geoLocData = await fetchGeoLoc({ city })
    console.log('GeoLoc Data:', geoLocData.data.value)

    geoData.push(geoLocData)
  }

  console.log('Geo Data:', geoData)

  return geoData
}

const mapMarker = (arr) => {
  for (let item of arr) {
    let geo = item.data.value
    if (geo.length > 0) {
      leaflet.marker([geo[0].latitude, geo[0].longitude]).addTo(map.value)
    }
  }
}

onMounted(async () => {
  const hospitalData = await fetchLocation()
  const geoLocHospital = await mapGeoLocation(hospitalData.data.value)

  map.value = leaflet.map(mapContainer.value).setView([51.05, -0.09], 13)

  leaflet
    .tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    })
    .addTo(map.value)

  getLocation()
  mapMarker(geoLocHospital)
})
</script>

<style>
#map {
  height: 100vh;
  width: 100%;
}
</style>
