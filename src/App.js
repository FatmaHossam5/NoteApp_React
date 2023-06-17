import {Routes,Route} from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar';
import Home from './Components/Home'
import Register from './Components/Register';
import Login from './Components/Login';


function App() {
  return (
    < >
  <Navbar/>
  <Routes>
  <Route path='/'element={<Register/>}/>
<Route path='/home'element={<Home/>}/>
<Route path='/signup'element={<Register/>}/>
<Route path='/login'element={<Login/>}/>


  </Routes>


    </>
  )
}

export default App;
