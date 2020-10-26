import faker from "faker/locale/en"

const tags = faker.random.words(2).split(" ")

function randomTags() {
  const n = faker.random.number(tags.length)
  const selectedTags = [...Array(n)].map((_) => faker.random.arrayElement(tags))
  return Array.from(new Set(selectedTags))
}

export function userData() {
  const username = faker.internet.userName().toLowerCase()
  return {
    username,
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password(),
    bio: faker.lorem.paragraph(3),
    image: `https://i.pravatar.cc/150?u=${username}`,
  }
}

export function articleData() {
  return {
    slug: faker.random.words(3).toLowerCase().replace(/\s/g, "-"),
    title: faker.random.words(Math.max(1, faker.random.number(10))),
    description: faker.lorem.sentences(2),
    body: faker.lorem.paragraphs(3),
    tagList: randomTags(),
    createdAt: faker.date.past(),
    updatedAt: new Date(),
    favoritesCount: faker.random.number(100),
  }
}

export function commentData() {
  return {
    id: faker.random.uuid(),
    body: faker.lorem.paragraphs(1),
    createdAt: faker.date.past(),
    updatedAt: new Date(),
  }
}
