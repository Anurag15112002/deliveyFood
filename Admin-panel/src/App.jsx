import React from 'react'
import Navbar from './Component/Navbar/Navbar'
import Sidebar from './Component/Sidebar/Sidebar'
import {Routes,Route} from 'react-router-dom'
import List from './Pages/List/List'
import Add from './Pages/Add/Add'
import Order from './Pages/Order/Order'
import { ToastContainer} from 'react-toastify';
const App = () => {
  const url = "http://localhost:3000";
  return (
    <div>
      <ToastContainer/>
      <Navbar />
      <hr/>
      <div className='app-content'>
        <Sidebar />
        <Routes>
           <Route path='/add' element={<Add url={url}/>}/>
           <Route path='/list' element={<List url={url}/>}/>
           <Route path='/orders' element={<Order url={url}/>}/>
           
        </Routes>
      </div>
    </div>
  )
}

export default App