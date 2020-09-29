import { LocalQuery, Query } from "react-kho"

import { User } from "../common/types"
import { ArticleType, UserType } from "./normalizedTypes"
import { getGlobalFeed } from "../api"

export const globalFeedQuery = new Query("GlobalFeed", getGlobalFeed, {
  shape: { articles: [ArticleType] },
})

export const signedInUserQuery = new LocalQuery<User>("SignedInUser", {
  shape: UserType,
})
