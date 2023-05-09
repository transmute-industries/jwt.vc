
import { NextApiRequest, NextApiResponse } from 'next'

import allowCors from '../../../../../decorators/allowCors'

import Map from '../../../../../services/Map'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {credentials} = req.body;
  const geojson = await Map.credentialsToGeoJson(credentials)
  return res.status(200).json(geojson)
}

export default allowCors(handler)