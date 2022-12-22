import "./App.css";
import { useParams, useNavigate, json } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import TipoOtimizacao from './Components/TipoOtimizacao';
import ChildComponent from './Components/ChildComponent';
import CondicaoComponent from './Components/CondicaoComponent';
import ResultadoComponent from './Components/ResultadoComponent';
import Container from '@mui/material/Container';
import Footer from "./Components/Footer";

const Restricoes = () => {
    const [searchParams] = useSearchParams();
    const tipo = searchParams.getAll('tipo')
    const variaveis = searchParams.getAll('variaveis')[0]
    const restricoes = searchParams.getAll('restricoes')[0]
    const estrutura = MontarEquacoes(tipo, variaveis, restricoes)
    const navigate = useNavigate();

    const handleSubmit = event => {
        const data = new FormData(event.target);
        data.append('variaveis', this.state.numVaraveis)
        data.append('restricoes', this.state.numChildren)
        const dataObject = Object.fromEntries(data.entries());
        const jsonData = JSON.stringify(dataObject)

        console.log(jsonData)

        const aplicarSimplex = (jsonData) => {
            navigate("/resultado-tabular", {
                state: {
                    dados: jsonData
                }
            });
        }
    }

    return (
<div>
        <Container sx={{ py: 8 }} maxWidth="lg">

            <div class="flex justify-center">
                <div class="flex flex-col md:flex-row md:max-w-x2 rounded-lg bg-white shadow-lg">
                    <div class="p-6 flex flex-col justify-start">
                        <form onSubmit={handleSubmit} action="resultado-tabular">
                            <input type="hidden" name="metodo" value={tipo}></input>
                            <input type="hidden" name="restricoes" value={restricoes}></input>
                            <input type="hidden" name="variaveis" value={variaveis}></input>
                            {estrutura}
                            <div className=" b py-3">
                                <button className="inline-block align-center bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" >
                                    Calcular
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>


        </Container>

<Footer></Footer>
        </div>
    );

}

export default Restricoes;

function MontarEquacoes(tipo, numVariaveis, numRestricoes) {
    const children = [];

    children.push(<TipoOtimizacao />);
    for (var v = 1; v <= numVariaveis; v += 1) {
        children.push(<ChildComponent key={'z' + v} chave={'z' + v} number={v} />);
        if (v != numVariaveis) {
            children.push(<pre style={{ display: 'inline-flex' }}> + </pre>)
        }
    }
    children.push(<br></br>)
    children.push(<br></br>)
    for (var i = 1; i <= numRestricoes; i += 1) {
        for (var j = 1; j <= numVariaveis; j += 1) {
            if (j == numVariaveis) {
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
    for (var v = 1; v <= numVariaveis; v += 1) {
        children.push(<p style={{ display: 'inline' }}>X<sub>{v}</sub></p>);
        if (v == numVariaveis) {
            children.push(<p style={{ display: 'inline-flex' }}> {'>= 0'} </p>)
        } else {
            children.push(<p style={{ display: 'inline' }}>,</p>);
        }
    }
    return children;
}
