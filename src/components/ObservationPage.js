import React, { useState, useEffect } from "react"
import iNatIcon from "../img/inat.png"

const observationEndpoint="https://api.inaturalist.org/v1/observations/"
const taxaEndpoint="https://api.inaturalist.org/v1/taxa/"

function ObservationPage({ show, setShow, observationId }) {
  let [ observation, setObservation ] = useState(null)
  let [ imageIndex, setImageIndex ] = useState(0)
  let [ loadedCurrent, setLoadedCurrent ] = useState(false)
  let [ carouselStyles, setCarouselStyles ] = useState({ transition: "all 0.1s ease-out" })
  let [ showLoadingSpinner, setShowLoadingSpinner ] = useState(false)

  // Retrieve the observation when the passed ID changes
  // and update the observation
  useEffect(() => {
    if (!show || !observationId)
      return;

    setShowLoadingSpinner(true)
    fetch(observationEndpoint + observationId)
      .then(resp => resp.json())
      .then(resp => loadObservation(resp))
      .then(obs =>  setObservation(obs))
  }, [show])

  useEffect(() => {
    if (!observation)
      return
    setShowLoadingSpinner(false)
  }, [observation])

  let date = observation && observation.observed_on_details

  let styles = {
    transform:  show ? "translate(-50%, -50%)" : "translate(100%, -50%)",
    opacity:    show ? "1" : "0",
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
    setTimeout(_ => setCarouselStyles({ ...carouselStyles, scale: "1"}), 100)
    setLoadedCurrent(true)
  }

  const back = () => {
    setShow(false)
    setTimeout(_ => {
      setImageIndex(0)
      setCarouselStyles({ ...carouselStyles, scale: "1" })
    }, 500) // Transition time for fade out
  }

  const taxon = observation && observation.taxon

  let wikipedia_summary
  let wikipedia_url

  if (observation) {
    // If our wikipedia information is from an ancestor taxa (or not)
    if (!observation.taxon.wikipedia_url) {
      wikipedia_url = observation.ancestor_url
      wikipedia_summary =
        taxon.name
        + " is a" + (/[aeiou]/.test(observation.taxon.rank[0]) ? "n " : " ")
        + observation.taxon.rank
        + " within the "
        + observation.ancestor_name
        + " "
        + observation.ancestor_rank
        + ". "
        + observation.ancestor_summary
    } else {
      wikipedia_summary = observation.taxon.wikipedia_summary
      wikipedia_url = observation.taxon.wikipedia_url
    }

    wikipedia_summary = trimSummary(wikipedia_summary)
  }

  return (
    <div style={styles} className="observation-page">
      <button onClick={back}>←</button>
      { observation !== null  && !showLoadingSpinner ? <>
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
             {wikipedia_summary} &nbsp;
             <a href={wikipedia_url}>
               read more
               <img
                 alt="at wikipedia"
                 height="16" width="16"
                 src="https://upload.wikimedia.org/wikipedia/commons/d/d9/VisualEditor_-_Icon_-_External-link.svg"
               /> 
             </a>
           </p>
           }
           <a id="inat-link" href={observation.uri}>
             <img width="14" height="14" src={iNatIcon} />
             observed
             {date && " on " + date.month + "-" + date.day + "-" + date.year}
             {" by " + observation.user.name}
           </a>
        </div>
       </>:<>
        <div className="image-placeholder" />
        <div className="details-placeholder">
          <div className="text-placeholder title" />
          <div className="text-placeholder body" />
          <div className="text-placeholder body" />
          <div className="text-placeholder body" />
        </div>
       </>
      }
      </div>
  )
}

// Trim a summary to <256 characters, at the last word that fits
function trimSummary(sum) {
  if (!sum)
    return null

  // For skipping disambig pages
  if (sum.includes("may refer to"))
    return null

  // Remove <i>/<b>'s etc
  sum = sum.replace( /(<([^>]+)>)/ig, '')
  sum = sum.replace( /&amp;/g, '&')

  if (sum.length >= 256) {
    sum = sum.slice(0, 256)
    // Don't cut off in the middle of a word
    let lastSpace = sum.lastIndexOf(' ')
    sum = sum.substr(0, lastSpace)
    sum += "..."
  }
  return sum
}

// For use when the identified taxon does not have a
// wikipedia_url or wikipedia_summary present.
// Ascend the tree of ancestors (from most local to
// most generic) until a wikipedia URL and summary are
// available. ancestor_ids is sorted from most generic
// to most specific in the response data, so it is reversed
// here.
async function getAncestorInfo(ancestorIds) {
  ancestorIds.reverse()
  for (let i = 0; i < ancestorIds.length; i++) {
    let data = await fetch(taxaEndpoint + ancestorIds[i])
      .then(response => response.json())
      .then(data => {
        if (data.results[0].wikipedia_url)
          return data.results[0]
        return null
      })
    if (data)
      return data
  }
}

// Process a response and prepare an object to be set to observation
async function loadObservation(response) {
  let finalObservation = null

  if (response.results) {
    if (response.results[0].taxon.wikipedia_url)
      return response.results[0]

    await getAncestorInfo(response.results[0].taxon.ancestor_ids)
      .then(result => {
        let newObs = response.results[0]
        newObs.ancestor_url = result.wikipedia_url
        newObs.ancestor_summary = result.wikipedia_summary
        newObs.ancestor_rank = result.rank
        newObs.ancestor_name = result.name
        finalObservation = newObs
      })
  }

  return finalObservation
}

export default ObservationPage
