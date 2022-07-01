import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';






const ResponsiveAppBar = () => {


  return (
    <AppBar position="static" sx={{ bgcolor: "#2DAE9A" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h4"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Roboto',
              fontWeight: 700,
              letterSpacing: '0.5px',
              color: '#1b2431',
              textDecoration: 'none',
            }}
          >
          <img
                src={
                  "https://upload.wikimedia.org/wikipedia/commons/9/92/Deribit_Company_Logo.svg"
                }
                alt="Deribit Logo"
              />
            Deribit
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>

          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Deribit
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>

          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
