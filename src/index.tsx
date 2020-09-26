import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import { Provider, createStore } from "react-kho"

import App from "./views/App"

ReactDOM.render(
  <React.StrictMode>
    <Provider store={createStore()}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
)
