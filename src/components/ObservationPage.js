import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useParams } from "react-router"

const observationEndpoint="https://api.inaturalist.org/v1/observations/"

function ObservationPage({ observationId }) {
  let [ observation, setObservation ] = useState(null)
  let [ present, setPresent ] = useState(false)

  useEffect(() => {
    fetch(observationEndpoint + observationId)
      .then(resp => resp.json())
      .then(resp => {
        setObservation(resp.results ? resp.results[0] : null)
        if (observation !== null)
          setPresent(true)
      })
  }, [observationId])

  let date = observation && observation.observed_on_details

  let styles = {
      transform: present ? "translateX(0)" : "translateX(100vw)",
      opacity: present  ? "1" : "0.5"
  }

  return (
    <div style={styles} className="observation-page">
        <button onClick={() => setPresent(false)}>{"<"}</button>
        <div className="observation-detailed-view">
          { observation === null ? "loading..." : 
          <>
          <img src={observation.photos[0].url.replace("square", "medium")} />
          <div className="observation-view-details">
              {observation.taxon.rank} {observation.taxon.name} <br />
              {observation.taxon.preferred_common_name} <br />
              {date.month} {date.day}, {date.year}
          </div>
          </>}
        </div>
      </div>
  )
}

export default ObservationPage
