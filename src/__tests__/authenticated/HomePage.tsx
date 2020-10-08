import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import config from "../../common/config"
import { saveAccessToken } from "../../accessToken"
import { renderProtectedRoute, renderRoute } from "../__helpers__/render"
import { alice, allArticles, getFeedArticles } from "../__helpers__/data"

it("shows home page for anonymous user if token is invalid", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {})
  saveAccessToken("blah")
  renderRoute("/")

  await waitForElementToBeRemoved(screen.getByText(/loading articles/i))
  // prettier-ignore
  expect(await screen.findByRole("link", { name: "Sign up" })).toBeInTheDocument()
  // expect(getAccessToken()).toBeFalsy()
})

it("shows home page for logged in user if token is valid", async () => {
  renderProtectedRoute("/")

  await waitForElementToBeRemoved(screen.getByText(/loading articles/i))
  // prettier-ignore
  expect(await screen.findByRole("link", { name: "Settings" })).toBeInTheDocument()
})

it("toggles article's Favorite status", async () => {
  const { slug, favoriteCount } = allArticles[0]

  renderProtectedRoute("/")
  const btnFavToggle = await screen.findByTestId(`btn-fav_${slug}`)

  userEvent.click(btnFavToggle)
  expect(btnFavToggle).toBeDisabled()

  await waitFor(() => expect(btnFavToggle).not.toBeDisabled())
  expect(btnFavToggle).toHaveClass("btn-primary")
  expect(btnFavToggle.textContent).toMatch(`${favoriteCount + 1}`)
})

it("goes to New Post when click on the link", async () => {
  renderProtectedRoute("/")
  userEvent.click(await screen.findByRole("link", { name: "New Post" }))
  // prettier-ignore
  expect(screen.getByRole("button", { name: "Publish Article" })).toBeInTheDocument()
})

it("goes to Settings when click on the link", async () => {
  renderProtectedRoute("/")
  userEvent.click(await screen.findByRole("link", { name: "Settings" }))
  // prettier-ignore
  expect(screen.getByRole("button", { name: "Update Settings" })).toBeInTheDocument()
})

it("goes to logged in user's page when click on link", async () => {
  renderProtectedRoute("/")

  // prettier-ignore
  userEvent.click(await screen.findByRole("link", { name: new RegExp(alice.username) }))
  // prettier-ignore
  expect(await screen.findByRole("link", { name: /Edit Profile Settings/ })).toBeInTheDocument()
})

it("shows feed when click on Your Feed link", async () => {
  renderProtectedRoute("/")

  userEvent.click(await screen.findByRole("link", { name: "Your Feed" }))
  await waitForElementToBeRemoved(screen.getByText(/loading articles/i))

  getFeedArticles(alice.username)
    .slice(0, config.pagination.pageSize)
    .forEach(async (a) =>
      expect(await screen.findByText(a.title)).toBeInTheDocument()
    )
})
