import { screen, waitForElementToBeRemoved } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import config from "../../common/config"
import * as dummy from "../__helpers__/dummy"
import {
  server as mockServer,
  rest as mswRest,
} from "../__helpers__/mocks/server"
import { renderProtectedRoute } from "../__helpers__/render"
import { aliceArticles } from "../__helpers__/mocks/data"

const { baseUrl } = config.api

const article = aliceArticles[0]

const getTitleInput = () => screen.getByPlaceholderText("Article Title")
const getDescInput = () =>
  screen.getByPlaceholderText("What's this article about?")
const getBodyInput = () =>
  screen.getByPlaceholderText("Write your article (in markdown)")

const addTag = async (tag: string) => {
  userEvent.click(screen.getByText(/New Tag/))
  await userEvent.type(screen.getByPlaceholderText("Enter tag..."), tag)
  userEvent.click(screen.getByRole("button", { name: /Add/ }))
}

const submitForm = async (input: {
  title: string
  description: string
  body: string
  tagList: string[]
}) => {
  const { title, description, body, tagList } = input

  userEvent.clear(getTitleInput())
  await userEvent.type(getTitleInput(), title)

  userEvent.clear(getDescInput())
  await userEvent.type(getDescInput(), description)

  userEvent.clear(getBodyInput())
  await userEvent.type(getBodyInput(), body)

  for (let i = 0; i < tagList.length; i++) {
    await addTag(tagList[i])
  }

  userEvent.click(screen.getByRole("button", { name: "Publish Article" }))
}

describe("loading article", () => {
  it("shows loading state", async () => {
    renderProtectedRoute(`/edit/${article.slug}`)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it("shows loading error", async () => {
    const errMsg = "Some strange error"
    mockServer.use(
      mswRest.get(`${baseUrl}/articles/${article.slug}`, (req, res, ctx) => {
        return res(ctx.status(500, errMsg))
      })
    )

    jest.spyOn(console, "error").mockImplementation(() => {})
    renderProtectedRoute(`/edit/${article.slug}`)
    expect(await screen.findByText(/Some strange error/)).toBeInTheDocument()
  })

  it("shows edit screen", async () => {
    const { slug, title, description, body } = article

    renderProtectedRoute(`/edit/${slug}`)
    await waitForElementToBeRemoved(screen.getByText(/loading/i))

    // @ts-ignore
    expect(getTitleInput().value).toBe(title)
    // @ts-ignore
    expect(getDescInput().value).toBe(description)
    // @ts-ignore
    // expect(getBodyInput().value).toBe(body)
  })
})

it("shows unexpected server error", async () => {
  mockServer.use(
    mswRest.put(`${baseUrl}/articles/${article.slug}`, (req, res, ctx) =>
      res(ctx.status(500, "Some unknown error"))
    )
  )

  jest.spyOn(console, "error").mockImplementation(() => {})
  renderProtectedRoute(`/edit/${article.slug}`)
  await waitForElementToBeRemoved(screen.getByText(/loading/i))
  await submitForm(dummy.articleData())

  // prettier-ignore
  expect(await screen.findByText(/Unexpected error\. Please try again later\./)).toBeInTheDocument()
})

it("goes to article page after successful update", async () => {
  const { title, description, body, tagList } = dummy.articleData()

  renderProtectedRoute(`/edit/${article.slug}`)
  await waitForElementToBeRemoved(screen.getByText(/loading/i))

  article.tagList.forEach((tag) =>
    userEvent.click(screen.getByTestId(`btn-delete-${tag}`))
  )
  await submitForm({ title, description, body, tagList })

  // prettier-ignore
  expect((await screen.findAllByRole("link", { name: /Edit Article/ }))[0]).toBeInTheDocument()
  // expect(screen.getByText(title)).toBeInTheDocument()
  // tagList.forEach((tag) => expect(screen.getByText(tag)).toBeInTheDocument())
})
