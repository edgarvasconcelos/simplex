import "./App.css";
// importing components from react-router-dom package
import {BrowserRouter as Router,Routes,Route,Navigate} from "react-router-dom";

import Home from "./Simplex";
import Restricoes from "./Restricoes";
import ResultadoTabular from "./ResultadoTabular";
import ResultadoGraph from "./ResultadoGraph";
//import Footer from "./Components/Footer";
import Header from "./Components/Header";
import ResultadoGrafico from "./Components/ResultadoGrafico";

function App() {
  return (
    <>
      <Header></Header>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route path="/inserir-dados" element={<Restricoes/>} />
          <Route path="/resultado-tabular" element={<ResultadoTabular/>} />
          <Route path="/resultado-graph" element={<ResultadoGrafico/>} />
        </Routes>
      </Router>
      
    </>
  );
}
  
export default App;

