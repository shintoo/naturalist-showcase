import React, { useState } from "react"
import ObservationGrid from "./ObservationGrid"
import pencil from "../img/pencil.svg"

function MainContent() {
  let [ username, setUsername ] = useState("shintoo")
  let [ buffer, setBuffer ] = useState(null)
  let [ editingBuffer, setEditingBuffer ] = useState(false)

  const handleChange = (event) => {
      setBuffer(event.target.value)
  }

  const handleKeyUp = (event) => {
      if (event.key === "Enter") {
          setUsername(buffer)
          setEditingBuffer(false)
          setBuffer(null)
      }
  }

  // TODO button to change observationgrid from a 'grid' to a 'list' (think google photos look to blog lool)
  return (
    <div className="main-content">
      {/* Add textbox to change username TODO */}
      { editingBuffer ?
          <input
            className="username-input"
            type="text"
            autoFocus
            placeholder="iNaturalist username"
            value={buffer}
            onChange={handleChange}
            onKeyUp={handleKeyUp}
            />
        :
          <span
            onClick={() => setEditingBuffer(true)}
            className="username">
            {username} <img id="pencil" src={pencil} />
          </span>
      }
      <ObservationGrid username={username}/>
    </div>
  )
}

export default MainContent
