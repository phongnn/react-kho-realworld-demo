import React from "react"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import SignUpFormContainer from "./SignUpFormContainer"
import config from "../../common/config"
import * as dummy from "../../__tests__/__helpers__/dummy"
import {
  server as mockServer,
  rest as mswRest,
} from "../../__tests__/__helpers__/server"
import { renderWithProviders } from "../../__tests__/__helpers__/render"

const { baseUrl } = config.api

const submitForm = async (user: {
  username: string
  email: string
  password: string
}) => {
  const { username, email, password } = user
  await userEvent.type(screen.getByPlaceholderText("Username"), username)
  await userEvent.type(screen.getByPlaceholderText("Email"), email)
  await userEvent.type(screen.getByPlaceholderText("Password"), password)
  userEvent.click(screen.getByRole("button", { name: /Sign up/ }))
}

describe("validates input", () => {
  const baseData = dummy.userData()

  async function executeTest(
    testData: Partial<typeof baseData>,
    errMsgPattern: RegExp
  ) {
    renderWithProviders(<SignUpFormContainer />)
    submitForm(Object.assign({}, baseData, testData))
    expect(await screen.findByText(errMsgPattern)).toBeInTheDocument()
  }

  it("rejects blank username", async () => {
    await executeTest({ username: "" }, /Username is required/)
  })

  it("rejects username containing special characters", async () => {
    await executeTest(
      { username: "blah$" },
      /Username must be from 3 to 30 alphanumeric characters/
    )
  })

  it("rejects blank email", async () => {
    await executeTest({ email: "" }, /Email is required/)
  })

  it("rejects invalid email", async () => {
    await executeTest({ email: "blah@test" }, /Invalid email/)
  })

  it("rejects too short password", async () => {
    await executeTest(
      { password: "bl@h" },
      /Password must have at least 6 characters/
    )
  })
})

it("shows server validation message", async () => {
  const errMsg = "already exists"
  mockServer.use(
    mswRest.post(`${baseUrl}/users`, (req, res, ctx) =>
      res(ctx.status(422), ctx.json({ errors: { username: [errMsg] } }))
    )
  )

  renderWithProviders(<SignUpFormContainer />)
  await submitForm(dummy.userData())

  // expect(screen.getByRole("button", { name: /Sign up/ })).toBeDisabled()
  expect(await screen.findByText(/username already exists/)).toBeInTheDocument()
})

/* production code works as expected in browser but somehow this test fails */
it("shows unexpected server error", async () => {
  mockServer.use(
    mswRest.post(`${baseUrl}/users`, (req, res, ctx) =>
      res(ctx.status(500, "Some unknown error"))
    )
  )

  jest.spyOn(console, "error").mockImplementation(() => {})
  renderWithProviders(<SignUpFormContainer />)
  await submitForm(dummy.userData())

  expect(
    await screen.findByText(/Unexpected error\. Please try again later\./)
  ).toBeInTheDocument()
})
