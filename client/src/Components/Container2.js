
import * as React from 'react';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

export default function Container2() {
    return (

                <Container sx={{ py: 8 }} maxWidth="md">

                    <div class="flex justify-center">
                        <div class="flex flex-col md:flex-row md:max-w-x2 rounded-lg bg-white shadow-lg">
                            <div class="p-6 flex flex-col justify-start">
                               
                            </div>
                        </div>
                    </div>
                </Container>
            

    );
}