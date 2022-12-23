import React from 'react';
import "./index.css";
import Routes from "./routes";
import { useNavigate } from 'react-router-dom';
import { Form } from "react-router-dom";
import PaginaInicial from './Components/PaginaInicial';
import Container from '@mui/material/Container';
import Footer from './Components/Footer';
import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';

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
            <div class="px-32 flex justify-center items-center">
                <div>
                    <PaginaInicial></PaginaInicial>
                </div>

                <Container sx={{ py: 8 }} maxWidth="md">
                <Typography variant="h5" align="center" color="text.secondary" paragraph>
                    Problema de Otimização
                </Typography>
            
                <Typography variant="h6" align="center" color="text.secondary" paragraph>
                    Escreva seu problema de programação linear abaixo
                </Typography>
                    {/* End hero unit */}
                    <div class="flex justify-center px-6">
                        <div class="flex flex-col md:flex-row md:max-w-x2 rounded-lg bg-white shadow-lg w-80">
                            <div class="p-6 flex flex-col justify-start">
                                <form className="w-full max-w-lg" onSubmit={handleSubmit} action="/inserir-dados">
                                    <div className="flex flex-wrap align-itens:center -mx-3 mb-6">
                                        <label htmlFor="metodo" className=" tracking-wide text-gray-700 text-lg  mb-2 ">Selecione o método para resolução do problema: </label>
                                        <select name="metodo" className="ml-2 form-select appearance-none px-3 py-0 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300
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
                                    <div class="flex justify-center">
                                        <button className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-50">Calcular</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </Container>

            </div>
            <Footer></Footer>
        </div>

    );
}
export default Home;