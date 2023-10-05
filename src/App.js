import React from 'react'
import { Route,Routes,useNavigate } from 'react-router-dom'
import Home from './containers/Home'
import Login from './components/Login'

const App = () => {
  return (
    <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/*' element={<Home/>}/>
    </Routes>
  )
}

export default App