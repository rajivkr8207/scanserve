import { Provider } from "react-redux"
import AppRoutes from "./routes/AppRoutes"
import { ToastContainer } from "react-toastify"
import { store } from "./store"

const App = () => {
  return (
    <Provider store={store}>
      <AppRoutes />
      <ToastContainer />
    </Provider>
  )
}

export default App