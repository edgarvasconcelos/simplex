import React from "react";
import { Route, BrowserRouter, useNavigate } from "react-router-dom";

import Simplex from "./Simplex";
// import Tabular from "./simplex/tabular";
import Restricoes from "./Restricoes";
// import Grafico from "./simplex/grafico";

const Routes = () => {
   return(
       <BrowserRouter>
           <Route component = { Simplex }  path="/" exact />
           {/* <Route component = { Tabular }  path="/simplex/tabular" /> */}
           <Route component = { Restricoes }  path="/simplex/inserir-dados" />
           {/* <Route component = { Grafico }  path="/simplex/grafico" /> */}
       </BrowserRouter>
   )
}

export default Routes;