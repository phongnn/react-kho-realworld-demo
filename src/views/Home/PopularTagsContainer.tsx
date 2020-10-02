import React from "react"
import { Link } from "react-router-dom"
import { useQuery } from "react-kho"

import { popularTagsQuery } from "../../store/queries"

function PopularTagsContainer() {
  const { loading, data: tags } = useQuery(popularTagsQuery)
  return (
    <div className="sidebar">
      {loading && <p>Loading tags...</p>}
      {tags && (
        <>
          <p>Popular Tags</p>
          <div className="tag-list">
            {tags.map((tag) => (
              <Link
                key={tag}
                to={`/tags/${tag}`}
                className="tag-pill tag-default"
              >
                {tag}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default PopularTagsContainer
