import React from "react"
import { screen } from "@testing-library/react"

import { renderRoute } from "../__helpers__/render"

it("redirects user to sign up page", async () => {
  renderRoute("/post")
  expect(await screen.findByPlaceholderText("Username")).toBeInTheDocument()
})
