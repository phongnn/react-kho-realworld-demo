import React from "react"
import { useHistory, NavLink } from "react-router-dom"
import { useQuery, useMutation } from "react-kho"

import config from "../../common/config"
import { User } from "../../common/types"
import { useUser } from "../__shared__/UserProvider"
import { userInfoQuery } from "../../store/queries"
import { followUserMutation } from "../../store/mutations"

function UserInfo(props: {
  user: Partial<User>
  onFollowingToggle: (username: string, following: boolean) => void
  isLoggedInUser: boolean
  processFollowing: boolean
}) {
  // prettier-ignore
  const { user, onFollowingToggle, isLoggedInUser, processFollowing } = props
  const { username, image, bio, following } = user
  return (
    <div className="user-info">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <img
              src={image || config.placeholders.avatar}
              className="user-img"
              alt={username}
            />
            <h4>{username}</h4>
            <p>{bio}</p>
            {!isLoggedInUser && (
              <button
                className="btn btn-sm btn-outline-secondary action-btn"
                onClick={() => onFollowingToggle(username!, !following)}
                disabled={processFollowing}
              >
                <i className="ion-plus-round"></i>
                &nbsp; {following ? "Unfollow" : "Follow"} {username}
              </button>
            )}
            {isLoggedInUser && (
              <NavLink
                className="btn btn-sm btn-outline-secondary action-btn"
                to="/settings"
              >
                <i className="ion-gear-a"></i>
                &nbsp; Edit Profile Settings
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function UserInfoContainer(props: { username: string }) {
  const { username } = props
  const loggedInUser = useUser()
  const browserHistory = useHistory()
  const { data: user } = useQuery(userInfoQuery, { arguments: { username } })
  const [setFollowing, { loading: processingFollowing }] = useMutation(
    followUserMutation
  )

  return user ? (
    <UserInfo
      user={user}
      isLoggedInUser={username === loggedInUser?.username}
      onFollowingToggle={(username, following) => {
        if (!loggedInUser) {
          browserHistory.push("/signup")
        } else {
          setFollowing({
            arguments: { username, following },
          })
        }
      }}
      processFollowing={processingFollowing}
    />
  ) : null
}

export default UserInfoContainer
