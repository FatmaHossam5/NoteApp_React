import {Routes,Route} from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar';
import Home from './Components/Home'
import Register from './Components/Register';
import Login from './Components/Login';
import ErrorBoundary from './Components/ErrorBoundary';


function App() {
  return (
    <ErrorBoundary>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/signup' element={<Register/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </ErrorBoundary>
  )
}

export default App;
