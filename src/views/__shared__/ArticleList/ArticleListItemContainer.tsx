import React from "react"
import { Link, useHistory } from "react-router-dom"
import { useMutation } from "react-kho"

import config from "../../../common/config"
import { Article } from "../../../common/types"
import { formatDate } from "../../../common/helpers"
import { useUser } from "../UserProvider"
import { favoriteArticleMutation } from "../../../store/mutations"

function ArticleListItemView(props: {
  article: Partial<Article>
  onFavoriteToggle: (slug: string, favorite: boolean) => void
  processingFavorite?: boolean
}) {
  // prettier-ignore
  const { slug, title, description, updatedAt, author, favoriteCount, favorited } = props.article
  const { username, image } = author!
  const { processingFavorite = false } = props

  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link to={`/users/${username}`}>
          <img
            src={`${image || config.placeholders.avatar}`}
            alt={`Avatar of ${username}`}
          />
        </Link>
        <div className="info">
          <Link to={`/users/${username}`} className="author">
            {username}
          </Link>
          <span className="date">{formatDate(updatedAt!)}</span>
        </div>
        <button
          className={`btn btn-sm pull-xs-right ${
            favorited ? "btn-primary" : "btn-outline-primary"
          }`}
          data-testid={`btn-fav_${slug}`}
          onClick={() => props.onFavoriteToggle(slug!, !favorited)}
          disabled={processingFavorite}
        >
          <i className="ion-heart"></i> {favoriteCount}
        </button>
      </div>
      <Link to={`/articles/${slug}`} className="preview-link">
        <h1>{title}</h1>
        <p>{description}</p>
        <span>Read more...</span>
      </Link>
    </div>
  )
}

function ArticleListItemContainer(props: { article: Partial<Article> }) {
  const user = useUser()
  const routerHistory = useHistory()
  const [setFavorite, { loading: processingFavorite }] = useMutation(
    favoriteArticleMutation
  )

  return (
    <ArticleListItemView
      article={props.article}
      onFavoriteToggle={(slug, favorited) => {
        if (!user) {
          routerHistory.push("/signup")
        } else {
          setFavorite({ arguments: { slug, favorited } })
        }
      }}
      processingFavorite={processingFavorite}
    />
  )
}

export default ArticleListItemContainer
