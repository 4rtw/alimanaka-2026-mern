'use client';

import { useEffect } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
      <Typography variant="h4" sx={{ mb: 2, color: 'error.main' }}>
        Misy olana
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        Tsy nahavita nampiditra ny angon-drakitra.
      </Typography>
      <Button variant="contained" onClick={() => reset()}>
        Avereno
      </Button>
    </Container>
  );
}
