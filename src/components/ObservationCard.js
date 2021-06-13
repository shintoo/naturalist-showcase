import React, { useState, useEffect } from "react"
import photoIcon from "../img/photo.png"

function ObservationCard(props) {
  let [ loaded, setLoaded ] = useState(false)

  // Reset loading config and image number
  useEffect(() => {setLoaded(false)}, [props.id])

  const showPlaceholder = props.photos.length !== 0 && !loaded

  const styles = { visibility: loaded ? "visible" : "hidden" } 

  return (
    <div
      style={styles} 
      className={["observation-card", loaded ? "loaded" : ""].join(" ")}
      onClick={() => (props.setObservationId(props.id), props.hideObservationGrid())}>
      { !showPlaceholder || <div className="image-placeholder" /> }
      { props.photos.length !== 0 ?
        <img
          alt={props.name + " image"}
          style={{display: loaded ? "inline-block" : "none"}}
          src={props.photos[0]}
          onLoad={() => {setLoaded(true)}}
        />
      :
        <span className="no-image">No image</span>
      }
      { (props.photos.length !==0 && loaded) &&
        <div className="image-counter">
          <span>{props.photos.length + " "}</span>
          <img width="16" height="16" src={photoIcon} />
        </div>
      }
      <div className="caption">
        {props.name ? props.name : "Something!"}
      </div>
    </div>
  )
}

export default ObservationCard
