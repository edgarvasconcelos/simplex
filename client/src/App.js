import React, { useState } from 'react';
import TabelaResultado from './TabelaResultado';
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

  render () {
    const children = [];
    const simplexResult = Object.values(this.state.resultado)

    if (simplexResult.length != 0) {
      return(
        <div className="App">
          <table class="table">
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
              return (
                <>
                  {matriz.map((linha, key) => {
                    let row = Object.values(linha)
                    return (
                      <tr>
                        <th>X<sub>{variaveis_basicas[key]}</sub></th>
                      {row.map((value, index) => {
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

    if (this.state.changed) {
      for (var v=1; v <= this.state.numVaraveis; v+= 1) {
        children.push(<ChildComponent key={'z'+v} chave={'z'+v} number={v} />);
      }
      children.push(<br></br>)
      children.push(<br></br>)
      for (var i=1; i <= this.state.numChildren; i += 1) {
        for (var j=1; j <= this.state.numVaraveis; j+= 1) {
          if(j == this.state.numVaraveis) {
            let k = j +1;
            children.push(<ChildComponent key={i+''+j} chave={'x'+i+''+j} number={j} />);
            children.push(<CondicaoComponent key={'c'+i} chave={'x'+i+'c'} number={i} />);
            children.push(<ResultadoComponent key={i+''+k} chave={'x'+i+''+k} />);
            break;
          } else {
            children.push(<ChildComponent key={i+''+j} chave={'x'+i+''+j} number={j} />);
          }
        }
        children.push(<br></br>)
      };
      return (
          <div>
            <form onSubmit={this.handleSubmitData}>
              {children}
              <input type="submit" />
            </form>
          </div>
      );
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Quantidade de variaveis:
          <input
            type="text"
            name="variaveis"
            ref={node => (this.inputNode = node)}
          />
        </label>
        <label>
          Quantidade de restricoes:
          <input
            type="text"
            name="restricoes"
            ref={node => (this.inputNode = node)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    );
  }

  onAddChild = () => {
    this.setState({
      numChildren: this.state.numChildren + 1
    });
  }
}

export default AppComponent;

const ResultadoComponent = props =><label>{" = "}<input type="text" name={props.chave} /></label> 
const ChildComponent = props =><label><input type="text" name={props.chave} />{"X"}<sub>{props.number}</sub>{" + "}</label> 
const CondicaoComponent = props => (
  <select name={props.chave}>
    <option value="-1">{'<='}</option>
    <option value="0">{'>='}</option>
    <option value="1"> = </option>
  </select>
);
