import React from "react"
import { screen, render, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import config from "../../common/config"
import SettingsForm from "../../views/Settings/SettingsForm"
import { renderProtectedRoute } from "../__helpers__/render"
import { alice } from "../__helpers__/data"
import { server as mockServer, rest as mswRest } from "../__helpers__/server"
import * as dummy from "../__helpers__/dummy"

const { baseUrl } = config.api

const getImageInput = () =>
  screen.getByPlaceholderText("URL of profile picture")
const getEmailInput = () => screen.getByPlaceholderText("Email")
const getBioInput = () => screen.getByPlaceholderText("Short bio about you")

const submitForm = async (input: {
  email: string
  image: string
  bio: string
}) => {
  userEvent.clear(getImageInput())
  await userEvent.type(getImageInput(), input.image)

  userEvent.clear(getBioInput())
  await userEvent.type(getBioInput(), input.bio)

  userEvent.clear(getEmailInput())
  await userEvent.type(getEmailInput(), input.email)

  userEvent.click(screen.getByRole("button", { name: /Update Settings/ }))
}

it("loads and shows current settings", async () => {
  renderProtectedRoute("/settings")

  // @ts-ignore
  expect(getImageInput().value).toBe(alice.image)
  // @ts-ignore
  expect(getEmailInput().value).toBe(alice.email)
  // @ts-ignore
  expect(getBioInput().value).toBe(alice.bio)
})

describe("validates input", () => {
  const { email, image, bio } = dummy.userData()
  const baseData = { email, image, bio }

  async function executeTest(
    testData: Partial<typeof baseData>,
    errMsgPattern: RegExp
  ) {
    render(<SettingsForm current={alice} onSubmit={() => {}} />)
    await submitForm(Object.assign({}, baseData, testData))
    expect(await screen.findByText(errMsgPattern)).toBeInTheDocument()
  }

  it("rejects blank email", async () => {
    await executeTest({ email: "" }, /Email is required/)
  })

  it("rejects invalid email", async () => {
    await executeTest({ email: "blah@test" }, /Invalid email/)
  })

  it("rejects invalid image URL", async () => {
    await executeTest({ image: "blah" }, /Invalid image URL/)
  })
})

it("shows server validation message", async () => {
  const errMsg = "Email already exists"
  mockServer.use(
    mswRest.put(`${baseUrl}/user`, (req, res, ctx) =>
      res(ctx.status(422), ctx.json({ errors: { email: [errMsg] } }))
    )
  )

  renderProtectedRoute("/settings")
  const btnUpdate = screen.getByRole("button", { name: /Update Settings/ })
  await submitForm(dummy.userData())
  expect(await screen.findByText(/Email already exists/)).toBeInTheDocument()
})

// production code works but somehow this test fails
it("shows server unexpected error", async () => {
  mockServer.use(
    mswRest.put(`${baseUrl}/user`, (req, res, ctx) =>
      res(ctx.status(500, "a strange error"))
    )
  )

  jest.spyOn(console, "error").mockImplementation(() => {})
  renderProtectedRoute("/settings")
  await submitForm(dummy.userData())

  // prettier-ignore
  expect(await screen.findByText(/Unexpected error\. Please try again later\./)).toBeInTheDocument()
})

it("goes to logged in user's page after submission", async () => {
  const { email, image, bio } = dummy.userData()

  renderProtectedRoute("/settings")
  await submitForm({ email, image, bio })

  expect(await screen.findByText("My Articles")).toBeInTheDocument()
})
