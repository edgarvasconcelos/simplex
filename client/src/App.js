import React, { useState } from 'react';

import "./index.css";
import TipoOtimizacao from './Components/TipoOtimizacao';
import ChildComponent from './Components/ChildComponent';
import CondicaoComponent from './Components/CondicaoComponent';
import ResultadoComponent from './Components/ResultadoComponent';
import TabelaResultado from './Components/TabelaResultado';
import PaginaInicial from './Components/PaginaInicial';
import ResultadoGrafico from './Components/ResultadoGrafico';

class AppComponent extends React.Component {

  state = {
    numChildren: 0,
    numVaraveis: 0,
    resultado: {},
    changed: 0,
    selectOptionValue: '1'
  }


  handleOnChange = (e) => {
    this.setState({
      selectOptionValue: e.target.value
    })
  }
  handleSubmit = (event) => {
    // const metodo = event.target[0].value
    const quantidade_variaveis = event.target[0].value
    const quantidade_restricoes = event.target[1].value

    this.setState({
      numChildren: quantidade_restricoes,
      numVaraveis: quantidade_variaveis,
      //tipoSimplex: metodo,
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

    //Mostra a página com os resultados se tiver valores dentro do simplexResult
    if (simplexResult.length != 0) {
      const variaveis = Object.values(simplexResult[0]['solucao_basica'])
      var iteracao = 0
      if (this.state.selectOptionValue == 2) {
        { console.log(this.state.selectOptionValue) }
        return (
          //Mostra o resultado das tabelas com as iterações
          <ResultadoGrafico />

        )
      }
      else {
        return (
          //Mostra o resultado das tabelas com as iterações
          <TabelaResultado variaveis={variaveis} simplexResult={simplexResult} />
        )
      }

    }
    //Mostra a página para preencher os campos do problema
    if (this.state.changed) {
      children.push(<TipoOtimizacao />);
      for (var v = 1; v <= this.state.numVaraveis; v += 1) {
        children.push(<ChildComponent key={'z' + v} chave={'z' + v} number={v} />);
        if (v != this.state.numVaraveis) {
          children.push(<pre style={{ display: 'inline-flex' }}> + </pre>)
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
            children.push(<pre style={{ display: 'inline-flex' }}> + </pre>)
          }
        }
        children.push(<br></br>)
      }
      for (var v = 1; v <= this.state.numVaraveis; v += 1) {
        children.push(<p style={{ display: 'inline' }}>X<sub>{v}</sub></p>);
        if (v == this.state.numVaraveis) {
          children.push(<p style={{ display: 'inline-flex' }}> {'>= 0'} </p>)
        } else {
          children.push(<p style={{ display: 'inline' }}>,</p>);
        }
      }

      // Página para preencher com os valores 
      return (
        <div class="container mx-auto flex">
          <div className=" b py-20 px-4 sm:px-6 h-full w-screen justify-center items-center">
            <form onSubmit={this.handleSubmitData}>
              {console.log(children)}
              {children}
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
        <PaginaInicial />


        <div className=" b py-20 bg-green-50 px-4 sm:px-6 h-full w-screen flex justify-center items-center">

          <div className="flex flex-wrap -mx-3 mb-6">
            <label for="tipo" className=" tracking-wide text-gray-700 text-lg  mb-2">Selecione o método para resolução do problema: </label>
            <select name="tipo" className="ml-2 form-select appearance-none px-3 py-0 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300
              rounded transition ease-in-out mr-5 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example" value={this.state.selectOptionValue} onChange={this.handleOnChange} >
              <option value="0">Simplex</option>
              <option value="1">Dual</option>
              <option value="2">Gráfico</option>
            </select>
          </div>
        </div>

        {console.log(this.state.selectOptionValue)}

        <div className=" b py-20 bg-green-50 px-4 sm:px-6 h-full w-screen flex justify-center items-center">

          <form className="w-full max-w-lg" onSubmit={this.handleSubmit}>

            <div className="flex flex-wrap -mx-3 mb-6">
              {
                (() => {
                  if (this.state.selectOptionValue == 1) {
                    return (
                      <>
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                          <label className="tracking-wide text-gray-700 text-lg mb-2">
                            Quantidade de variáveis
                          </label>

                          <input id="quantidade_variaveis" className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" name="variaveis" type="number" required ref={node => (this.inputNode = node)}></input>

                        </div>
                        <div className="w-full md:w-1/2 px-3">
                          <label className=" tracking-wide text-gray-700 text-lg  mb-2">
                            Quantidade de restricões
                          </label>
                          <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" name="restricoes" type="number" required ref={node => (this.inputNode = node)}></input>


                        </div>
                      </>


                    )
                  } else if (this.state.selectOptionValue == 2) {
                    return (
                      <>
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                          <label className="tracking-wide text-gray-700 text-lg mb-2">
                            Quantidade de variáveis
                          </label>

                          <input id="quantidade_variaveis" className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" name="variaveis" type="number" required value={2} ref={node => (this.inputNode = node)}></input>

                        </div>
                        <div className="w-full md:w-1/2 px-3">
                          <label className=" tracking-wide text-gray-700 text-lg  mb-2">
                            Quantidade de restricões
                          </label>
                          <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" name="restricoes" type="number" required ref={node => (this.inputNode = node)}></input>


                        </div>
                      </>
                    )
                  }
                  else {
                    return (
                      <>
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                          <label className="tracking-wide text-gray-700 text-lg mb-2">
                            Quantidade de variáveis
                          </label>

                          <input id="quantidade_variaveis" className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" name="variaveis" type="number" required ref={node => (this.inputNode = node)}></input>

                        </div>
                        <div className="w-full md:w-1/2 px-3">
                          <label className=" tracking-wide text-gray-700 text-lg  mb-2">
                            Quantidade de restricões
                          </label>
                          <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" name="restricoes" type="number" required ref={node => (this.inputNode = node)}></input>


                        </div>
                      </>


                    )
                  }
                })()
              }

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


}

export default AppComponent;

