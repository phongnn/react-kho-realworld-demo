function getRequiredParam(param: string) {
  const paramValue = process.env[param]
  if (!paramValue) {
    throw new Error(`Environment variable not found: ${param}`)
  }
  return paramValue
}

const env = process.env.NODE_ENV || "development"
const config = {
  env,
  api: {
    baseUrl: getRequiredParam("REACT_APP_API_BASE_URL"),
  },
  pagination: {
    pageSize: parseInt(process.env.REACT_APP_PAGINATION_PAGE_SIZE || "10"),
  },
  placeholders: {
    avatar:
      process.env.REACT_APP_AVATAR_PLACEHOLDER_URL ||
      "https://static.productionready.io/images/smiley-cyrus.jpg",
  },
}

export default config
