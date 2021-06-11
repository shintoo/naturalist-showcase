import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const observationRootUrl = "https://www.inaturalist.org/observations/"

function ObservationCard(props) {
  let [ loadedFirst, setLoadedFirst ] = useState(false)
  let [ loadedCurrent, setLoadedCurrent ] = useState(false)
  let [ imageIndex, setImageIndex ] = useState(0)

  // Reset loading config and image number on page change etc.
  useEffect(() => {
      setLoadedFirst(false)
      setLoadedCurrent(false)
      setImageIndex(0)
  }, [props.name])

  return (
    <div className="observation-card">
      { (props.photos.length === 0 || loadedFirst) || <div className="image-placeholder" /> }
      { props.photos.length !== 0 ?
          <img
            style={
              // Loading the first image displays the loading spinner,
              // loading later images just sets the current image opacity to 0.8.
              loadedFirst ? loadedCurrent ? {} : { opacity: 0.8, transition: "opacity 0.1s" } : { display: "none" }
            }
            src={props.photos[imageIndex]}
            onLoad={() => { setLoadedCurrent(true); setLoadedFirst(true) }}
            onClick={() => {
              props.setObservationId(props.id)
              if (props.photos.length === 1)
                return
              setLoadedCurrent(false)
              setImageIndex(imageIndex === props.photos.length-1 ? 0 : imageIndex + 1)
            }}
          />
        :
          <span className="no-image">No image</span>
      }
      { (props.photos.length !==0 && loadedFirst) &&
        <div className="image-counter">
          {imageIndex + (loadedCurrent ? 1 : 0)}/{props.photos.length}
        </div>
      }
      <div className="observation-details">
        <a href={observationRootUrl + props.id}>{props.name ? props.name : "Something!"}</a>
      </div>
    </div>
  )
}

export default ObservationCard
