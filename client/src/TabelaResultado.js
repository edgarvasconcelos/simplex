export default function TabelaResultado(simplexResult) {
    return (
        <div className="App">
          <table class="table">
            {/* {console.log(simplexResult[0].matriz[0][3])} */}
            <thead>
              <tr>          
                <th>Variavel Basica</th>
                <th>X<sub>1</sub></th>
                <th>X<sub>2</sub></th>
                <th>X<sub>2</sub></th>
                <th>X<sub>4</sub></th>
                <th>X<sub>5</sub></th>
                <th>X<sub>6</sub></th>
                <th>Lado Direito</th>
              </tr>
            </thead>
            <tbody>
            {simplexResult.map((dados, k) => {
             let linha_pivo = dados.linha_pivo
             let matriz = Object.values(dados.matriz)
             let variaveis_basicas = Object.values(dados.variaveis_basicas)
             variaveis_basicas.unshift('z')
            console.log(variaveis_basicas)
              return (
                <>
                  {matriz.map((linha, key) => {
                    let row = Object.values(linha)
                    console.log(matriz[key][1])
                    return (
                      <tr>
                        <th>X<sub>{variaveis_basicas[key]}</sub></th>
                      {row.map((value, index) => {
                        console.log(value)
                        return (
                          <td>{value}</td>
                        )
                      })}
                      </tr>
                    );
                  })}
                </>
              );
            })} 
            </tbody>
            
    
          </table>
        </div>
      );
    
}