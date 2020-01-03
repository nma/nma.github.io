import { shadow, background } from 'styled-system'
import { Flex, Box } from 'rebass'
import styled from 'styled-components'

export const ShadowFlex = styled(Flex)(shadow)
export const ShadowBox = styled(Box)(shadow)
export const BackgroundBox = styled(Box)(background)
