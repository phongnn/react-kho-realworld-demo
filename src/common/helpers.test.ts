import { formatDate, markdownToHtml } from "./helpers"

describe("formatDate", function () {
  it("returns correct string", function () {
    const d = new Date(2020, 6, 1)
    expect(formatDate(d)).toBe("July 1, 2020")
  })
})

describe("markdownToHtml", () => {
  test("should convert text correctly", () => {
    const md = "### This is a heading\n\n* A list item\n* Another item"

    const html = markdownToHtml(md)
    expect(html).toMatch('<h3 id="this-is-a-heading">This is a heading</h3>')
    expect(html).toMatch("<li>Another item</li>")
  })
})
