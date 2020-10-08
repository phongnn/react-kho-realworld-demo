import { screen, waitForElementToBeRemoved } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import config from "../../common/config"
import { renderRoute } from "../__helpers__/render"
import { alice, aliceArticles, getFavArticles } from "../__helpers__/mocks/data"
import {
  server as mockServer,
  rest as mswRest,
} from "../__helpers__/mocks/server"

const { username, bio } = alice
const userArticles = aliceArticles
const favArticles = getFavArticles(username)
const userPageUrl = `/users/${username}`
const { pageSize } = config.pagination
const { baseUrl } = config.api

describe("User info", () => {
  it("loads and renders user information", async () => {
    renderRoute(userPageUrl)

    expect(await screen.findByText(username)).toBeInTheDocument()
    expect(screen.getByText(bio)).toBeInTheDocument()
    expect(screen.getByRole("img", { name: username })).toBeInTheDocument()
  })

  it("redirects user to sign up when click on follow author", async () => {
    renderRoute(userPageUrl)
    userEvent.click(
      await screen.findByRole("button", { name: `Follow ${username}` })
    )
    expect(await screen.findByPlaceholderText("Username")).toBeInTheDocument()
  })
})

describe("User articles", () => {
  it("shows loading error", async () => {
    mockServer.use(
      mswRest.get(`${baseUrl}/articles?author=${username}`, (req, res, ctx) => {
        return res(ctx.status(500, "error for testing"))
      })
    )

    jest.spyOn(console, "error").mockImplementation(() => {})
    renderRoute(userPageUrl)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    expect(await screen.findByText(/error for testing/)).toBeInTheDocument()
  })

  it("shows blank article list", async () => {
    mockServer.use(
      mswRest.get(`${baseUrl}/articles?author=${username}`, (req, res, ctx) => {
        return res(ctx.json({ articlesCount: 0, articles: [] }))
      })
    )

    renderRoute(userPageUrl)
    expect(await screen.findByText("No articles found.")).toBeInTheDocument()
  })

  it("shows first page of the user's articles", async () => {
    renderRoute(userPageUrl)
    await waitForElementToBeRemoved(screen.getByText(/loading/i))

    userArticles
      .slice(0, pageSize)
      .forEach(async (a) =>
        expect(await screen.findByText(a.title)).toBeInTheDocument()
      )
  })

  it("goes to Favorite Articles screen when clicks on tab header", async () => {
    renderRoute(userPageUrl)
    const favTabHeader = screen.getByRole("link", {
      name: "Favorited Articles",
    })
    expect(favTabHeader).not.toHaveClass("active")
    userEvent.click(favTabHeader)
    expect(favTabHeader).toHaveClass("active")
  })
})

describe("Favorite articles", () => {
  const userFavUrl = `${userPageUrl}/favorite`

  it("shows loading error", async () => {
    mockServer.use(
      mswRest.get(
        `${baseUrl}/articles?favorited=${username}`,
        (req, res, ctx) => {
          return res(ctx.status(500, "error for testing"))
        }
      )
    )

    jest.spyOn(console, "error").mockImplementation(() => {})
    renderRoute(userFavUrl)
    expect(await screen.findByText(/loading/i)).toBeInTheDocument()
    expect(await screen.findByText(/error for testing/)).toBeInTheDocument()
  })

  it("shows first page of the user's favorite articles", async () => {
    renderRoute(userFavUrl)
    await waitForElementToBeRemoved(await screen.findByText(/loading/i))

    favArticles
      .slice(0, pageSize)
      .forEach(async (a) =>
        expect(await screen.findByText(a.title)).toBeInTheDocument()
      )
  })
})
