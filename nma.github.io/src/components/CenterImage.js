import React from 'react'
import Image from './Image'
import { ShadowBox } from './primitives'

const CenterImage = () => (
  <ShadowBox
    bg="greyscale-light"
    overflow="hidden"
    maxHeight={[0, '20vh', '50vh']}
    boxShadow="inset 0px -10px 10px -10px rgba(8,8,8,0.25)"
  >
    <Image />
  </ShadowBox>
)

export default CenterImage
