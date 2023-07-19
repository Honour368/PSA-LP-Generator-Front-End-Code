import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import { ChakraProvider } from '@chakra-ui/react'
import ErrorBoundary from './pages/ErrorBoundaries'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
      <ErrorBoundary fallback="An Error has occured. Please seek Techincal Assistance">
        <App /> {/*renders react app from "App.jsx"*/}
      </ErrorBoundary>
    </ChakraProvider>
    
  </React.StrictMode>,
)
