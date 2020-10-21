import { Mutation } from "react-kho"

import { followUser, unfollowUser } from "../../api"
import { UserType } from "../normalizedTypes"
import { yourFeedQuery } from "../queries"

export const followUserMutation = new Mutation(
  "FollowUser",
  (args: { username: string; following: boolean }) => {
    const { username, following } = args
    return following ? followUser(username) : unfollowUser(username)
  },
  {
    resultShape: UserType,
    afterQueryUpdates(store) {
      store.refetchQueries([yourFeedQuery])
    },
  }
)
