import React from "react"
import { Link } from "react-router-dom"

import { Article } from "../../../common/types"
import { formatDate, markdownToHtml } from "../../../common/helpers"
import { useUser } from "../../__shared__/UserProvider"
import ArticleComments from "./ArticleComments"

export function ArticleActions(props: {
  article: Partial<Article>
  onFollowingToggle: (username: string, following: boolean) => void
  onFavoriteToggle: (slug: string, favorited: boolean) => void
  onDelete: (slug: string) => void
  processingFavorite: boolean
  processingFollowing: boolean
  processingDelete: boolean
}) {
  const loggedInUser = useUser()
  const { slug, author, updatedAt, favorited, favoritesCount } = props.article
  const { username, image, following } = author!
  const isAuthor = loggedInUser?.username === username
  // prettier-ignore
  const processing = props.processingFavorite || props.processingFollowing || props.processingDelete

  return (
    <div className="article-meta">
      <Link to={`/users/${username}`}>
        <img src={image} alt={`Avatar of ${username}`} />
      </Link>
      <div className="info">
        <Link to={`/users/${username}`} className="author">
          {username}
        </Link>
        <span className="date">{formatDate(updatedAt!)}</span>
      </div>
      {isAuthor && (
        <>
          <Link
            to={`/edit/${slug}`}
            className="btn btn-sm btn-outline-secondary"
          >
            <i className="ion-edit"></i>
            &nbsp; Edit Article
          </Link>
          &nbsp;&nbsp;
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => props.onDelete(slug!)}
            disabled={processing}
          >
            <i className="ion-trash-a"></i>
            &nbsp; Delete Article
          </button>
        </>
      )}

      {!isAuthor && (
        <>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => props.onFollowingToggle(username!, !following)}
            disabled={processing}
          >
            <i className="ion-plus-round"></i>
            &nbsp; {`${following ? "Unfollow" : "Follow"} ${username}`}
          </button>
          &nbsp;&nbsp;
          <button
            className={`btn btn-sm ${
              favorited ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => props.onFavoriteToggle(slug!, !favorited)}
            disabled={processing}
          >
            <i className="ion-heart"></i>
            &nbsp; Favorite Post{" "}
            <span className="counter">({favoritesCount})</span>
          </button>
        </>
      )}
    </div>
  )
}

export function ArticleBody(props: { article: Partial<Article> }) {
  return (
    <div className="row article-content">
      <div className="col-md-12">
        <div
          dangerouslySetInnerHTML={{
            __html: markdownToHtml(props.article.body!),
          }}
        />
        <br />
        <ul className="tag-list">
          {props.article.tagList?.map((tag) => (
            <li key={tag} className="tag-default tag-pill tag-outline">
              <Link to={`/tags/${tag}`}>{tag}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function ArticleView(props: {
  article: Partial<Article>
  onFollowingToggle: (username: string, following: boolean) => void
  onFavoriteToggle: (slug: string, favorited: boolean) => void
  onDelete: (slug: string) => void
  processingFavorite?: boolean
  processingFollowing?: boolean
  processingDelete?: boolean
}) {
  const {
    article,
    onFollowingToggle,
    onFavoriteToggle,
    onDelete,
    processingFavorite = false,
    processingFollowing = false,
    processingDelete = false,
  } = props

  return (
    <>
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          <ArticleActions
            article={article}
            onFollowingToggle={onFollowingToggle}
            onFavoriteToggle={onFavoriteToggle}
            onDelete={onDelete}
            processingFavorite={processingFavorite}
            processingFollowing={processingFollowing}
            processingDelete={processingDelete}
          />
        </div>
      </div>
      <div className="container page">
        <ArticleBody article={article} />
        <hr />
        <div className="article-actions">
          <ArticleActions
            article={article}
            onFollowingToggle={onFollowingToggle}
            onFavoriteToggle={onFavoriteToggle}
            onDelete={onDelete}
            processingFavorite={processingFavorite}
            processingFollowing={processingFollowing}
            processingDelete={processingDelete}
          />
        </div>
        <ArticleComments article={article} />
      </div>
    </>
  )
}

export default ArticleView
