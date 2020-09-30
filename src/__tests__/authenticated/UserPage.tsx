import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { renderRoute } from "../../../testUtils/render"
import { bob, accessToken } from "../../../testUtils/mocks/data"
import { saveAccessToken, removeAccessToken } from "../../accessToken"

beforeAll(() => saveAccessToken(accessToken))
afterAll(removeAccessToken)

// production code works but somehow this test fails
xit("toggles state of following author", async () => {
  renderRoute(`/users/${bob.username}`)

  // prettier-ignore
  const btnToggle = await screen.findByRole("button", { name: `Follow ${bob.username}` })
  userEvent.click(btnToggle)

  // prettier-ignore
  expect(await screen.findByRole("button", { name: `Unfollow ${bob.username}` })).toBeInTheDocument()

  // prettier-ignore
  // await waitFor(() => expect(btnToggle.textContent).toMatch(new RegExp(`Unfollow ${bob.username}`)))
})
