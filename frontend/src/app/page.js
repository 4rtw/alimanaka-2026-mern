'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Container, Typography, Box, Tabs, Tab, Grid,
  Paper, CircularProgress, Alert, Button, Divider, Skeleton, Card, CardContent
} from '@mui/material';
import { EventNote as CalendarIcon } from '@mui/icons-material';
import { getEvents } from '../lib/api';
import EventCard from './components/EventCard';
import { MALAGASY_MONTHS, API_MONTHS, SCROLL_DELAY_MS, LITURGICAL_YEAR } from '../lib/constants';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Freeze today's date on mount — avoids midnight recompute issues
  const [today] = useState(() => new Date());
  const initialMonth = today.getMonth();
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const eventRefs = useRef([]);

  const fetchData = useCallback(async (month) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEvents(LITURGICAL_YEAR, month);
      setEvents(data);
    } catch (err) {
      setError('Tsy nahazo ny angon-drakitra avy amin\'ny mpizara.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(API_MONTHS[selectedMonth]);
  }, [selectedMonth, fetchData]);

  useEffect(() => {
    if (events.length > 0 && selectedMonth === initialMonth) {
      const currentDay = today.getDate();
      let targetIdx = -1;
      for (let i = 0; i < events.length; i++) {
        const eventDay = parseInt(events[i].date.split(/[–-]/)[0]);
        if (eventDay >= currentDay) {
          targetIdx = i;
          break;
        }
      }

      if (targetIdx !== -1 && eventRefs.current[targetIdx]) {
        setTimeout(() => {
          eventRefs.current[targetIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, SCROLL_DELAY_MS);
      }
    }
  }, [events, selectedMonth, initialMonth, today]);

  // Check if an event falls on today — handles multi-day ranges
  const isEventToday = (event) => {
    if (selectedMonth !== initialMonth) return false;
    const parts = event.date.split(/[–-]/);
    const startDay = parseInt(parts[0]);
    const endDay = parts.length > 1 ? parseInt(parts[parts.length - 1]) : startDay;
    const currentDay = today.getDate();
    return currentDay >= startDay && currentDay <= endDay;
  };

  const handleRetry = () => {
    fetchData(API_MONTHS[selectedMonth]);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={2}>
          <CalendarIcon sx={{ fontSize: 40, color: '#e26f5a' }} />
          <Typography
            variant="h3"
            sx={{ fontWeight: 'bold', color: '#e26f5a', textTransform: 'uppercase' }}
          >
            Alimanaka {LITURGICAL_YEAR}
          </Typography>
        </Box>
        <Typography variant="subtitle1" align="center" sx={{ mb: 3, fontStyle: 'italic', color: 'text.secondary' }}>
          Fiangonana Loterana Malagasy — Filazantsara sy Fanompoam-pivavahana
        </Typography>

        {/* Month Tabs */}
        <Paper elevation={0} sx={{ mb: 4, borderRadius: 2 }}>
          <Tabs
            value={selectedMonth}
            onChange={(e, v) => setSelectedMonth(v)}
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
            aria-label="Select month"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            {MALAGASY_MONTHS.map((m, idx) => (
              <Tab label={m} key={idx} sx={{ fontWeight: 'bold' }} />
            ))}
          </Tabs>
        </Paper>

        {/* Loading */}
        {loading && (
          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card sx={{ borderRadius: 3, boxShadow: 3, height: '100%' }}>
                  <CardContent>
                    <Skeleton variant="text" width={120} height={40} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="60%" sx={{ mb: 1 }} />
                    <Skeleton variant="rectangular" height={8} sx={{ my: 2 }} />
                    <Skeleton variant="text" width="70%" />
                    <Skeleton variant="text" width="50%" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }} action={
            <Button color="inherit" size="small" onClick={handleRetry}>Avereno</Button>
          }>
            {error}
          </Alert>
        )}

        {/* Empty */}
        {!loading && !error && events.length === 0 && (
          <Alert severity="info" sx={{ mb: 4 }}>
            Tsy misy hetsika voasoratra amin&apos;ity volana ity.
          </Alert>
        )}

        {/* Events */}
        {!loading && (
          <Grid container spacing={3}>
            {events.map((event, idx) => (
              <Grid item xs={12} sm={6} md={4} key={event._id || idx}>
                <EventCard
                  event={event}
                  cardRef={el => { eventRefs.current[idx] = el; }}
                  isToday={isEventToday(event)}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Footer */}
        <Divider sx={{ my: 6 }} />
        <Box textAlign="center" sx={{ color: 'text.secondary', mb: 4 }}>
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
            Alimanaka {LITURGICAL_YEAR} — Fiangonana Loterana Malagasy (FLM)
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
            Fampiasana an-tsitrapo ho an&apos;ny Fiangonana
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
