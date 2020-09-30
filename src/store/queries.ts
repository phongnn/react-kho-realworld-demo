import { LocalQuery, Query } from "react-kho"

import { User } from "../common/types"
import { ArticleType, UserType } from "./normalizedTypes"
import { getFavArticles, getGlobalFeed, getUser, getUserArticles } from "../api"

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

export const userInfoQuery = new Query(
  "UserInfo",
  (args: { username: string }) => getUser(args.username),
  {
    shape: UserType,
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
