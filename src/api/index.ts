import config from "../common/config"
import { ArticleListResult } from "../common/types"

const { baseUrl } = config.api
export function getGlobalFeed(args: {
  limit: number
  offset: number
}): Promise<ArticleListResult> {
  const { limit, offset } = args
  return fetch(
    `${baseUrl}/articles?limit=${limit}&offset=${offset}`
  ).then((res) => res.json())
}
