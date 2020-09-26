// prettier-ignore
import React, { createContext, ReactElement, useContext, useEffect } from "react"
import { useLocalQuery, useMutation } from "react-kho"

import { User } from "../../common/types"
import { loggedInUserQuery } from "../../store/queries"
import { loginWithTokenMutation } from "../../store/mutations"

export const UserContext = createContext<User | null | undefined>(null)
export const useUser = () => useContext(UserContext)

function UserProvider(props: { children: ReactElement }) {
  const { data: user } = useLocalQuery(loggedInUserQuery)
  const [login] = useMutation(loginWithTokenMutation)

  useEffect(() => {
    login()
  }, [login])

  return (
    <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
  )
}

export default UserProvider
