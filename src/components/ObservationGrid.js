import React, { useState, useEffect } from "react"
import ObservationCard from "./ObservationCard"

const observationsEndpoint = "https://api.inaturalist.org/v1/observations"

function ObservationGrid(props) {
  let [ observations, setObservations ] = useState([])

  // Create an effect that updates `photos` whenever props.username changes
  useEffect(() => {
      getObservations(props.username, 1, 20) // TODO get page #/per page from props! Make next/previous buttons in MC
        .then(os => setObservations(os))
  }, [props.username])

  const observationCards = observations.map((o, i) => 
    <ObservationCard key={i} name={o.name} photos={o.photos} />
  )

  return (
    <div className="observationgrid-container">
      {observationCards}
    </div>
  )
}

function getObservations(username, page, perPage) {
  // Builds a list of { name: "Eastern Cottontail", photos: ["https://...", ] }
  // TODO fetch by pages!
  return fetch(
    observationsEndpoint
    + "?user_login=" + username
    + "&page=" + page
    + "&per_page=" + perPage
    + "&order=desc&order_by=created_at")
    .then(resp => resp.json())
    .then(resp => {
        return resp.results.map(r => { 
          return {
            name: r.taxon.preferred_common_name ? r.taxon.preferred_common_name : r.species_guess,
            photos: r.photos.map(p => p.url.replace("square", "medium"))
          }
        })
    })
}

export default ObservationGrid
