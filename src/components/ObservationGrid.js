import React, { useState, useEffect } from "react"
import ObservationCard from "./ObservationCard"

const observationsEndpoint = "https://api.inaturalist.org/v1/observations"

function ObservationGrid(props) {
  let [ observations, setObservations ] = useState([])
  let [ totalResults, setTotalResults ] = useState(0)
  const numPerPage = 12

  useEffect(() => {
    getObservations(props.username, props.page, numPerPage, setTotalResults)
      .then(os => setObservations(os))
  }, [props.username, props.page])

  useEffect(() => props.setFinalPage(Math.ceil(totalResults / numPerPage)), [observations])

  const styles = {
    transform: props.hide ? "translateX(-50vw)" : "none",
    opacity: props.hide ? "0" : "1",
    visibility: props.hide ? "hidden": ""
  }

  const observationCards = observations && observations.map((o, i) => 
    <ObservationCard
      key={o.id}
      id={o.id}
      name={o.name}
      photos={o.photos}
      setObservationId={props.setObservationId}
      hideObservationGrid={() => props.setHide(true)}
    />
  )

  if (observations.length === 0)
    return <span className="loading">loading...</span>

  return (
    <div style={styles} className="observationgrid-container">
      {observationCards ||
        <span class="user-not-found">User {props.username} was not found</span>
      }
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
        if (!resp.results)
          return null;

        setTotalResults(resp.total_results)
        return resp.results.map(r => { 
          return {
            id: r.id,
            name: r.taxon ? r.taxon.preferred_common_name || r.taxon.rank + " " + r.taxon.name : r.species_guess,
            photos: r.photos.map(p => p.url.replace("square", "medium"))
          }
        })
    })
}

export default ObservationGrid
