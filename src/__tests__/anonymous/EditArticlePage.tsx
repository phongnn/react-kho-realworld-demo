import { screen } from "@testing-library/react"

import { renderRoute } from "../__helpers__/render"
import { allArticles } from "../__helpers__/data"

it("redirects user to sign up page", async () => {
  renderRoute(`/edit/${allArticles[0].slug}`)
  expect(await screen.findByPlaceholderText("Username")).toBeInTheDocument()
})
