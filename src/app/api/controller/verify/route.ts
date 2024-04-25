
import { passport } from "@/services/passport";

export const GET = async (req: any, {params}) => {
  try {
    const id = new URL(req.url).searchParams.get('id')
    const validation = await passport.verifyController({ id })
    return Response.json(validation, { status: 200 });
  } catch (e){
    return Response.json({ message: 'Error' }, { status: 500 });
  }
}