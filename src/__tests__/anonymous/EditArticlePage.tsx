import { screen } from "@testing-library/react"

import { renderRoute } from "../../../testUtils/render"
import { allArticles } from "../../../testUtils/mocks/data"

it("redirects user to sign up page", async () => {
  renderRoute(`/edit/${allArticles[0].slug}`)
  expect(await screen.findByPlaceholderText("Username")).toBeInTheDocument()
})
