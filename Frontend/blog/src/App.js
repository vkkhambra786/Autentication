import {Routes,Route} from 'react-router-dom';
import './App.css';
import {Forget} from './components/Forget';
import {Register} from './components/Register';
import {Login} from './components/Login';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/register" element={<Register/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
      </Routes>
     <Forget/>
    </div>
  );
}

export default App;
