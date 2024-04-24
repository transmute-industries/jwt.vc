import { passport } from '@/services/passport';
export const GET = async (req: any, res: any) => {
  try {
    const credential = await passport.issue()
    return Response.json(credential, { status: 200 });
  } catch (e){
    return Response.json({ message: 'Error' }, { status: 500 });
  }
}