import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import config from "../../common/config"
import * as dummy from "../__helpers__/dummy"
import {
  server as mockServer,
  rest as mswRest,
} from "../__helpers__/mocks/server"
import { renderProtectedRoute } from "../__helpers__/render"

const { baseUrl } = config.api

const addTag = async (tag: string) => {
  userEvent.click(screen.getByText(/New Tag/))
  await userEvent.type(screen.getByPlaceholderText("Enter tag..."), tag)
  userEvent.click(screen.getByRole("button", { name: /Add/ }))
}

const submitForm = async (article: {
  title: string
  description: string
  body: string
  tagList: string[]
}) => {
  const { title, description, body, tagList } = article
  await userEvent.type(screen.getByPlaceholderText("Article Title"), title)
  // prettier-ignore
  await userEvent.type(screen.getByPlaceholderText("What's this article about?"), description)
  // prettier-ignore
  await userEvent.type(screen.getByPlaceholderText("Write your article (in markdown)"), body)
  for (let i = 0; i < tagList.length; i++) {
    await addTag(tagList[i])
  }
  userEvent.click(screen.getByRole("button", { name: "Publish Article" }))
}

describe("validates input", () => {
  const baseData = dummy.articleData()

  async function executeTest(
    testData: Partial<typeof baseData>,
    errMsgPattern: RegExp
  ) {
    renderProtectedRoute("/post")
    await submitForm(Object.assign({}, baseData, testData))
    expect(await screen.findByText(errMsgPattern)).toBeInTheDocument()
  }

  it("rejects blank title", async () => {
    await executeTest({ title: "" }, /Title is required/)
  })

  it("rejects title shorter than 3 characters", async () => {
    await executeTest({ title: "ab" }, /Title must have at least 3 characters/)
  })

  it("rejects title longer than 255 characters", async () => {
    await executeTest(
      { title: "a long title goes here".repeat(15) },
      /Title must not exceed 255 characters/
    )
  })

  it("rejects blank description", async () => {
    await executeTest({ description: "" }, /Description is required/)
  })

  it("rejects description shorter than 3 characters", async () => {
    await executeTest(
      { description: "be" },
      /Description must have at least 3 characters/
    )
  })

  it("rejects description longer than 1024 characters", async () => {
    await executeTest(
      { description: "a long description goes here... ".repeat(33) },
      /Description must not exceed 1024 characters/
    )
  })

  it("rejects blank body", async () => {
    await executeTest({ body: "" }, /Body is required/)
  })

  it("rejects body shorter than 3 characters", async () => {
    await executeTest({ body: "be" }, /Body must have at least 3 characters/)
  })

  // this test passes but is a bit slow
  xit("rejects body longer than 10000 characters", async () => {
    await executeTest(
      { body: "a very long article body goes here...".repeat(280) },
      /Body must not exceed 10000 characters/
    )
  })
})

describe("tag list", () => {
  it("adds new tag", async () => {
    const tag = "blah"
    renderProtectedRoute("/post")
    await addTag(tag)
    expect(screen.getByText(tag)).toBeInTheDocument()
  })

  it("ignore same tags", async () => {
    const tag = "blah"
    renderProtectedRoute("/post")
    await addTag(tag)
    await addTag(tag)
    expect(screen.getAllByText(tag).length).toBe(1)
  })

  it("removes tag from list", async () => {
    const tag = "blah"
    renderProtectedRoute("/post")
    await addTag(tag)
    userEvent.click(screen.getByTestId(`btn-delete-${tag}`))
    expect(screen.queryByText(tag)).not.toBeInTheDocument()
  })
})

it("shows unexpected server error", async () => {
  mockServer.use(
    mswRest.post(`${baseUrl}/articles`, (req, res, ctx) =>
      res(ctx.status(500, "Some unknown error"))
    )
  )

  jest.spyOn(console, "error").mockImplementation(() => {})
  renderProtectedRoute("/post")
  await submitForm(dummy.articleData())
  // prettier-ignore
  expect(await screen.findByText(/Unexpected error\. Please try again later\./)).toBeInTheDocument()
})

it("goes to article page after successful creation", async () => {
  const { title, description, body, tagList } = dummy.articleData()
  renderProtectedRoute("/post")
  await submitForm({ title, description, body, tagList })
  // prettier-ignore
  expect((await screen.findAllByRole("link", { name: /Edit Article/ }))[0]).toBeInTheDocument()
  expect(screen.getByText(title)).toBeInTheDocument()
  tagList.forEach((tag) => expect(screen.getByText(tag)).toBeInTheDocument())
})
