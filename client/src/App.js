import "./App.css";
// importing components from react-router-dom package
import {BrowserRouter as Router,Routes,Route,Navigate} from "react-router-dom";

import Home from "./Simplex";
import Restricoes from "./Restricoes";
import ResultadoTabular from "./ResultadoTabular";

function App() {
  return (
    <>
      {/* This is the alias of BrowserRouter i.e. Router */}
      <Router>
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route path="/inserir-dados" element={<Restricoes/>} />
          <Route path="/resultado-tabular" element={<ResultadoTabular/>} />
        </Routes>
      </Router>
    </>
  );
}
  
export default App;

