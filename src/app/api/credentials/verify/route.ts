

import { passport } from '@/services/passport';

export const POST = async (req: any) => {
  const jwt = await req.text();
  const validation = await passport.verify(jwt)
  try {
    return Response.json(validation, { status: 200 });
  } catch (e){
    return Response.json({ message: 'Error' }, { status: 500 });
  }
}