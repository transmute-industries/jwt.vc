import { useRef, useState, useEffect } from 'react'
import { Box } from '@mui/material'

import axios from 'axios'
import mapboxgl from 'mapbox-gl'

import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'

import AppPage from '../components/AppPage'
import SearchBox from '../components/SearchBox'

import issuer from '../services/issuer'
import Map from '../services/Map'

mapboxgl.accessToken = Map.accessToken;
  
const austinAsPoint = [-97.7437, 30.271129]

const getPlacesForQuery = async (query: string) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    query,
  )}.json?access_token=${mapboxgl.accessToken}`
  const res = await axios.get(url)
  const items = res.data.features
    .filter((feat) => {
      return feat.relevance > 0.8
    })
  return items
}

const loadImage = (
  map,
  image = 'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
) => {
  return new Promise((resolve, reject) => {
    map.loadImage(image, (error, image) => {
      if (error) reject(error)
      resolve(image)
    })
  })
}

const IndexPage = () => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [lng, setLng] = useState(austinAsPoint[0])
  const [lat, setLat] = useState(austinAsPoint[1])
  const [zoom, setZoom] = useState(9)
  const [selected, setSelected] = useState(null)
  const [places, setPlaces] = useState([])

  useEffect(() => {
    if (map.current) return // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [lng, lat],
      zoom: zoom,
      attributionControl: false,
    })
  }, [])

  const onQuery = async (query: string) => {
    const items = await getPlacesForQuery(query)
    console.log(items)
    setPlaces(items)
  }

  const handleSelectPlace = async (place) => {
    setSelected(place)
    if (!place) {
      map.current.flyTo({
        center: austinAsPoint,
      })
    } else {
      map.current.flyTo({
        center: place.center,
      })
    }
  }

  const addMarkers = async (map, credentials) => {
    if (!map.getSource('points')){
      const response = await axios.post('/api/credentials/maps/points', {credentials});
      const points = response.data
      const places = points.data.features.map((feat)=>{
        return  {
          text: feat.organization.name,
          center: feat.geometry.coordinates
        }
      })
      setPlaces(places)
      map.addSource('points', points)
      map.addImage('custom-marker', await loadImage(map, '/logo.png'))
      map.addLayer({
        id: 'points',
        type: 'symbol',
        source: 'points',
        'paint': {
          'text-color': "#ffffff",
        },
        'layout': {
          'text-field': ['get', 'name'],
          'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
          'text-radial-offset': 0.8,
          'text-justify': 'auto',
          'icon-image': 'custom-marker',
          'icon-size': 0.1,
        }
      })
    }
  }

  return (
    <AppPage
      actions={
        <SearchBox
          selected={selected}
          onQuery={onQuery}
          onSelected={handleSelectPlace}
          options={places}
        />
      }
    >
      <Box ref={mapContainer} sx={{ minHeight: '100vh', overflow: 'hidden' }} />
    </AppPage>
  )
}

export default IndexPage
