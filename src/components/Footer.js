import React from "react"

function Footer() {
  return (
    <div className="footer">
      <a href="https://github.com/shintoo/naturalist-showcase">
        <img alt="github" height="20" width="20" src="https://unpkg.com/simple-icons@v5/icons/github.svg" /> <span>by Sean Rapp</span>
      </a>
      <a href="https://www.inaturalist.org/">
        <img alt="inaturalist logo" height="20" width="20" src="https://static.inaturalist.org/sites/1-favicon.png" /> <span>powered by iNaturalist</span>
      </a>
    </div>
  )
}

export default Footer
