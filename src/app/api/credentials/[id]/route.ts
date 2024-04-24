
import { NextApiRequest, NextApiResponse } from 'next';

import { passport } from '@/services/passport';

export const GET = async (req: NextApiRequest, {params}) => {
  try {
    const credential = await passport.create({ id : params.id})
    return Response.json(credential, { status: 200 });
  } catch (e){
    return Response.json({ message: 'Error' }, { status: 500 });
  }
}