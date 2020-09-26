import React from "react"
import { Provider, createStore } from "react-kho"
import { MemoryRouter as Router } from "react-router-dom"
import { render } from "@testing-library/react"

// import App from "../src/views/App"
// import UserProvider, { UserContext } from "../src/views/__shared__/UserProvider"
// import { alice } from "./mocks/data"

export function renderWithProviders(ui: React.ReactElement) {
  const apolloClient = createStore()
  return render(
    <Router>
      <Provider store={apolloClient}>{ui}</Provider>
    </Router>
  )
}

// export function renderRoute(path: string) {
//   const apolloClient = createApolloClient()
//   return render(
//     <Router initialEntries={[path]}>
//       <ApolloProvider client={apolloClient}>
//         <UserProvider>
//           <App />
//         </UserProvider>
//       </ApolloProvider>
//     </Router>
//   )
// }

// export function renderProtectedRoute(path: string) {
//   const apolloClient = createApolloClient()
//   return render(
//     <Router initialEntries={[path]}>
//       <ApolloProvider client={apolloClient}>
//         <UserContext.Provider value={alice}>
//           <App />
//         </UserContext.Provider>
//       </ApolloProvider>
//     </Router>
//   )
// }

// export function renderApp() {
//   return renderRoute("/")
// }

// export function renderWithRouter(ui: React.ReactElement) {
//   return render(<Router>{ui}</Router>)
// }
