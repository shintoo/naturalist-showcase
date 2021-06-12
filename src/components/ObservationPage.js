import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useParams } from "react-router"

const observationEndpoint="https://api.inaturalist.org/v1/observations/"

function ObservationPage({ show, setShow, observationId }) {
  let [ observation, setObservation ] = useState(null)
  let [ imageIndex, setImageIndex ] = useState(0)

  useEffect(() => {
    if (observationId === null)
      return

    console.log("Getting new observation for page: ", observationId)
    fetch(observationEndpoint + observationId)
      .then(resp => resp.json())
      .then(resp => {
        console.log(resp)
        setObservation(resp.results ? resp.results[0] : null)
//        if (observation !== null)
//          setShow(true)
      })
  }, [observationId])

  let date = observation && observation.observed_on_details

  let styles = {
      transform: show ? "translateX(0)" : "translateX(50vw)",
      opacity: show  ? "1" : "0",
  }

  return (
    <div style={styles} className="observation-page">
        <button onClick={() => setShow(false)}>←</button>
        <div className="observation-detailed-view">
          { observation === null ? "loading..." : 
          <>
            <img src={observation.photos[imageIndex].url.replace("square", "medium")} onLoad={() => setShow(true)}/>
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
