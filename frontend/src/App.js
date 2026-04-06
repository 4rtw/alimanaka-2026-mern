import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, Typography, Box, Tabs, Tab, Grid, Card, CardContent, 
  Chip, Divider, List, ListItem, ListItemText, ListItemIcon, 
  ThemeProvider, createTheme, Paper
} from '@mui/material';
import { 
  AccessTime as TimeIcon, 
  MenuBook as BibleIcon, 
  MonetizationOn as MoneyIcon, 
  RestaurantMenu as CommunionIcon,
  EventNote as DescriptionIcon,
  Place as LocationIcon
} from '@mui/icons-material';

const theme = createTheme({
  palette: { primary: { main: '#e26f5a' }, secondary: { main: '#ddcb6e' } },
  typography: { fontFamily: '"Lora", "Roboto", "Helvetica", "Arial", sans-serif' },
});

const monthMapping = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const colorMap = { white: "#fafafa", green: "#a5d6a7", red: "#ef9a9a", purple: "#ce93d8", brown: "#bcaaa4", yellow: "#fff59d", black: "#bdbdbd" };

function App() {
  const [events, setEvents] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  useEffect(() => { fetchEvents(monthMapping[selectedMonth]); }, [selectedMonth]);

  const fetchEvents = (month) => {
    const apiUrl = 'https://alimanaka.chantilly-shaula.ts.net:8443/api';
    axios.get(`${apiUrl}/events?year=2026&month=${month}`)
      .then(res => setEvents(res.data)).catch(err => console.error(err));
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f4f4f2' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h3" align="center" sx={{ fontWeight: 'bold', color: '#e26f5a', textTransform: 'uppercase', mb: 4 }}>Alimanaka 2026</Typography>
          <Paper elevation={0} sx={{ mb: 4, borderRadius: 2 }}>
            <Tabs value={selectedMonth} onChange={(e, v) => setSelectedMonth(v)} variant="scrollable" scrollButtons="auto" textColor="primary" indicatorColor="primary" sx={{ borderBottom: 1, borderColor: 'divider' }}>
              {monthMapping.map((m) => (<Tab label={m.toUpperCase()} key={m} sx={{ fontWeight: 'bold' }} />))}
            </Tabs>
          </Paper>
          <Grid container spacing={3}>
            {events.map((event, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card sx={{ borderRadius: 3, boxShadow: 3, height: '100%', position: 'relative', bgcolor: colorMap[event.color] || '#fff', borderLeft: `10px solid ${colorMap[event.color] || '#e26f5a'}` }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{event.date} {event.day}</Typography>
                      {event.fandraisana && <Chip icon={<CommunionIcon />} label="FANDRAISANA" size="small" color="primary" />}
                    </Box>
                    <Typography variant="h6" sx={{ mb: 1, fontStyle: 'italic', color: '#555' }}>{event.title}</Typography>
                    
                    {event.location && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1, color: '#d32f2f' }}>
                        <LocationIcon fontSize="small" />
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{event.location}</Typography>
                      </Box>
                    )}

                    <Divider sx={{ my: 1.5 }} />
                    {event.fidirana.length > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}><TimeIcon color="action" fontSize="small" /><Typography variant="body2" sx={{ fontWeight: 'bold' }}>Fidirana: {event.fidirana.join(', ')}</Typography></Box>
                    )}
                    {event.vakiteny.length > 0 && (
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', gap: 1, mb: 0.5 }}><BibleIcon color="action" fontSize="small" /> Vakiteny:</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, pl: 3 }}>{event.vakiteny.map((v, i) => (<Chip size="small" label={v} key={i} variant="outlined" />))}</Box>
                      </Box>
                    )}
                    {event.rakitra.length > 0 && (
                        <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', gap: 1 }}><MoneyIcon color="action" fontSize="small" /> Rakitra:</Typography>
                        <Typography variant="body2" sx={{ pl: 3, fontStyle: 'italic' }}>{event.rakitra.join(', ')}</Typography>
                        </Box>
                    )}
                    {event.description.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', gap: 1 }}><DescriptionIcon color="action" fontSize="small" /> Fanamarihana:</Typography>
                        <Typography variant="body2" sx={{ pl: 3 }}>{event.description.join(' ')}</Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
export default App;
