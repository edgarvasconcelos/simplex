import React, { useState } from 'react';
import TabelaResultado from './TabelaResultado';
import "./index.css";
class AppComponent extends React.Component {

  state = {
    numChildren: 0,
    numVaraveis: 0,
    resultado: {},
    changed: 0
  }

  handleSubmit = (event) => {
    const quantidade_restricoes = event.target[1].value
    const quantidade_variaveis = event.target[0].value
    this.setState({
      numChildren: quantidade_restricoes,
      numVaraveis: quantidade_variaveis,
      changed: 1
    });
    event.preventDefault()
  }

  handleSubmitData = (event) => {
    event.preventDefault()
    const data = new FormData(event.target);
    data.append('variaveis', this.state.numVaraveis)
    data.append('restricoes', this.state.numChildren)
    const dataObject = Object.fromEntries(data.entries());
    const jsonData = JSON.stringify(dataObject)

    var formData = new FormData();
    formData.append('json1', jsonData);

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
          this.setState({
            resultado: data
          })
        }
      )
  }

  render() {
    const children = [];
    const simplexResult = Object.values(this.state.resultado)

    if (simplexResult.length != 0) {
      const variaveis = Object.values(simplexResult[0]['solucao_basica']) 
      return (
        <div className=" b py-20 px-4 sm:px-6 h-full w-screen justify-center items-center">
        <div className="overflow-x-auto relative">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              
            
              <tr>          
                <th scope="col" className="py-3 px-6">Variavel Basica</th>
                {variaveis.map((dados, k) => {
                  return(
                    <th scope="col" className="py-3 px-6">X<sub>{k+1}</sub></th>
                  );
                })}
                <th scope="col" className="py-3 px-6">Lado Direito</th>
              </tr>
            </thead>
              {/* <tr>
                <th scope="col" className="py-3 px-6">Variável Básica</th>
                <th scope="col" className="py-3 px-6">X<sub>1</sub></th>
                <th scope="col" className="py-3 px-6">X<sub>2</sub></th>
                <th scope="col" className="py-3 px-6">X<sub>2</sub></th>
                <th scope="col" className="py-3 px-6">X<sub>4</sub></th>
                <th scope="col" className="py-3 px-6">X<sub>5</sub></th>
                <th scope="col" className="py-3 px-6">X<sub>6</sub></th>
                <th scope="col" className="py-3 px-6">Lado Direito</th>
              </tr>
            </thead> */}
            <tbody>
              {simplexResult.map((dados, k) => {
                let linha_pivo = dados.linha_pivo
                let matriz = Object.values(dados.matriz)
                matriz.unshift(matriz.pop())
                let variaveis_basicas = Object.values(dados.variaveis_basicas)
                variaveis_basicas.unshift('z')
                return (
                  <>
                    {matriz.map((linha, key) => {
                      let row = Object.values(linha)
                      return (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">X<sub>{variaveis_basicas[key]}</sub></th>
                          {row.map((value, index) => {
                            return (
                              <td className="py-4 px-6">{value}</td>
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
        </div>
      );
    }

    if (this.state.changed) {
      children.push(<TipoOtimizacao />);
      for (var v = 1; v <= this.state.numVaraveis; v += 1) {
        children.push(<ChildComponent key={'z' + v} chave={'z' + v} number={v} />);
        if(v != this.state.numVaraveis) {
          children.push(<pre style={{display:'inline-flex'}}> + </pre>)
        }
      }
      children.push(<br></br>)
      children.push(<br></br>)
      for (var i = 1; i <= this.state.numChildren; i += 1) {
        for (var j = 1; j <= this.state.numVaraveis; j += 1) {
          if (j == this.state.numVaraveis) {
            let k = j + 1;
            children.push(<ChildComponent key={i + '' + j} chave={'x' + i + '' + j} number={j} />);
            children.push(<CondicaoComponent key={'c' + i} chave={'x' + i + 'c'} number={i} />);
            children.push(<ResultadoComponent key={i + '' + k} chave={'x' + i + '' + k} />);
            break;
          } else {
            children.push(<ChildComponent key={i + '' + j} chave={'x' + i + '' + j} number={j} />);
            children.push(<pre style={{display:'inline-flex'}}> + </pre>)
          }
        }
        children.push(<br></br>)
      };
      return (
        <div class="container mx-auto flex">
          <div className=" b py-20 px-4 sm:px-6 h-full w-screen justify-center items-center">
            <form onSubmit={this.handleSubmitData}>
              {children}
              {/* <input type="submit" /> */}

              <div className=" b py-3">
                <button className="inline-block align-center bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="submit">
                  Calcular
                </button>
              </div>



            </form>
          </div>
        </div>

      );
    }

    return (

      <div>
        <div className=" b py-20 px-4 sm:px-6 h-full w-screen justify-center items-center">
          <p className="text-4xl">
            Problema de Otimização
          </p>
          <p className="text-2xl text-gray-400">
            Escreva seu problema de programação linear abaixo
          </p>
        </div>

        <div className=" b py-20 bg-green-50 px-4 sm:px-6 h-full w-screen flex justify-center items-center">

          <form className="w-full max-w-lg" onSubmit={this.handleSubmit}>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="tracking-wide text-gray-700 text-lg mb-2">
                  Quantidade de variáveis
                </label>

                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" name="variaveis" type="text" ref={node => (this.inputNode = node)}></input>
                {/* <p class="text-red-500 text-xs italic">Please fill out this field.</p> */}
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label className=" tracking-wide text-gray-700 text-lg  mb-2">
                  Quantidade de restricões
                </label>
                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" name="restricoes" type="text" ref={node => (this.inputNode = node)}></input>


              </div>
            </div>
            <div >
              <button className="inline-block align-center bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="submit">
                Calcular
              </button>
            </div>

          </form>


        </div>

      </div>

    );
  }

  onAddChild = () => {
    this.setState({
      numChildren: this.state.numChildren + 1
    });
  }
}

export default AppComponent;


const TipoOtimizacao = props => (
  <div className="flex flex-wrap -mx-3 mb-6">
  <label for="tipo" className=" tracking-wide text-gray-700 text-lg  mb-2">Selecione o tipo do problema: </label>
  <select name="tipo" className=" ml-2 form-select appearance-none
  px-3
  py-0
  text-base
  font-normal
  text-gray-700
  bg-white bg-clip-padding bg-no-repeat
  border border-solid border-gray-300
  rounded
  transition
  ease-in-out
  mr-5
  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example">
    <option value="0">Minimizar</option>
    <option value="1">Maximizar</option>
  </select>
  </div>
);

const ResultadoComponent = props => <label className="text-gray">{" = "}<input className=" mt-2 bg-gray-100 appearance-none border-2 border-gray-200 rounded  py-2 px-4 text-gray-800 leading-tight focus:outline-none focus:bg-white focus:border-green-500" type="text" name={props.chave} /></label>
const ChildComponent = props => <label className=" text-gray-500 font-bold md:text-center"><input className="  bg-gray-100 appearance-none border-2 border-gray-200 rounded  py-2 mt-3 px-4 text-gray-800 leading-tight focus:outline-none focus:bg-white focus:border-green-500" type="text" name={props.chave} />{" X"}<sub>{props.number}</sub></label>
const CondicaoComponent = props => (
  <select className="form-select appearance-none
  px-3
  py-1.5
  ml-2
  text-base
  font-normal
  text-gray-700
  bg-white bg-clip-padding bg-no-repeat
  border border-solid border-gray-300
  rounded
  transition
  ease-in-out
  
  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example" name={props.chave}>
    <option value="-1">{'<='}</option>
    <option value="0">{'>='}</option>
    <option value="1"> = </option>
  </select>
);

