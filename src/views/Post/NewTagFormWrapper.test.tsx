import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import NewTagFormWrapper from "./NewTagFormWrapper"

const noOp = (tag: string) => {}

it("renders New Tag button by default", async () => {
  render(<NewTagFormWrapper onSubmit={noOp} />)
  expect(screen.getByText(/New Tag/)).toBeInTheDocument()
  expect(screen.queryByRole("textbox")).not.toBeInTheDocument()
})

describe("New Tag form", () => {
  function renderForm(handler = noOp) {
    render(<NewTagFormWrapper onSubmit={handler} />)
    userEvent.click(screen.getByText(/New Tag/))
  }

  async function renderFormAndSubmit(tag: string, handler = noOp) {
    renderForm(handler)
    await userEvent.type(screen.getByRole("textbox"), tag)
    userEvent.click(screen.getByRole("button", { name: /Add/ }))
  }

  it("shows form when click on New Tag button", async () => {
    renderForm()
    expect(screen.getByRole("textbox")).toBeInTheDocument()
  })

  it("closes form when click on Cancel", async () => {
    renderForm()

    userEvent.click(screen.getByRole("button", { name: "Cancel" }))
    expect(screen.getByText(/New Tag/)).toBeInTheDocument()
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument()
  })

  it("adds new tag and closes form", async () => {
    const tag = "blah"
    const handler = jest.fn()

    await renderFormAndSubmit(tag, handler)
    expect(handler).toBeCalledWith(tag)
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument()
  })

  it("ignores empty input values", async () => {
    const handler = jest.fn()
    await renderFormAndSubmit("   ", handler)
    expect(handler).not.toBeCalled()
  })
})
