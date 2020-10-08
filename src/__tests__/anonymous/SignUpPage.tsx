import { act, screen, waitForElementToBeRemoved } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { getAccessToken, removeAccessToken } from "../../accessToken"
import * as dummy from "../__helpers__/dummy"
import { renderRoute } from "../__helpers__/render"
import { accessToken } from "../__helpers__/mocks/data"

afterEach(removeAccessToken)

async function renderAndSubmitForm() {
  const { username, email, password } = dummy.userData()

  renderRoute("/signup")

  await userEvent.type(screen.getByPlaceholderText("Username"), username)
  await userEvent.type(screen.getByPlaceholderText("Email"), email)
  await userEvent.type(screen.getByPlaceholderText("Password"), password)

  userEvent.click(screen.getByRole("button", { name: /Sign up/ }))
}

it("goes to home page after successful sign up", async () => {
  await act(renderAndSubmitForm)
  expect(await screen.findByText("Global Feed")).toBeInTheDocument()

  // prettier-ignore
  expect(screen.getByRole("link", { name: "Settings" })).toBeInTheDocument()
  expect(screen.getByRole("link", { name: "New Post" })).toBeInTheDocument()
  // prettier-ignore
  expect(screen.queryByRole("link", { name: "Sign up" })).not.toBeInTheDocument()
  // prettier-ignore
  expect(screen.queryByRole("link", { name: "Sign in" })).not.toBeInTheDocument()

  expect(getAccessToken()).toBe(accessToken)
})

it("goes to sign in page when click on link", async () => {
  renderRoute("/signup")
  userEvent.click(screen.getByRole("link", { name: "Have an account?" }))
  // prettier-ignore
  expect(await screen.findByRole("heading", { name: "Sign in" })).toBeInTheDocument()
  expect(screen.getByRole("link", { name: "Sign in" })).toHaveClass("active")
})
