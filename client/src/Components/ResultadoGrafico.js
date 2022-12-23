import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from "../Components/Footer";
import Stack from '@mui/material/Stack';
import { useParams, useNavigate, json, useSearchParams } from "react-router-dom";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
const ResultadoGrafico = () => {

  const [searchParams, setSearchParams] = useSearchParams();
 
  const dataObject = Object.fromEntries(searchParams.entries());
  const jsonData = JSON.stringify(dataObject)
  // console.log(jsonData)
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([])
  
  
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
  console.log(data)
    //var iteracao = 0
  return (

    <div className=" b py-20 px-4 sm:px-6 h-full w-screen justify-center items-center">
    <div className="overflow-x-auto relative">
          <hi>Página do Gráfico</hi>
        
    </div>
    </div>
      
      )
    
}

export default ResultadoGrafico;