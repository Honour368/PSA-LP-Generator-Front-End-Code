import { 
  createBrowserRouter, 
  createRoutesFromElements, 
  Route, 
  RouterProvider 
} from 'react-router-dom'

// layouts and pages
import RootLayout from './layouts/RootLayout'
import Create from './pages/Create copy server'
import ErrorBoundary from './pages/ErrorBoundaries'

// router and routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route basename={window.location.pathname.replace(/(\/[^/]+)$/, "")} element={<RootLayout />}>
      <Route index element={<Create />} /> {/*renders react app from "Create.jsx"*/}
    </Route>
  )
)

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
