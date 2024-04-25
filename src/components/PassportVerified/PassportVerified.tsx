
import { JsonViewer } from '@textea/json-viewer'

import PassportCard from './PassportCard'


const PassportVerified = ({validation}: any)=>{
  return <>
  <PassportCard validation={validation} json={<JsonViewer  theme={'dark'} rootName={false} value={validation} />}/>  
  </>
}

export default PassportVerified