import React, { useState } from "react"
import { useParams } from "react-router"
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import ObservationGrid from "./ObservationGrid"
import ObservationPage from "./ObservationPage"
import FilterSelector from "./FilterSelector"
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
  let [ buffer, setBuffer ]               = useState("")
  let [ editingBuffer, setEditingBuffer ] = useState(false)
  let [ page, setPage ]                   = useState(1)
  let [ finalPage, setFinalPage ]         = useState(1)
  let [ showObservationPage, setShowObservationPage] = useState(false)
  let [ observationId, setObservationId ] = useState(null)
  let [ filters, setFilters ] = useState([])

  const handleChange = (event) => {
      setBuffer(event.target.value)
  }

  console.log("show page: ", showObservationPage)

  const handleKeyUp = (event) => {
      if (event.key === "Enter") {
          setUsername(buffer)
          setEditingBuffer(false)
          setBuffer("")
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
            <img alt="edit" id="pencil" width="16" height="16" src={pencil} />
          </span>
      }
      <div style={{display: "flex"}}>
       <FilterSelector
        hide={showObservationPage}
        filters={filters}
        setFilters={setFilters}
        resetPage={() => setPage(1)}
       />
       <ObservationGrid
        username={username}
        filters={filters}
        page={page}
        setFinalPage={setFinalPage}
        setObservationId={setObservationId}
        hide={showObservationPage}
        setHide={setShowObservationPage}
       />
      </div>
      <ObservationPage
        observationId={observationId}
        show={showObservationPage}
        setShow={setShowObservationPage}
      />
      <PageController
        page={page}
        setPage={setPage}
        finalPage={finalPage}
        hide={showObservationPage}
      />
    </div>
  )
}

export default MainContent
