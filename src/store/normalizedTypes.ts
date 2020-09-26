import { NormalizedType } from "react-kho"

export const UserType = NormalizedType.register("User", {
  keyFields: ["username"],
})

export const ArticleType = NormalizedType.register("Article", {
  keyFields: ["slug"],
  shape: { author: UserType },
})
