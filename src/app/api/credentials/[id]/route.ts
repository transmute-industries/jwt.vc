


import { passport } from '@/services/passport';

export const GET = async (req: any, {params}) => {
  try {
    const credential = await passport.create({ id : params.id})
    return new Response(credential, {
      status: 200,
      headers: {
        // "Content-Type": "application/vc+ld+json+jwt",
      },
    });
  } catch (e){
    return Response.json({ message: 'Error' }, { status: 500 });
  }
}