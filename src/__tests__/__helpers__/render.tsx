import React from "react"
import { Provider, createStore } from "react-kho"
import { MemoryRouter as Router } from "react-router-dom"
import { render } from "@testing-library/react"

import App from "../../views/App"
import UserProvider, { UserContext } from "../../views/__shared__/UserProvider"
import { alice } from "./mocks/data"
import { signedInUserQuery } from "../../store/queries"

export function renderWithProviders(ui: React.ReactElement) {
  const store = createStore()
  return render(
    <Router>
      <Provider store={store}>{ui}</Provider>
    </Router>
  )
}

export function renderRoute(path: string) {
  const store = createStore()
  return render(
    <Router initialEntries={[path]}>
      <Provider store={store}>
        <UserProvider>
          <App />
        </UserProvider>
      </Provider>
    </Router>
  )
}

export function renderProtectedRoute(path: string) {
  const store = createStore()
  store.setQueryData(signedInUserQuery, alice)

  return render(
    <Router initialEntries={[path]}>
      <Provider store={store}>
        <UserContext.Provider value={alice}>
          <App />
        </UserContext.Provider>
      </Provider>
    </Router>
  )
}

export function renderWithRouter(ui: React.ReactElement) {
  return render(<Router>{ui}</Router>)
}
