import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider, Flex } from '@chakra-ui/react'
import { Provider } from 'react-redux'
import { store } from '../redux/store'



function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <link rel="preconnect" href="https://fonts.googleapis.com"></link>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""></link>
      <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,400;1,300&display=swap" rel="stylesheet"></link>
      <ChakraProvider>
        <Flex minH="100vh" w="100vw" justifyContent="center" overflowX="hidden" style={{ fontFamily: "'Roboto Condensed' !important" }}>
          <Component {...pageProps} />
        </Flex>
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
