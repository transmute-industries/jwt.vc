import { NextApiRequest, NextApiResponse } from 'next'

import allowCors from '../../../decorators/allowCors'

import issuer from '../../../services/issuer'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  return res.status(200).json(issuer.didDocument)
}

export default allowCors(handler)