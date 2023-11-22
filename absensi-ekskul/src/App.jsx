import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css';

import Index from "./pages/Index";
import Home from './pages/Home';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Form from './pages/Form';
import Profile from './pages/Profile';
import Forgot from "./pages/Forgot";
import Error from './pages/Error';
import User from "./pages/User";
import Date from "./pages/Date";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={ <Index /> }></Route>
          <Route path='/home' element={ <Home /> }></Route>
          <Route path='/signup' element={ <Signup /> }></Route>
          <Route path='/signin' element={ <Signin /> }></Route>
          <Route path='/form' element={ <Form /> }></Route>
          <Route path='/profile' element={ <Profile /> }></Route>
          <Route path='/forgot' element={ <Forgot /> }></Route>
          <Route path='/user' element={ <User />}></Route>
          <Route path='/date' element={ <Date />}></Route>
          <Route path='/settings' element={ <Settings />}></Route>
          <Route path='/admin' element={ <Admin />}></Route>
          <Route path='*' element={ <Error /> }></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
