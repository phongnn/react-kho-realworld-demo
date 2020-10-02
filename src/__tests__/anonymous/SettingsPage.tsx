import { screen } from "@testing-library/react"

import { renderRoute } from "../../../testUtils/render"

it("redirects user to sign up page", async () => {
  renderRoute("/settings")
  expect(await screen.findByPlaceholderText("Username")).toBeInTheDocument()
})
