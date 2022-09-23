import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider, Flex } from '@chakra-ui/react'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Flex minH="100vh" minW="100vw">
        <Component {...pageProps} />
      </Flex>
    </ChakraProvider>
  )
}

export default MyApp
