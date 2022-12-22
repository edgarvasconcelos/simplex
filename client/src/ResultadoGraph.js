import { useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from "./Components/Footer";
import Stack from '@mui/material/Stack';
import { useParams, useNavigate, json } from "react-router-dom";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';



const ResultadoGraph = () => {
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


  

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       // const {data: response} = await axios.get('http://localhost:5000/simplex/apply-simplex/', configHeaders);
  //       // setData(response);
  //       // console.log(response)
  //       fetch('http://localhost:5000/simplex/apply-simplex/', {
  //         method: 'POST',
  //         headers: {
  //           'Accept': 'application/json',
  //           'Content-Type': 'application/json',
  //         },
  //         mode: 'cors',
  //         body: jsonData // body data type must match "Content-Type" header
  //       })
  //         .then(
  //           res => res.json()
  //         ).then(
  //           data => {
  //             // resultado: data
  //             setData(data)
  //           }
  //         )
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //     setLoading(false);
  //   }

  //   fetchData();
  // });

            return (
              <>
                <Box
                  sx={{
                    bgcolor: 'background.paper',
                    pt: 8,
                    pb: 6,
                  }}
                >
                  <Container maxWidth="sm">
                    <Typography
                      component="h2"
                      variant="h2"
                      align="center"
                      color="text.primary"
                      gutterBottom
                    >
                      Método Gráfico
                    </Typography>
                  </Container>
                </Box>
                <Stack
          sx={{ pt: 4 }}
          direction="row"
          spacing={2}
          justifyContent="center"
        >

          <button className="inline-block px-6 py-2 border-2 border-blue-600 text-blue-600 font-medium text-xs leading-tight uppercase rounded-full hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out" onClick={goBack}>Voltar</button>
        </Stack>
        <Footer></Footer>
              </>

            );
          


}

export default ResultadoGraph;










