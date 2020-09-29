import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import { Provider, createStore } from "react-kho"

import App from "./views/App"
import UserProvider from "./views/__shared__/UserProvider"

ReactDOM.render(
  <React.StrictMode>
    <Provider store={createStore()}>
      <UserProvider>
        <Router>
          <App />
        </Router>
      </UserProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
)
