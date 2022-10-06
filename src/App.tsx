import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { FormBansos, Preview } from './pages'
import {store} from './redux/store'
import './App.css'
import { Provider } from 'react-redux'

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path='/' element={<FormBansos />} />
          <Route path='/preview' element={<Preview />} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
