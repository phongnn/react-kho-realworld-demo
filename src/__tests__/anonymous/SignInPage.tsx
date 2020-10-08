import { act, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { getAccessToken, removeAccessToken } from "../../accessToken"
import { renderRoute } from "../__helpers__/render"
import { alice, accessToken } from "../__helpers__/data"

afterEach(removeAccessToken)

async function renderAndSubmitForm() {
  const { email, password } = alice
  renderRoute("/signin")

  await userEvent.type(screen.getByPlaceholderText("Email"), email)
  await userEvent.type(screen.getByPlaceholderText("Password"), password)
  userEvent.click(screen.getByRole("button", { name: /Sign in/ }))
}

it("goes to home page after successful sign in", async () => {
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

test("goes to sign up page when click on link", async () => {
  renderRoute("/signin")
  userEvent.click(screen.getByRole("link", { name: "Need an account?" }))
  // prettier-ignore
  expect(await screen.findByRole("heading", { name: "Sign up" })).toBeInTheDocument()
  expect(screen.getByRole("link", { name: "Sign up" })).toHaveClass("active")
})
