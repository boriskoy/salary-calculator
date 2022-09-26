import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider, Flex } from '@chakra-ui/react'
import { Provider } from 'react-redux'
import { store } from '../redux/store'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <Flex minH="100vh" minW="100vw">
          <Component {...pageProps} />
        </Flex>
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
