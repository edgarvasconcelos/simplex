import React from 'react';
import "./index.css";
import Routes from "./routes";
import {useNavigate} from 'react-router-dom';
import { Form } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const handleSubmit = event => {
        // console.log(event.target)
        // const data = new FormData(event.target);
        // console.log(data.getAll)
        // event.preventDefault();
        // navigate('/inserir-dados');
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
                <form className="w-full max-w-lg" onSubmit={handleSubmit} action="/inserir-dados">
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <label htmlFor="tipo" className=" tracking-wide text-gray-700 text-lg  mb-2">Selecione o método para resolução do problema: </label>
                        <select name="tipo" className="ml-2 form-select appearance-none px-3 py-0 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300
                        rounded transition ease-in-out mr-5 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example">
                        <option value="primal" selected>Simplex Primal</option>
                        <option value="dual">Simplex Dual</option>
                        <option value="grafico">Gráfico</option>
                        </select>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="tracking-wide text-gray-700 text-lg mb-2">
                            Quantidade de variáveis
                        </label>

                        <input id="quantidade_variaveis" className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" name="variaveis" type="text" ></input>
                        {/* <p class="text-red-500 text-xs italic">Please fill out this field.</p> */}
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                        <label className=" tracking-wide text-gray-700 text-lg  mb-2">
                            Quantidade de restricões
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" name="restricoes" type="text" ></input>
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
export default Home;