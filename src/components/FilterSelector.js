import React, { useState } from "react"

let filters = [
  {
    color: "#759133",
    id: 47126, name: "Plantae",
  },
  {
    color: "#914A33",
    id: 1, name: "Animalia",
  },
  {
    color: "#D4DADD",
    id: 3, name: "Aves",
  },
  {
    color: "#D289DC",
    id: 47125, name: "Angiospermae",
  },
  {
    color: "#1B1E54",
    id: 47120, name: "Arthropoda",
  },
]

// Uncomment out commented-out sections for checkbox-like filtering,
// Currently is radiobuttion-like filtering
function FilterSelector(props) {
  const filterClickHandler = (event, id) => {
    event.preventDefault()
    props.resetPage()
    console.log("clicked filter ", id, "filters: ", props.filters)
    if (!props.filters.includes(id)) {
//      props.setFilters([ ...props.filters, id ])
      props.setFilters([id])
      console.log("added id to filters")
      return
    }

//    let newFilters = [ ...props.filters ]
//    newFilters.splice(props.filters.indexOf(id), 1)
//    props.setFilters(newFilters)
    props.setFilters([])
    console.log("removed id from filters")
  }

  const filterButtons = filters.map((f, index) => {
    const classes = ["filter-button"]
    let selected = false

    const selectedStyle = {
      backgroundColor: "#fff",
      borderColor: f.color,
      borderWidth: "8px",
    }

    const unselectedStyle = {
      backgroundColor: f.color,
      borderWidth: "0px",
    }

    if (props.filters.includes(f.id))
      selected = true

    return (
      <div className="filter-container">
        <div key={index}
         className={classes.join(" ")}
         style={selected ? selectedStyle : unselectedStyle}
         onClick={(event) => filterClickHandler(event, f.id)}/>
         <div className="filter-tip">{f.name}</div>
       </div>
    )
  })

  const styles = {
    transform: props.hide ? "translateX(-50vw)" : "none",
    opacity: props.hide ? "0" : "1",
    visibility: props.hide ? "hidden": ""
  }

  return (
    <div style={styles} className="filters-container">
      {filterButtons} 
    </div>
  )
}

export default FilterSelector
