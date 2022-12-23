import { useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from "./Components/Footer";
import Stack from '@mui/material/Stack';
import { useParams, useNavigate, json } from "react-router-dom";


const ResultadoTabular = () => {
 const [searchParams, setSearchParams] = useSearchParams();
 const dataObject = Object.fromEntries(searchParams.entries());
 const jsonData = JSON.stringify(dataObject)
 // console.log(jsonData)
 
 const [loading, setLoading] = useState(true);
 const [data, setData] = useState([])
 const [mostrarComoFracao, setMostrarFracao] = useState(false)
 const [solucaoOtima, setMostrarSolucaoOtima] = useState([])
 const [valorOtimo, setMostrarValorOtimo] = useState([])
 
 const mostrarFracao = () => {
    setMostrarFracao(!mostrarComoFracao)
 }
 
 const navigate = useNavigate();
 const goBack = () => {
   navigate(-1);
 };
 
 useEffect(() => {
   const fetchData = async () => {
     setLoading(true);
     try {
       // const {data: response} = await axios.get('http://localhost:5000/simplex/apply-simplex/', configHeaders);
       // setData(response);
       // console.log(response)
       fetch('http://localhost:5000/simplex/apply-simplex/', {
         method: 'POST',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
         },
         mode: 'cors',
         body: jsonData // body data type must match "Content-Type" header
       })
         .then(
           res => res.json()
         ).then(
           data => {
             // resultado: data
             setData(data)
           }
         )
     } catch (error) {
       console.error(error.message);
     }
     setLoading(false);
   }
 
   fetchData();
 }, []);
 
 const simplexResult = Object.values(data)
 
 if (simplexResult.length != 0) {
   const variaveis = Object.values(simplexResult[0]['solucao_basica'])
   const tamanho = simplexResult.length-1
   let solucao_otima = []
   console.log(simplexResult[tamanho]['solucao_basica'])
   solucao_otima.push(Object.values(simplexResult[tamanho]['solucao_basica']))
   const valor_otimo = simplexResult[tamanho]['valor_otimo']
   var iteracao = 0
   return (
    <>
     <div>
        <input id="mostrarfracao" type="checkbox" onClick={mostrarFracao}></input>
        <label for="mostrar_fracao">Mostrar resultados na forma de fração</label>
     </div>

      <p>Valor Ótimo: {valor_otimo}</p>
      <p>Solução Ótima: {solucao_otima}</p>
     <div className=" b shadow-md py-20 px-32 h-full w-screen justify-center items-center">
         {simplexResult.map((dados, k) => {
           let matriz
          if(mostrarComoFracao){
            matriz = Object.values(dados.matriz_fracao)
          } else {
            matriz = Object.values(dados.matriz)
            matriz.unshift(matriz.pop())
          }
           let variaveis_basicas = Object.values(dados.variaveis_basicas)
           variaveis_basicas.unshift('z')
           return (
             <div class="flex items-center py-6 md-pr-6 content-between place-content-between">
              <div class="text-white-100 flex w-14 h-14 bg-blue-500 items-center justify-center rounded-full">
                <p>{k}</p>
              </div>
              <div className="shadow sm:rounded-lg overflow-x-auto relative">
               <table className="w-full text-sm text-left">
                 <thead className="bg-blue-500 text-xs  uppercase">
                   <tr class="text-white-100">
                     <th scope="col" className="py-3 px-6">Base</th>
                     <th scope="col" className="py-3 px-6">Eq.</th>
                     {variaveis.map((dados, k) => {
                       return (
                         <th scope="col" className="py-3 px-6">X<sub>{k + 1}</sub></th>
                       );
                     })}
                     <th scope="col" className="py-3 px-6">Lado Direito</th>
                   </tr>
                 </thead>
                 <tbody class="text-gray-500 dark:text-gray-400">
                   {matriz.map((linha, key) => {
                     let row = Object.values(linha)
                     var linha_pivo = dados.linha_pivo
                     var coluna_pivo = dados.coluna_pivo
                     var solucao_otima = dados.solucao_otima
                     var valor_otimo = dados.valor_otimo
                     
                     let variavel = (key === 0) ? 'Z' : 'X'
                     let index_variavel = (key === 0) ? '' : variaveis_basicas[key] + 1
                     return (
                       <tr className="border-b dark:bg-gray-800 dark:border-gray-700">
                         <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white bg-gray-100">{variavel}<sub>{index_variavel}</sub></th>
                         <td className="py-4 px-6">({key})</td>
 
                         {row.map((value, index) => {
                           let row_tamanho = row.length - 1
                           let cor = (coluna_pivo == index && linha_pivo == key) ? 'bg-blue-500' : (solucao_otima && index == row_tamanho && key == 0) ? 'bg-green-500' : (coluna_pivo == index || linha_pivo == key) ? 'bg-yellow-100' : 'white'
                           let cor_texto = (cor === 'bg-blue-500' || cor === 'bg-green-500') ? 'white' : ''
                           let bg_pivo
                          //  if(coluna_pivo == index || linha_pivo == key) {
                          //   bg_pivo = 'bg-yellow-200 py-4 px-6'
                          //  } else {
                          // }
                          bg_pivo = 'py-4 px-6'
                           return (
                             <td style={{ background: cor, color: cor_texto }} className={cor + ' py-4 px-6'}>{value}</td>
                           )
                         })}
                       </tr>
                     );
                   })}
                 </tbody>
               </table>
              </div>
              <br></br>
              <br></br>
             </div>
 
           );
         })}
         
       <Stack
         sx={{ pt: 4 }}
         direction="row"
         spacing={2}
         justifyContent="center"
       >
 
         <button className="inline-block px-6 py-2 border-2 border-blue-600 text-blue-600 font-medium text-xs leading-tight uppercase rounded-full hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out" onClick={goBack}>Voltar</button>
       </Stack>
       <Footer></Footer>
     </div>
    </>
   );
 }

}
 
export default ResultadoTabular;
