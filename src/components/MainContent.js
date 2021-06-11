import React, { useState } from "react"
import { useParams } from "react-router"
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import ObservationGrid from "./ObservationGrid"
import ObservationPage from "./ObservationPage"
import PageController from "./PageController"
import pencil from "../img/pencil.svg"

function MainContent() {
    return (
      <Router>
        <Switch>
          <Route path="/:u">
            <Homepage />
          </Route>
          <Route path="/">
            <Homepage />
          </Route>
        </Switch>
      </Router>
    )
}

function Homepage() {
  let { u }                               = useParams()
  let [ username, setUsername ]           = useState(u || "shintoo")
  let [ buffer, setBuffer ]               = useState(null)
  let [ editingBuffer, setEditingBuffer ] = useState(false)
  let [ page, setPage ]                   = useState(1)
  let [ finalPage, setFinalPage ]         = useState(1)
  let [ observationId, setObservationId ] = useState(null)

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
      <ObservationGrid
        username={username}
        page={page}
        setFinalPage={setFinalPage}
        setObservationId={setObservationId}
        hide={observationId !== null}
      />
      <ObservationPage observationId={observationId} />
      <PageController page={page} setPage={setPage} finalPage={finalPage}/>
    </div>
  )
}

export default MainContent
