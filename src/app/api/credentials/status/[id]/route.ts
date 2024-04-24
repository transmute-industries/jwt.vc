
import { passport } from '@/services/passport';

export const GET = async (req: any, {params}) => {
  try {
    const credential = await passport.status({ id : params.id})
    return Response.json(credential, { status: 200, headers: { 
      // "Content-Type": "application/vc+ld+json+jwt" 
    }  });
  } catch (e){
    return Response.json({
      "type": "https://www.w3.org/ns/credentials/status-list#",
      "title": "List Unavailable",
      "detail": "The resource you requested does not exist, or you do not have access to it.",
      "code": -128
     }, { status: 404, headers: { "Content-Type": "application/problem+json", "Content-Language": "en" } });
  }
}