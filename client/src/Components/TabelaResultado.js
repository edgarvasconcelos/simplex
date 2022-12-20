

import * as React from 'react';


function TabelaResultado(props){
    var iteracao = 0
  return (

    <div className=" b py-20 px-4 sm:px-6 h-full w-screen justify-center items-center">
    <div className="overflow-x-auto relative">
          {props.simplexResult.map((dados, k) => {
            let matriz = Object.values(dados.matriz)
            matriz.unshift(matriz.pop())
            let variaveis_basicas = Object.values(dados.variaveis_basicas)
            variaveis_basicas.unshift('z')
            return (
              <>
              <h2>Iteração {k}</h2>
              <p>Coluna Pivo: {props.simplexResult[k]['coluna_pivo']}</p>                  
              <p>Linha Pivo: {props.simplexResult[k]['linha_pivo']}</p>
              <p>Solução Ótima: {props.simplexResult[k]['valor_otimo']}</p> 
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>          
                    <th scope="col" className="py-3 px-6">Variavel Basica</th>
                    <th scope="col" className="py-3 px-6">Eq.</th>
                    {props.variaveis.map((dados, k) => {
                      return(
                        <th scope="col" className="py-3 px-6">X<sub>{k+1}</sub></th>
                      );
                    })}
                    <th scope="col" className="py-3 px-6">Lado Direito</th>
                  </tr>
                </thead>
                <tbody>
                {matriz.map((linha, key) => {
                  let row = Object.values(linha)
                  var linha_pivo = dados.linha_pivo
                  var coluna_pivo = dados.coluna_pivo
                  var solucao_otima = dados.solucao_otima
                  let variavel = (key === 0) ? 'Z' : 'X'
                  let index_variavel = (key === 0) ? '' : variaveis_basicas[key]+1
                  return (
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">{variavel}<sub>{index_variavel}</sub></th>
                      <td className="py-4 px-6">({key})</td>

                      {row.map((value, index) => {
                        let row_tamanho = row.length - 1
                        let cor = (coluna_pivo == index && linha_pivo == key) ? 'blue' : (solucao_otima && index == row_tamanho && key ==0) ? 'green' : 'white'
                        let cor_texto = (cor === 'blue' || cor === 'green') ? 'white' : ''
                        return (
                          <td style={{background:cor, color:cor_texto}} className="py-4 px-6">{value}</td>
                        )
                      })}
                    </tr>
                  );
                })}
                </tbody>
              </table>
             
              <br></br>
              <br></br>
              <br></br>
              </>
            );
          })}
        
    </div>
    </div>
      
      )
    
}

export default TabelaResultado;