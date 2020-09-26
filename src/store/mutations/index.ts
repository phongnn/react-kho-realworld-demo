import { Mutation } from "react-kho"
import {
  getAccessToken,
  removeAccessToken,
  saveAccessToken,
} from "../../accessToken"

import { loginWithToken } from "../../api"
import { loggedInUserQuery } from "../queries"
import { UserType } from "../normalizedTypes"

export const loginWithTokenMutation = new Mutation(
  "loginWithToken",
  async () => {
    const token = getAccessToken()
    if (token) {
      return await loginWithToken({ token })
    }
  },
  {
    shape: {
      user: UserType,
    },
    afterQueryUpdates(store, { mutationResult }) {
      if (mutationResult) {
        const { user, token } = mutationResult
        store.setQueryData(loggedInUserQuery, user)
        saveAccessToken(token)
      } else {
        removeAccessToken()
      }
    },
  }
)
