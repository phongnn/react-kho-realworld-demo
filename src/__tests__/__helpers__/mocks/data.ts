import * as dummy from "../dummy"

export const alice = { ...dummy.userData(), username: "alice" }
export const bob = { ...dummy.userData(), username: "bob" }

export const aliceArticles = [...Array(13)].map((_) => ({
  ...dummy.articleData(),
  author: alice,
  comments: [
    { ...dummy.commentData(), author: bob },
    { ...dummy.commentData(), author: alice },
  ],
}))

export const bobArticles = [...Array(25)].map((_) => ({
  ...dummy.articleData(),
  author: bob,
  comments: [
    { ...dummy.commentData(), author: alice },
    { ...dummy.commentData(), author: bob },
    { ...dummy.commentData(), author: bob },
  ],
}))

export const allArticles = [...aliceArticles, ...bobArticles].sort(
  (a1, a2) => a2.updatedAt.getTime() - a1.updatedAt.getTime()
)

const tagFreq = allArticles.reduce((tmp: Record<string, number>, a) => {
  a.tagList.forEach((t) => (tmp[t] = (tmp[t] || 0) + 1))
  return tmp
}, {})

export const popularTags = Object.keys(tagFreq).sort(
  (t1, t2) => tagFreq[t2] - tagFreq[t1]
)

export function getArticlesByTag(tag: string) {
  return allArticles.filter((a) => a.tagList.includes(tag))
}

export function getFavArticles(username: string) {
  // for now simply returns the other person's articles as favorite
  return username === alice.username ? bobArticles : aliceArticles
}

export function getFeedArticles(username: string) {
  // for now simply returns the other person's articles
  return username === alice.username ? bobArticles : aliceArticles
}

export const accessToken = "4dda0f28d8f74c276185fe75b126ef54a7f67ff1"
