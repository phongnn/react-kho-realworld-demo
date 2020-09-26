import marked from "marked"

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

// 30 Jul 2020: it should always be Date but in test environment, somehow
// the type policies for Apollo Client don't run to transform timestamps to Date
export function formatDate(d: Date | number | string) {
  const date = d instanceof Date ? d : new Date(d)
  const day = date.getDate()
  const monthName = MONTH_NAMES[date.getMonth()]
  const year = date.getFullYear()
  return `${monthName} ${day}, ${year}`
}

export const markdownToHtml = (mdText: string) => {
  return marked(mdText)
}
