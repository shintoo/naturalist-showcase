import React, { useState, useEffect } from "react"

function ObservationCard(props) {
  let [ loadedFirst, setLoadedFirst ] = useState(false)
  let [ loadedCurrent, setLoadedCurrent ] = useState(false)
  let [ imageIndex, setImageIndex ] = useState(0)

  useEffect(() => {
      setLoadedFirst(false)
      setLoadedCurrent(false)
  }, [props.name])

  // For now, just display the first image.
  return (
    <div className="observation-card">
      { loadedFirst ? null :
        <div className="image-placeholder" />
      }
      <img
        style={
          // Loading the first image displays the loading spinner,
          // loading later images just sets the current image opacity to 0.8.
          loadedFirst ? loadedCurrent ? {} : { opacity: 0.8, transition: "all 0.1s" } : { display: "none" }
        }
        src={props.photos[imageIndex]}
        onLoad={() => { setLoadedCurrent(true); setLoadedFirst(true) }}
        onClick={() => {
          if (props.photos.length == 1)
            return
          setLoadedCurrent(false)
          setImageIndex(imageIndex == props.photos.length-1 ? 0 : imageIndex + 1)
        }}/>
      <div className="image-counter">{imageIndex+1}/{props.photos.length}</div>
      <div className="observation-details">
        {props.name ? props.name : "Something!" }
      </div>
    </div>
  )
}

export default ObservationCard
