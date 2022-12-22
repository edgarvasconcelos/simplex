import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import header from '../Assets/Images/2.png'
 
const PaginaInicial = () => {
 
 return (
   <Box
     sx={{
       bgcolor: 'background.paper',
       pt: 8,
       pb: 6,
     }}
   >
     <Container maxWidth="sm">
       {/* <Typography
         component="h1"
         variant="h2"
         align="center"
         color="text.primary"
         gutterBottom
       >
         SimplexEasy
       </Typography> */}
       <img src={header}></img>
       <Typography variant="h5" align="center" color="text.secondary" paragraph>
         Problema de Otimização
       </Typography>
 
       <Typography variant="h6" align="center" color="text.secondary" paragraph>
         Escreva seu problema de programação linear abaixo
       </Typography>
 
 
       {/* <Stack
         sx={{ pt: 4 }}
         direction="row"
         spacing={2}
         justifyContent="center"
       >
         <Button variant="contained">alguma coisa</Button>
         <Button variant="outlined">outra coisa </Button>
       </Stack> */}
     </Container>
   </Box>
 )
 
}
 
export default PaginaInicial;