import { screen } from "@testing-library/react"
import { saveAccessToken, removeAccessToken } from "../../accessToken"
import { renderRoute } from "../__helpers__/render"
import { accessToken } from "../__helpers__/data"

afterEach(removeAccessToken)

it("should redirect to Home", async () => {
  saveAccessToken(accessToken)
  renderRoute("/signup")
  expect(await screen.findByText("Global Feed")).toBeInTheDocument()
})
