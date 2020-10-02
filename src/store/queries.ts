import { LocalQuery, Query } from "react-kho"

import { User } from "../common/types"
import { ArticleType, UserType } from "./normalizedTypes"
import {
  getArticle,
  getArticlesByTag,
  getFavArticles,
  getGlobalFeed,
  getPopularTags,
  getUser,
  getUserArticles,
  getYourFeed,
} from "../api"

export const signedInUserQuery = new LocalQuery<User>("SignedInUser", {
  shape: UserType,
})

// prettier-ignore
export const globalFeedQuery = new Query(
  "GlobalFeed",
  (args: { limit: number; offset: number }) => getGlobalFeed(args.limit, args.offset),
  {
    shape: { articles: [ArticleType] },
  }
)

// prettier-ignore
export const yourFeedQuery = new Query(
  "YourFeed",
  (args: { limit: number; offset: number }) => getYourFeed(args.limit, args.offset),
  {
    shape: { articles: [ArticleType] },
  }
)

export const popularTagsQuery = new Query("PopularTags", getPopularTags)

export const articlesByTagQuery = new Query(
  "ArticlesByTag",
  (args: { tag: string; limit: number; offset: number }) =>
    getArticlesByTag(args.tag, args.limit, args.offset),
  {
    shape: { articles: [ArticleType] },
  }
)

export const userInfoQuery = new Query(
  "UserInfo",
  (args: { username: string }) => getUser(args.username),
  {
    shape: UserType,
  }
)

export const articleQuery = new Query(
  "Article",
  (args: { slug: string }) => getArticle(args.slug),
  {
    shape: ArticleType,
  }
)

export const userArticlesQuery = new Query(
  "UserArticles",
  (args: { username: string; limit: number; offset: number }) =>
    getUserArticles(args.username, args.limit, args.offset),
  {
    shape: { articles: [ArticleType] },
  }
)

export const favArticlesQuery = new Query(
  "FavoriteArticles",
  (args: { username: string; limit: number; offset: number }) =>
    getFavArticles(args.username, args.limit, args.offset),
  {
    shape: { articles: [ArticleType] },
  }
)
