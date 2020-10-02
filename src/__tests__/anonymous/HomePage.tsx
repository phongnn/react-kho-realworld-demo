import {
  waitForElementToBeRemoved,
  screen,
  waitForDomChange,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import config from "../../common/config"
import { renderRoute } from "../../../testUtils/render"
import {
  popularTags,
  getArticlesByTag,
  allArticles,
} from "../../../testUtils/mocks/data"

const { pageSize } = config.pagination

test("renders home page with global feed and list of popular tags", async () => {
  renderRoute("/")

  expect(screen.getByText("Global Feed")).toBeInTheDocument()
  expect(screen.queryByText("Your Feed")).not.toBeInTheDocument()

  await waitForElementToBeRemoved(screen.queryByText(/loading tags/i))

  popularTags.forEach((tag) =>
    expect(screen.getByRole("link", { name: tag })).toBeInTheDocument()
  )
})

test("brings user to article page when click on an article title", async () => {
  const { title, description } = allArticles[0]
  renderRoute("/")
  await waitForElementToBeRemoved(screen.queryByText(/loading articles/i))

  userEvent.click(screen.getByRole("heading", { name: title }))
  await waitForElementToBeRemoved(screen.queryByText(/loading/i))

  expect(screen.getByText(title)).toBeInTheDocument()
  expect(screen.queryByText(description)).not.toBeInTheDocument()
})

test("brings user to tag page when click on a tag ", async () => {
  const tag = popularTags[0]
  const page1Articles = getArticlesByTag(tag).slice(0, pageSize)

  renderRoute("/")

  userEvent.click(await screen.findByRole("link", { name: tag }))
  await waitForElementToBeRemoved(screen.getByText(/loading articles/i))

  expect(await screen.findByText(page1Articles[0].title)).toBeInTheDocument()
  // for (let i = 0; i < page1Articles.length; i++) {
  //   expect(await screen.findByText(page1Articles[i].title)).toBeInTheDocument()
  // }
})

test("goes to Global Feed from tag page", async () => {
  renderRoute(`/tags/${popularTags[0]}`)
  await waitForElementToBeRemoved(screen.getByText(/loading articles/i))

  userEvent.click(screen.getByText("Global Feed"))
  await waitForElementToBeRemoved(screen.getByText(/loading articles/i))

  allArticles
    .slice(0, pageSize)
    .forEach(async (a) => expect(screen.getByText(a.title)).toBeInTheDocument())
})

test("redirects user to signup when click on article Favorite button", async () => {
  renderRoute("/")
  await waitForElementToBeRemoved(screen.getByText(/loading articles/i))

  userEvent.click(screen.getByTestId(`btn-fav_${allArticles[0].slug}`))

  expect(await screen.findByPlaceholderText("Username")).toBeInTheDocument()
})

test("goes to User page when click on a user", async () => {
  const { username } = allArticles[0].author

  renderRoute("/")
  await waitForElementToBeRemoved(screen.getByText(/loading articles/i))

  userEvent.click(screen.getAllByRole("link", { name: username })[0])
  expect(screen.getByText("My Articles")).toBeInTheDocument()
  expect(screen.getByText("Favorited Articles")).toBeInTheDocument()
})
