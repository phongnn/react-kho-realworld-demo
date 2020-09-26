import config from "../common/config"
import { ArticleListResult, LogInResult } from "../common/types"

const { baseUrl } = config.api

export async function getGlobalFeed(args: { limit: number; offset: number }) {
  const { limit, offset } = args
  const res = await fetch(`${baseUrl}/articles?limit=${limit}&offset=${offset}`)
  return (await res.json()) as ArticleListResult
}

export async function loginWithToken(args: { token: string }) {
  const res = await fetch(`${baseUrl}/user`, {
    headers: {
      authorization: `Token ${args.token}`,
    },
  })

  const {
    user: { token, ...rest },
  } = await res.json()
  return { token, user: rest } as LogInResult
}
