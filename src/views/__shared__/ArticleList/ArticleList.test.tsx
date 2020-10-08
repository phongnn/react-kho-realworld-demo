import React from "react"
import { screen } from "@testing-library/react"

import ArticleList from "./ArticleList"
import ArticleListItemContainer from "./ArticleListItemContainer"
import { formatDate } from "../../../common/helpers"
import { allArticles } from "../../../__tests__/__helpers__/data"
import { renderWithProviders } from "../../../__tests__/__helpers__/render"

const noOp = () => {}

it("renders article list item", function () {
  const article = allArticles[0]
  // prettier-ignore
  const { title, description, updatedAt, author: { username } } = article

  renderWithProviders(<ArticleListItemContainer article={article} />)

  expect(screen.getByText(title)).toBeInTheDocument()
  expect(screen.getByText(description)).toBeInTheDocument()
  expect(screen.getByText(username)).toBeInTheDocument()
  expect(screen.getByAltText(`Avatar of ${username}`)).toBeInTheDocument()
  expect(screen.getByText(formatDate(updatedAt))).toBeInTheDocument()
})

it("renders article list with pagination", function () {
  const articles = allArticles.slice(0, 10)

  renderWithProviders(
    <ArticleList
      articles={articles}
      currentPage={2}
      totalPages={3}
      onPageSelect={noOp}
    />
  )

  articles.forEach((a) => expect(screen.getByText(a.title)).toBeInTheDocument())

  expect(screen.getByRole("link", { name: "1" })).toBeInTheDocument()
  expect(screen.getByRole("link", { name: "3" })).toBeInTheDocument()
  expect(screen.queryByRole("link", { name: "4" })).not.toBeInTheDocument()
})

it("renders article list with NO pagination", function () {
  renderWithProviders(
    <ArticleList
      articles={allArticles.slice(0, 5)}
      currentPage={1}
      totalPages={1}
      onPageSelect={noOp}
    />
  )

  expect(screen.queryByRole("link", { name: "1" })).not.toBeInTheDocument()
})
