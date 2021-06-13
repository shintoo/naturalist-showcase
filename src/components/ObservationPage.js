import React, { useState, useEffect } from "react"
import iNatIcon from "../img/inat.png"

const observationEndpoint="https://api.inaturalist.org/v1/observations/"

function ObservationPage({ show, setShow, observationId }) {
  let [ observation, setObservation ] = useState(null)
  // eslint-disable-next-line
  let [ imageIndex, setImageIndex ] = useState(0)
  let [ loadedCurrent, setLoadedCurrent ] = useState(false)
  let [ carouselStyles, setCarouselStyles ] = useState({ transition: "all 0.1s ease-out" })

  useEffect(() => {
    if (observationId === null)
      return
    fetch(observationEndpoint + observationId)
      .then(resp => resp.json())
      .then(resp => {
        setObservation(resp.results ? resp.results[0] : null)
        setShow(true)
      })
  }, [observationId])

  let date = observation && observation.observed_on_details

  let styles = {
    transform: show ? "translate(-50%, -50%)" : "translate(100%, -50%)",
    opacity: show  ? "1" : "0",
    visibility: show ? "" : "hidden",
  }

  const nextImage = () => {
    // Typical case - move to next image
    if (imageIndex !== observation.photos.length - 1) {
      setCarouselStyles({ ...carouselStyles, scale: "0.97" })
      setLoadedCurrent(false)
      setImageIndex(imageIndex+1)
      return
    }

    // If only one image present
    if (observation.photos.length === 1)
      return

    // Set to first image iff not on last image and more than 1 image
    setCarouselStyles({ ...carouselStyles, scale: "0.97" })
    setImageIndex(0)
  }

  const onLoad = () => {
    setTimeout(_ => setCarouselStyles({ ...carouselStyles, scale: "1" }), 100)
    setLoadedCurrent(true)

  }

  const back = () => {
    setShow(false)
    setTimeout(_ => setImageIndex(0), 500)
  }

  const taxon = observation && observation.taxon

  const trimSummary = sum => {
    if (!sum)
      return null

    // For skipping disambig pages
    if (sum.includes("may refer to"))
      return null

    sum = sum.replace( /(<([^>]+)>)/ig, '')
    sum = sum.replace( /&amp;/g, '&') 
    if (sum.length >= 256) {
      sum = sum.slice(0, 256)
      let lastSpace = sum.lastIndexOf(' ')
      sum = sum.substr(0, lastSpace)
      sum += "..."
    }
    return sum
  }

  const wikipedia_summary = taxon && trimSummary(taxon.wikipedia_summary)

  return (
    <div style={styles} className="observation-page">
      <button onClick={back}>←</button>
        { observation !== null ? <>
        <div style={carouselStyles} className="carousel">
          <img
            alt={observation.taxon.preferred_common_name + " image"}
            src={observation.photos[imageIndex].url.replace("square", "medium")}
            onClick={nextImage}
            onLoad={onLoad}/>
          <div className="image-counter">
            {imageIndex + (loadedCurrent ? 1 : 0)}/{observation.photos.length}
          </div>
        </div>          
        <div className="details">
           <span id="common-name">{observation.taxon.preferred_common_name} </span>
           <div>
             <span id="rank">{taxon.rank} </span>
             <span id="name">{taxon.name} </span>
           </div>
           { wikipedia_summary &&
           <p id="wikipedia-summary">
             {wikipedia_summary} 
             <span> </span><a href={taxon.wikipedia_url}>read more</a>
           </p>
           }
           <span id="date">observed on {date.month}-{date.day}-{date.year} by {observation.user.name}</span>
           <a id="inat-link" href={observation.uri}><img width="16" height="16" src={iNatIcon} /></a>
        </div>
        </>:
        <span>loading...</span>
        }
      </div>
  )
}

export default ObservationPage
