
import { NextApiRequest,  } from 'next';

import { passport } from '@/services/passport';

export const GET = async (req: NextApiRequest) => {
  try {
    return Response.json(passport.controller, { status: 200 });
  } catch (e){
    return Response.json({ message: 'Error' }, { status: 500 });
  }
}