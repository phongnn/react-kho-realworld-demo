import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { renderProtectedRoute } from "../../../testUtils/render"
import { bob } from "../../../testUtils/mocks/data"

it("toggles state of following author", async () => {
  renderProtectedRoute(`/users/${bob.username}`)

  // prettier-ignore
  const btnToggle = await screen.findByRole("button", { name: `Follow ${bob.username}` })
  userEvent.click(btnToggle)

  // prettier-ignore
  expect(await screen.findByRole("button", { name: `Unfollow ${bob.username}` })).toBeInTheDocument()

  // prettier-ignore
  await waitFor(() => expect(btnToggle.textContent).toMatch(new RegExp(`Unfollow ${bob.username}`)))
})
