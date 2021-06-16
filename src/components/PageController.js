import React from "react"

function PageController(props) {
  if (props.finalPage === 0) {
    return null
  }

  return (
    <div className="page-controller">
      <button
         className="page-button"
         disabled={props.page === 1}
         onClick={() => props.setPage(props.page-1)}>
         {"<"}
       </button>
       <span className="page-number">{props.page} / {props.finalPage}</span>
       <button
         className="page-button"
         disabled={props.page === props.finalPage}
         onClick={() => props.setPage(props.page+1)}>
         >
       </button>
     </div>
    )
}

export default PageController
