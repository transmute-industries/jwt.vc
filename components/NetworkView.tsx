import ForceGraph3D from 'react-force-graph-3d'
import { useRef, useEffect, useState } from 'react'
import { Typography, Box, Paper } from '@mui/material'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import token from '../services/token'
import { Cypher } from '@transmute/jsonld-to-cypher'
import { toast } from 'react-toastify'
import SpriteText from 'three-spritetext'

const bloomPass = new UnrealBloomPass()
bloomPass.strength = 3
bloomPass.radius = 1
bloomPass.threshold = 0.1
declare var window: any

const mutateGraph = (graph: any) => {
  graph.nodes = graph.nodes.map((node) => {
    return { ...node }
  })
  return graph
}

export const NetworkView = ({ value }) => {
  const fgRef = useRef()
  const { current }: any = fgRef
  const [graph, setGraph]: any = useState({ nodes: [], links: [] })
  useEffect(() => {
    if (value.length) {
      ;(async () => {
        try {
          const credential = await token.transform(value)
          const { graph } = await Cypher.fromDocument(credential)
          setGraph(mutateGraph(graph))
        } catch (e) {
          toast.error(e.message)
        }
      })()
    }
  }, [value])

  useEffect(() => {
    if (current && window.hasEffects === undefined) {
      window.hasEffects = true
      current.postProcessingComposer().addPass(bloomPass)
    }
  }, [current])

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h3" gutterBottom>
          Network Visualization{' '}
          <span style={{ fontSize: '0.5em' }}>PREVIEW</span>
        </Typography>
        <Paper>
          <ForceGraph3D
            height={600}
            showNavInfo={false}
            backgroundColor={'#000'}
            ref={fgRef}
            graphData={graph}
            nodeThreeObject={(node) => {
              const sprite = new SpriteText(node.id.substring(0, 32) + '...')
              sprite.color = node.color
              sprite.textHeight = 8
              return sprite
            }}
            onNodeDragEnd={(node) => {
              node.fx = node.x
              node.fy = node.y
              node.fz = node.z
            }}
            nodeAutoColorBy="labels"
          />
        </Paper>
      </Box>
    </Box>
  )
}

export default NetworkView
