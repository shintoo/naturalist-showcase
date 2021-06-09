import React, { useState, useEffect } from "react"
import ObservationCard from "./ObservationCard"

const observationsEndpoint = "https://api.inaturalist.org/v1/observations"

function ObservationGrid(props) {
  let [ observations, setObservations ] = useState([])
  let [ totalResults, setTotalResults ] = useState(0)

  const numPerPage = 20  // TODO get # per page from props! Make selection in MC

  useEffect(() => {
      getObservations(props.username, props.page, numPerPage, setTotalResults)
        .then(os => setObservations(os))
  }, [props.username, props.page])

  useEffect(() => props.setFinalPage(Math.ceil(totalResults / numPerPage)), [observations])

  const observationCards = observations.map((o, i) => 
    <ObservationCard key={o.id} id={o.id} name={o.name} photos={o.photos} />
  )

  return (
    <div className="observationgrid-container">
      {observationCards}
    </div>
  )
}

function getObservations(username, page, perPage, setTotalResults) {
  // Builds a list of { name: "Eastern Cottontail", photos: ["https://...", ] }
  return fetch(
    observationsEndpoint
    + "?user_login=" + username
    + "&page=" + page
    + "&per_page=" + perPage
    + "&order=desc&order_by=created_at")
    .then(resp => resp.json())
    .then(resp => {
        console.log(resp.total_results)
        setTotalResults(resp.total_results)
        return resp.results.map(r => { 
          return {
            id: r.id,
            name: r.taxon && r.taxon.preferred_common_name ? r.taxon.preferred_common_name : r.species_guess,
            photos: r.photos.map(p => p.url.replace("square", "medium"))
          }
        })
    })
}

export default ObservationGrid
