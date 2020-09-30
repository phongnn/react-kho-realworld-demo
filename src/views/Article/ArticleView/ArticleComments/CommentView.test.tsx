import React from "react"

import CommentView from "./CommentView"
import { formatDate } from "../../../../common/helpers"
import { allArticles } from "../../../../../testUtils/mocks/data"
import { renderWithRouter } from "../../../../../testUtils/render"

test("should render article comment with correct details", async () => {
  const comment = allArticles[0].comments[0]
  // prettier-ignore
  const { body, updatedAt, user: { username } } = comment

  const { getByText, getByRole } = renderWithRouter(
    <CommentView comment={comment} />
  )

  expect(getByText(body)).toBeInTheDocument()
  // prettier-ignore
  expect(getByRole("img", { name: `Avatar of ${username}` })).toBeInTheDocument()
  expect(getByRole("link", { name: username })).toBeInTheDocument()
  expect(getByText(formatDate(updatedAt))).toBeInTheDocument()
})
