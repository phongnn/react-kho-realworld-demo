import React, { useState } from "react"
import { useQuery } from "react-kho"

import config from "../../common/config"
import ArticleList from "../__shared__/ArticleList/ArticleList"
import { articlesByTagQuery } from "../../store/queries"

const { pageSize } = config.pagination

function TagViewContainer(props: { tag: string }) {
  const [currentPage, setCurrentPage] = useState(1)
  const { loading, error, data } = useQuery(articlesByTagQuery, {
    arguments: {
      tag: props.tag,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    },
  })

  if (loading) {
    return <p>Loading articles...</p>
  } else if (error) {
    return <p>Error: ${error.message}</p>
  } else if (data) {
    const { articles, articlesCount } = data
    return (
      <ArticleList
        articles={articles}
        currentPage={currentPage}
        totalPages={Math.ceil(articlesCount / pageSize)}
        onPageSelect={setCurrentPage}
      />
    )
  } else {
    return null
  }
}

export default TagViewContainer
