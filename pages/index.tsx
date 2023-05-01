
import { useEffect } from "react"
import Loading from "../components/Loading"

const IndexPage = () => {
  // useEffect(()=>{
  //   setTimeout(()=>{
  //     // TODO
  //   }, 1 * 1000)
  // }, [])
  return (
    <Loading message={'Connecting...'}/>
   )
}

export default IndexPage
