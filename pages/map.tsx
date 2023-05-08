import { useRef, useState, useEffect } from 'react'
import { Box } from '@mui/material'

import axios from 'axios'
import mapboxgl from 'mapbox-gl'

import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'

import AppPage from '../components/AppPage'
import SearchBox from '../components/SearchBox'

import issuer from '../services/issuer'

mapboxgl.accessToken =
  'pk.eyJ1Ijoib3JpZXN0ZWVsZSIsImEiOiJjbGhld3l6cHMwc2dhM2pwNHVrdDkzemJ0In0.gbjCZCLJvExz2sVvZ6U78w'

const austinAsPoint = [-97.7437, 30.271129]

const labelFeatures = (features) => {
  const items = features
    .map((feat) => {
      return { ...feat }
    })
    .filter((feat) => {
      return feat.relevance > 0.8
    })
  return items
}

const getPlaceFromOrganization = async (organization: any) => {
  const { location } = organization
  const { address } = location
  const query = `${address.streetAddress} ${address.postalCode} ${address.addressLocality} ${address.addressRegion}`
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    query,
  )}.json?access_token=${mapboxgl.accessToken}&types=address&country=${
    address.addressCountry
  }`
  const res = await axios.get(url)
  return labelFeatures(res.data.features)
}

const getPlacesForQuery = async (query: string) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    query,
  )}.json?access_token=${mapboxgl.accessToken}`
  const res = await axios.get(url)
  return labelFeatures(res.data.features)
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

const placesToFeatureCollection = (places) => {
  const features = places.map((place) => {
    return {
      type: 'Feature',
      geometry: place.geometry,
      properties: {
        title: place.text,
      },
    }
  })
  return {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: features,
    },
  }
}

const addMarkers = async (map, places) => {
  const points = placesToFeatureCollection(places)
  if (!map.getSource('points')){
    map.addSource('points', points)
    map.addImage('custom-marker', await loadImage(map, '/logo.png'))
    map.addLayer({
      id: 'points',
      type: 'symbol',
      source: 'points',
      layout: {
        'icon-image': 'custom-marker',
        'text-field': ['get', 'text'],
        'text-font': ['Rajdhani'],
        'text-offset': [0, 1.25],
        'text-anchor': 'top',
        'icon-size': 0.25,
      },
    })
  }
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

  useEffect(() => {
    setTimeout(async () => {
      const token = window.location.hash.replace('#', '')
      const { payload } = await issuer.verifier.verify({
        jwt: token,
      })
      const possibleIssuerPlaces = await getPlaceFromOrganization(
        payload.issuer,
      )
      const possibleSubjectPlaces = await getPlaceFromOrganization(
        payload.credentialSubject,
      )
      const places = [...possibleIssuerPlaces, ...possibleSubjectPlaces]
      addMarkers(map.current, places)
      setPlaces(places)
    }, 1 * 100)
  }, [])

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
