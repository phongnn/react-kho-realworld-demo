export interface Article {
  slug: string
  title: string
  description: string
  body: string
  tags?: string[]
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
  user: Partial<User>
}

export interface ArticleListResult {
  articleCount: number
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
    image: string | null
    bio: string | null
    createdAt: Date
    updatedAt: Date
  }
}
