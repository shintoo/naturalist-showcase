import React, { useState } from "react"
import ObservationGrid from "./ObservationGrid"
import PageController from "./PageController"
import pencil from "../img/pencil.svg"

function MainContent() {
  let [ username, setUsername ] = useState("shintoo")
  let [ buffer, setBuffer ] = useState(null)
  let [ editingBuffer, setEditingBuffer ] = useState(false)
  let [ page, setPage ] = useState(1)
  let [ finalPage, setFinalPage ] = useState(1)

  const handleChange = (event) => {
      setBuffer(event.target.value)
  }

  const handleKeyUp = (event) => {
      if (event.key === "Enter") {
          setUsername(buffer)
          setEditingBuffer(false)
          setBuffer(null)
          setPage(1)
      }
  }

  return (
    <div className="main-content">
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
            {username}
            <img id="pencil" src={pencil} />
          </span>
      }
      <ObservationGrid username={username} page={page} setFinalPage={setFinalPage}/>
      <PageController page={page} setPage={setPage} finalPage={finalPage}/>
    </div>
  )
}

export default MainContent
