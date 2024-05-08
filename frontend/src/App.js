import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Game from './pages/Game'
import Home from './pages/Home'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/room/:id' element={<Game />} />
    </Routes>
  )
}

export default App