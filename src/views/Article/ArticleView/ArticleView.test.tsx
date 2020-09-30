import React from "react"
import { screen } from "@testing-library/react"

import { ArticleBody, ArticleActions } from "./ArticleView"
import ArticleComments from "./ArticleComments"
import { formatDate } from "../../../common/helpers"
import { allArticles } from "../../../../testUtils/mocks/data"
import { renderWithProviders } from "../../../../testUtils/render"

const article = allArticles[0]
const noOp = () => {}

it("renders correct article actions", async () => {
  renderWithProviders(
    <ArticleActions
      article={article}
      onAuthorFollow={noOp}
      onFavoriteToggle={noOp}
      onDelete={noOp}
      processingDelete={false}
      processingFavorite={false}
    />
  )

  // prettier-ignore
  expect(screen.getByRole("img", { name: `Avatar of ${article.author.username}` })).toBeInTheDocument()
  // prettier-ignore
  expect(screen.getByRole("link", { name: article.author.username })).toBeInTheDocument()
  expect(screen.getByText(formatDate(article.updatedAt))).toBeInTheDocument()
  // prettier-ignore
  expect(screen.getByRole("button", { name: `Follow ${article.author.username}` })).toBeInTheDocument()
  // prettier-ignore
  expect(screen.getByRole("button", { name: `Favorite Post (${article.favoriteCount})` })).toBeInTheDocument()
})

it("renders article body from Markdown text plus the tags", async () => {
  renderWithProviders(
    <ArticleBody article={{ ...article, body: "### This is a heading" }} />
  )

  // prettier-ignore
  expect(screen.getByRole("heading", { name: "This is a heading" })).toBeInTheDocument()

  article.tags.forEach((tag) =>
    expect(screen.getByRole("link", { name: tag })).toBeInTheDocument()
  )
})

it("renders comment list", async () => {
  renderWithProviders(<ArticleComments article={article} />)

  article.comments.forEach(({ body }) =>
    expect(screen.getByText(body)).toBeInTheDocument()
  )

  expect(screen.getByRole("link", { name: "sign up" })).toBeInTheDocument()
})
