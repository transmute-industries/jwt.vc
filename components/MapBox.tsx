import { useRef, useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import mapboxgl from 'mapbox-gl'

import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'

import issuer from '../services/issuer'

import Map from '../services/Map'

mapboxgl.accessToken = Map.accessToken;

const austinAsPoint = [-97.7437, 30.271129]

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

const MapBox = ({ value, sx }) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [lng, setLng] = useState(austinAsPoint[0])
  const [lat, setLat] = useState(austinAsPoint[1])
  const [zoom, setZoom] = useState(9)
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
  const addMarkers = async (map, credentials) => {
    if (!map.getSource('points')) {
      const points = await Map.credentialsToGeoJson(credentials)
      map.addSource('points', points)
      map.addImage('custom-marker', await loadImage(map, '/logo.png'))
      map.addLayer({
        id: 'points',
        type: 'symbol',
        source: 'points',
        paint: {
          'text-color': '#ffffff',
        },
        layout: {
          'text-field': ['get', 'name'],
          'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
          'text-radial-offset': 0.8,
          'text-justify': 'auto',
          'icon-image': 'custom-marker',
          'icon-size': 0.1,
        },
      })
    }
  }
  useEffect(() => {
    (async ()=>{
      try{
        const { payload } = await issuer.verifier.verify({
          jwt: value,
        })
        addMarkers(map.current, [payload])
      } catch (e){
        //
      }
    })()
    
  }, [value])

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" gutterBottom>
        Map <span style={{ fontSize: '0.5em' }}>PREVIEW</span>
      </Typography>
      <Box
        ref={mapContainer}
        sx={{ minHeight: '100vh', overflow: 'hidden', ...sx }}
      />
    </Box>
  )
}

export default MapBox
