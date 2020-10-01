export interface Article {
  slug: string
  title: string
  description: string
  body: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  favoriteCount: number
  favorited: boolean
  author: Partial<User>
  comments?: Array<Partial<Comment>>
}

export interface User {
  username: string
  email: string
  image: string
  bio?: string | null
  following?: boolean
}

export interface Comment {
  id: string
  body: string
  createdAt: Date
  updatedAt: Date
  author: Partial<User>
}

export interface ArticleListResult {
  articlesCount: number
  articles: Array<{
    slug: string
    title: string
    description: string
    updatedAt: Date
    favorited: boolean
    favoriteCount: number
    author: {
      username: string
      image: string
    }
  }>
}

export interface LogInResult {
  token: string
  user: {
    id: number
    username: string
    email: string
    image: string
    bio: string | null
    createdAt: Date
    updatedAt: Date
  }
}

export interface Errors {
  errors: Record<string, string | string[]>
}
