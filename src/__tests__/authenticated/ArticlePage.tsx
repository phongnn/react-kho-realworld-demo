import { act } from "react-dom/test-utils"
import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { renderProtectedRoute } from "../__helpers__/render"
import {
  allArticles,
  aliceArticles,
  bobArticles,
  alice,
  bob,
} from "../__helpers__/mocks/data"
import {
  server as mockServer,
  rest as mswRest,
} from "../__helpers__/mocks/server"
import config from "../../common/config"

const { baseUrl } = config.api

it("toggles article's Favorite status", async () => {
  const { slug, favoriteCount } = allArticles[0]

  renderProtectedRoute(`/articles/${slug}`)
  await waitForElementToBeRemoved(screen.getByText(/loading/i))

  // prettier-ignore
  const btnFavToggle = screen.getAllByRole("button", { name: /Favorite Post/ })[0]
  userEvent.click(btnFavToggle)
  expect(btnFavToggle).toBeDisabled()
  await waitFor(() => expect(btnFavToggle).toBeEnabled())
  expect(btnFavToggle.textContent).toMatch(`(${favoriteCount + 1})`)
})

it("toggles state of following author", async () => {
  renderProtectedRoute(`/articles/${bobArticles[0].slug}`)
  await waitForElementToBeRemoved(screen.getByText(/loading/i))

  // prettier-ignore
  const btnToggle = screen.getAllByRole("button", { name: `Follow ${bob.username}` })[0]
  userEvent.click(btnToggle)

  // prettier-ignore
  await waitFor(() => expect(btnToggle.textContent).toMatch(new RegExp(`Unfollow ${bob.username}`)))
})

it("goes to article edit screen when click on edit button", async () => {
  const { slug, title } = aliceArticles[0]

  renderProtectedRoute(`/articles/${slug}`)
  await waitForElementToBeRemoved(screen.getByText(/loading/i))
  userEvent.click(
    (await screen.findAllByRole("link", { name: /Edit Article/ }))[0]
  )

  // prettier-ignore
  // @ts-ignore
  expect((await screen.findByPlaceholderText("Article Title")).value).toBe(title)
})

it("deletes article and goes to user's page when click on delete button", async () => {
  const { slug, title } = aliceArticles[0]

  renderProtectedRoute(`/articles/${slug}`)
  userEvent.click(
    (await screen.findAllByRole("button", { name: /Delete Article/ }))[0]
  )

  expect(await screen.findByText("My Articles")).toBeInTheDocument()
  await waitForElementToBeRemoved(screen.getByText(/loading/i))
  expect(screen.queryByText(title)).not.toBeInTheDocument()
})

describe("creating comment", () => {
  const { slug } = bobArticles[0]

  async function renderFormAndSubmitComment(comment: string) {
    renderProtectedRoute(`/articles/${slug}`)
    const textarea = await screen.findByPlaceholderText("Write a comment...")
    // await userEvent.type(textarea, comment)
    userEvent.paste(textarea, comment)
    userEvent.click(screen.getByRole("button", { name: /Post Comment/ }))
  }

  it("rejects blank comment", async () => {
    await act(() => renderFormAndSubmitComment(""))
    expect(screen.getByText(/Please enter your comment/i)).toBeInTheDocument()
  })

  it("shows unexpected server error", async () => {
    mockServer.use(
      mswRest.post(`${baseUrl}/articles/${slug}/comments`, (req, res, ctx) =>
        res(ctx.status(500, "Some unknown error"))
      )
    )

    jest.spyOn(console, "error").mockImplementation(() => {})
    await act(() => renderFormAndSubmitComment("A normal comment..."))
    // prettier-ignore
    expect(await screen.findByText(/Unexpected error\. Please try again later\./)).toBeInTheDocument()
  })

  it("creates comment successfully", async () => {
    const comment = "a comment goes here..."
    await act(() => renderFormAndSubmitComment(comment))
    expect(await screen.findByText(comment)).toBeInTheDocument()
  })
})

describe("deleting comment", () => {
  const { slug, comments } = bobArticles[0]
  const comment = comments.find((c) => c.author.username === alice.username)!
  const otherComment = comments.find(
    (c) => c.author.username !== alice.username
  )!

  it("shows delete button for own comments only", async () => {
    renderProtectedRoute(`/articles/${slug}`)
    await waitForElementToBeRemoved(screen.getByText(/loading/i))

    // prettier-ignore
    expect(await screen.findByTestId(`btn-delete-${comment.id}`)).toBeInTheDocument()
    // prettier-ignore
    expect(screen.queryByTestId(`btn-delete-${otherComment.id}`)).not.toBeInTheDocument()
  })

  it("deletes comment successfully", async () => {
    renderProtectedRoute(`/articles/${slug}`)
    userEvent.click(await screen.findByTestId(`btn-delete-${comment.id}`))
    await waitForElementToBeRemoved(screen.getByText(comment.body))
  })
})
