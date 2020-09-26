import React, { useState } from "react"
import { useQuery } from "react-kho"

import config from "../../common/config"
import ArticleList from "../__shared__/ArticleList/ArticleList"
import { globalFeedQuery } from "../../store/queries"

const { pageSize } = config.pagination

function GlobalFeedContainer() {
  const [currentPage, setCurrentPage] = useState(1)
  const { loading, data, error } = useQuery(globalFeedQuery, {
    arguments: {
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    },
  })

  if (loading) {
    return <div style={{ paddingTop: 15 }}>Loading articles...</div>
  } else if (error) {
    return <div style={{ paddingTop: 15 }}>Error: {error.message}</div>
  } else if (data) {
    const { articleCount, articles } = data
    return articleCount === 0 ? (
      <div style={{ paddingTop: 15 }}>No articles found.</div>
    ) : (
      <ArticleList
        articles={articles}
        currentPage={currentPage}
        totalPages={Math.ceil(articleCount / pageSize)}
        onPageSelect={setCurrentPage}
      />
    )
  } else {
    return null
  }
}

export default GlobalFeedContainer
