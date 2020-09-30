import { Mutation } from "react-kho"

import { followUser, unfollowUser } from "../../api"
import { UserType } from "../normalizedTypes"

export const followUserMutation = new Mutation(
  "FollowUser",
  (args: { username: string; following: boolean }) => {
    const { username, following } = args
    return following ? followUser(username) : unfollowUser(username)
  },
  {
    shape: UserType,
    afterQueryUpdates(store) {
      store.refetchQueries([]) // TODO: refetch "MyFeed"
    },
  }
)
