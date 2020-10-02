import React, { useState } from "react"
import { useQuery } from "react-kho"

import config from "../../common/config"
import ArticleList from "../__shared__/ArticleList/ArticleList"
import { yourFeedQuery } from "../../store/queries"
import { useUser } from "../__shared__/UserProvider"
import { Redirect } from "react-router-dom"

const { pageSize } = config.pagination

function YourFeedContainer() {
  const loggedInUser = useUser()
  const [currentPage, setCurrentPage] = useState(1)
  const { loading, data, error } = useQuery(yourFeedQuery, {
    arguments: {
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    },
  })

  if (!loggedInUser) {
    return <Redirect to="/signup" />
  } else if (loading) {
    return <div style={{ paddingTop: 15 }}>Loading articles...</div>
  } else if (error) {
    return <div style={{ paddingTop: 15 }}>Error: {error.message}</div>
  } else if (data) {
    const { articlesCount, articles } = data
    return articlesCount === 0 ? (
      <div style={{ paddingTop: 15 }}>No articles found.</div>
    ) : (
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

export default YourFeedContainer
