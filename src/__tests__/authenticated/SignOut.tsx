import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
// prettier-ignore
import { saveAccessToken, removeAccessToken, getAccessToken } from "../../accessToken"
import { renderRoute } from "../__helpers__/render"
import { accessToken } from "../__helpers__/data"

beforeAll(() => saveAccessToken(accessToken))
afterAll(removeAccessToken)

it("clears cache and goes to home page", async () => {
  // allows the app to load and validate access token before going to the Settings page
  // otherwise we will get redirected to Sign up then Home automatically
  renderRoute("/")
  userEvent.click(await screen.findByRole("link", { name: "Settings" }))
  userEvent.click(
    await screen.findByRole("button", { name: "Or click here to logout." })
  )

  expect(
    await screen.findByRole("link", { name: "Sign up" })
  ).toBeInTheDocument()
  expect(screen.getByText("Global Feed")).toBeInTheDocument()
  expect(getAccessToken()).toBeFalsy()
})
