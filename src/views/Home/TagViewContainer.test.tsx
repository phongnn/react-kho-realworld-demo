import React from "react"
import {
  waitForElementToBeRemoved,
  screen,
  waitFor,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import TagViewContainer from "./TagViewContainer"
import { renderWithProviders } from "../../__tests__/__helpers__/render"
import { popularTags, getArticlesByTag } from "../../__tests__/__helpers__/data"

const pageSize = 3

test("should show articles for a specific tag", async () => {
  const tag = popularTags[0]
  const articles = getArticlesByTag(tag)
  const p1Articles = articles.slice(0, pageSize)
  // const p2Articles = articles.slice(pageSize, pageSize * 2)

  renderWithProviders(<TagViewContainer tag={tag} />)

  await waitForElementToBeRemoved(screen.getByText(/loading/i))
  expect(await screen.findByText(p1Articles[0].title)).toBeInTheDocument()
  // p1Articles.forEach(async (a) =>
  //   expect(await screen.findByText(a.title)).toBeInTheDocument()
  // )

  // userEvent.click(screen.getByRole("link", { name: "2" }))
  // await waitForElementToBeRemoved(screen.getByText(/loading/i))

  // expect(await screen.findByText(p2Articles[0].title)).toBeInTheDocument()
  // p2Articles.forEach(async (a) =>
  //   expect(await screen.findByText(a.title)).toBeInTheDocument()
  // )
})
