import axios from 'axios'
import pointer from 'json-pointer'

const accessToken =
  'pk.eyJ1Ijoib3JpZXN0ZWVsZSIsImEiOiJjbGhld3l6cHMwc2dhM2pwNHVrdDkzemJ0In0.gbjCZCLJvExz2sVvZ6U78w'

const getPlaceFromOrganization = async (organization: any) => {
  const { location } = organization
  const { address } = location
  const query = `${address.streetAddress} ${address.postalCode} ${address.addressLocality} ${address.addressRegion}`
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    query,
  )}.json?access_token=${accessToken}&types=address&country=${
    address.addressCountry
  }`
  const res = await axios.get(url)
  const items = res.data.features
    .map((feat) => {
      return { ...feat }
    })
    .filter((feat) => {
      return feat.relevance > 0.8
    })
    .map((feat) => {
      const { geometry, ...properties } = feat
      const feature = {
        type: 'Feature',
        organization,
        geometry: geometry,
        properties: {...organization },
      }
      return feature
    })
  return items
}

const getObjectsOfType = async (object, type) => {
  const dict = pointer.dict(object)
  const objects = []
  for (const key of Object.keys(dict)) {
    if (key.endsWith('/type')) {
      const candidate = pointer.get(object, key.replace('/type', ''))
      if (candidate.type === type) {
        objects.push(candidate)
      }
    }
  }
  return objects
}

const getFeaturesFromCredential = async (credential) => {
  const organizations = await getObjectsOfType(credential, 'Organization')
  const organizationsWithAddresses = organizations.filter((org) => {
    return org.location && org.location.address
  })
  return Promise.all(organizationsWithAddresses.map(getPlaceFromOrganization))
}

const credentialsToGeoJson = async (credentials: any) => {
  const collection = []
  for (const credential of credentials){
    for (const features of await getFeaturesFromCredential(credential)){
      for (const feature of features){
        collection.push(feature)
      }
    }
  }
  return {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: collection,
    },
  }
}

const api = { accessToken, credentialsToGeoJson }

export default api
