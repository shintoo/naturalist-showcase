import React from "react"

function PageController(props) {
    return (
        <div className="page-controller">
          <button
            className="page-button"
            disabled={props.page === 1}
            onClick={() => props.setPage(props.page-1)}>
            {"<"}
          </button>
          <span className="page-number">{props.page}</span>
          <button
            className="page-button"
            onClick={() => props.setPage(props.page+1)}>
            >
          </button>
        </div>
    )
}

export default PageController
