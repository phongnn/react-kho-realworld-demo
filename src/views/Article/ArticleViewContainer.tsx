import React, { useEffect } from "react"
import { useHistory, useParams } from "react-router-dom"
import { useQuery, useMutation } from "react-kho"

import ArticleView from "./ArticleView/ArticleView"
import { useUser } from "../__shared__/UserProvider"
import { articleQuery } from "../../store/queries"
import {
  deleteArticleMutation,
  favoriteArticleMutation,
  followUserMutation,
} from "../../store/mutations"

export function ArticleViewContainer() {
  const user = useUser()
  const routerHistory = useHistory()
  const { slug } = useParams<{ slug: string }>()
  const { data: article, loading, error } = useQuery(articleQuery, {
    arguments: { slug },
  })
  const [setFavorite, { loading: processingFavorite }] = useMutation(
    favoriteArticleMutation
  )
  const [setFollowing, { loading: processingFollowing }] = useMutation(
    followUserMutation
  )
  // prettier-ignore
  const [deleteArticle, { loading: processingDelete, error: deletingError, called: deletingDone }] = useMutation(deleteArticleMutation)
  const deleted = deletingDone && !deletingError

  useEffect(() => {
    if (deleted) {
      routerHistory.push(`/users/${user?.username}`)
    }
  }, [deleted, user, routerHistory])

  return (
    <div className="article-page">
      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
      {error && <p style={{ textAlign: "center" }}>Error: {error.message}</p>}
      {article && (
        <ArticleView
          article={article}
          onFollowingToggle={(username, following) => {
            if (!user) {
              routerHistory.push("/signup")
            } else {
              setFollowing({ arguments: { username, following } })
            }
          }}
          onFavoriteToggle={(slug, favorited) => {
            if (!user) {
              routerHistory.push("/signup")
            } else {
              setFavorite({ arguments: { slug, favorited } })
            }
          }}
          onDelete={(slug) => {
            deleteArticle({ arguments: { slug } })
          }}
          processingFavorite={processingFavorite}
          processingFollowing={processingFollowing}
          processingDelete={processingDelete}
        />
      )}
    </div>
  )
}

export default ArticleViewContainer
