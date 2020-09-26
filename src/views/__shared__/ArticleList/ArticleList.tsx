import React from "react"

import { Article } from "../../../common/types"
import ArticleListItemContainer from "./ArticleListItemContainer"

function Pagination(props: {
  currentPage: number
  totalPages: number
  onPageSelect: (page: number) => void
}) {
  const { totalPages, currentPage, onPageSelect } = props
  return (
    <nav>
      <ul className="pagination">
        {[...Array(totalPages)].map((_, index) => (
          <li
            key={index}
            className={`page-item ${index + 1 === currentPage ? "active" : ""}`}
          >
            <span
              className="page-link"
              role="link"
              onClick={() => onPageSelect(index + 1)}
            >
              {index + 1}
            </span>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function ArticleListView(props: {
  articles: Array<Partial<Article>>
  currentPage: number
  totalPages: number
  onPageSelect: (page: number) => void
}) {
  return (
    <>
      {props.articles.map((a) => (
        <ArticleListItemContainer key={a.slug} article={a} />
      ))}
      {props.totalPages > 1 && (
        <Pagination
          currentPage={props.currentPage}
          totalPages={props.totalPages}
          onPageSelect={props.onPageSelect}
        />
      )}
    </>
  )
}

export default ArticleListView
