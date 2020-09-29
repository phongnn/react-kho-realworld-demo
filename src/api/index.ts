import config from "../common/config"
import { ArticleListResult, Errors, LogInResult, User } from "../common/types"

const { baseUrl } = config.api

export async function getGlobalFeed(args: { limit: number; offset: number }) {
  const { limit, offset } = args
  const res = await fetch(`${baseUrl}/articles?limit=${limit}&offset=${offset}`)
  return (await res.json()) as ArticleListResult
}

export async function signInWithToken(args: { token: string }) {
  const res = await fetch(`${baseUrl}/user`, {
    headers: {
      authorization: `Token ${args.token}`,
    },
  })

  const {
    user: { token, ...rest },
  } = await res.json()
  return { token, user: setAvatarPlaceholder(rest) } as LogInResult
}

export async function signUp(args: {
  username: string
  email: string
  password: string
}) {
  const res = await fetch(`${baseUrl}/users`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user: args }),
  })

  if (res.status >= 200 && res.status < 300) {
    const {
      user: { token, ...rest },
    } = await res.json()
    return { token, user: setAvatarPlaceholder(rest) } as LogInResult
  } else if (res.status === 422) {
    return (await res.json()) as Errors
  } else {
    throw new Error(
      `Received status code ${res.status} (${res.statusText}) when signing up.`
    )
  }
}

function setAvatarPlaceholder(user: User) {
  const { image, ...rest } = user
  return image
    ? user
    : {
        image: "https://static.productionready.io/images/smiley-cyrus.jpg",
        ...rest,
      }
}
