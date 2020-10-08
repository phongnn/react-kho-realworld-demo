import React from "react"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import config from "../../common/config"
import SignInFormContainer from "./SignInFormContainer"
import {
  server as mockServer,
  rest as mswRest,
} from "../../__tests__/__helpers__/mocks/server"
import { renderWithProviders } from "../../__tests__/__helpers__/render"
import * as dummy from "../../__tests__/__helpers__/dummy"

const { baseUrl } = config.api

const submitForm = async (user: { email: string; password: string }) => {
  const { email, password } = user
  await userEvent.type(screen.getByPlaceholderText("Email"), email)
  await userEvent.type(screen.getByPlaceholderText("Password"), password)
  userEvent.click(screen.getByRole("button", { name: /Sign in/ }))
}

describe("validates input", () => {
  const baseData = dummy.userData()

  async function executeTest(
    testData: { email?: string; password?: string },
    errMsgPattern: RegExp
  ) {
    renderWithProviders(<SignInFormContainer />)
    submitForm(Object.assign({}, baseData, testData))
    expect(await screen.findByText(errMsgPattern)).toBeInTheDocument()
  }

  it("rejects blank email", async () => {
    await executeTest({ email: "" }, /Email is required/)
  })

  it("rejects invalid email", async () => {
    await executeTest({ email: "blah@test" }, /Invalid email/)
  })

  it("rejects blank password", async () => {
    await executeTest({ password: "" }, /Password is required/)
  })
})

it("shows sign in failure", async () => {
  renderWithProviders(<SignInFormContainer />)
  await submitForm(dummy.userData())

  expect(
    await screen.findByText(/Invalid email or password./)
  ).toBeInTheDocument()
})

it("shows unexpected server error", async () => {
  mockServer.use(
    mswRest.post(`${baseUrl}/users/login`, (req, res, ctx) =>
      res(ctx.status(500, "Some unknown error"))
    )
  )

  jest.spyOn(console, "error").mockImplementation(() => {})
  renderWithProviders(<SignInFormContainer />)
  await submitForm(dummy.userData())

  expect(
    await screen.findByText(/Unexpected error\. Please try again later\./)
  ).toBeInTheDocument()
})
