import { waitForElementToBeRemoved, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import config from "../../common/config"
import { renderRoute } from "../__helpers__/render"
import { allArticles } from "../__helpers__/data"
import { server as mockServer, rest as mswRest } from "../__helpers__/server"

const { baseUrl } = config.api
const { slug, title, author, favoritesCount } = allArticles[0]

it("loads and shows article", async () => {
  renderRoute(`/articles/${slug}`)
  await waitForElementToBeRemoved(screen.getByText(/loading/i))
  expect(screen.getByText(title)).toBeInTheDocument()
})

it("shows data loading error", async () => {
  const errMsg = "Some strange error"
  mockServer.use(
    mswRest.get(`${baseUrl}/articles/${slug}`, (req, res, ctx) => {
      return res(ctx.status(500, errMsg))
    })
  )

  jest.spyOn(console, "error").mockImplementation(() => {})
  renderRoute(`/articles/${slug}`)
  expect(await screen.findByText(/Some strange error/)).toBeInTheDocument()
})

test("redirects user to sign up when click on follow author", async () => {
  renderRoute(`/articles/${slug}`)
  await waitForElementToBeRemoved(screen.getByText(/loading/i))

  userEvent.click(
    screen.getAllByRole("button", { name: `Follow ${author.username}` })[0]
  )
  expect(await screen.findByPlaceholderText("Username")).toBeInTheDocument()
})

test("redirects user to sign up when click on favorite article", async () => {
  renderRoute(`/articles/${slug}`)
  await waitForElementToBeRemoved(screen.getByText(/loading/i))

  userEvent.click(
    screen.getAllByRole("button", {
      name: `Favorite Post (${favoritesCount})`,
    })[0]
  )
  expect(await screen.findByPlaceholderText("Username")).toBeInTheDocument()
})
