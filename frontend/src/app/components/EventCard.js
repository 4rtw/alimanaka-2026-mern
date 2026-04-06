'use client';

import {
  Card, CardContent, Typography, Chip, Box, Divider
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  MenuBook as BibleIcon,
  MonetizationOn as MoneyIcon,
  RestaurantMenu as CommunionIcon,
  EventNote as DescriptionIcon,
  Place as LocationIcon,
  Today as TodayIcon,
  ColorLens as ColorIcon
} from '@mui/icons-material';
import { LITURGICAL_COLORS, DEFAULT_ACCENT } from '../../lib/constants';

export default function EventCard({ event, cardRef, isToday }) {
  const colorInfo = LITURGICAL_COLORS[event.color] || { bg: '#fff', border: DEFAULT_ACCENT, label: null };
  const bgColor = colorInfo.bg;
  const borderColor = colorInfo.border;
  const colorLabel = colorInfo.label;

  return (
    <Card
      ref={cardRef}
      sx={{
        borderRadius: 3,
        boxShadow: isToday ? 6 : 3,
        height: '100%',
        position: 'relative',
        bgcolor: bgColor,
        borderLeft: `10px solid ${borderColor}`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': { transform: 'scale(1.02)', boxShadow: isToday ? 8 : 5 },
        outline: isToday ? `3px solid ${DEFAULT_ACCENT}` : 'none',
        outlineOffset: isToday ? '2px' : 0,
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1} flexWrap="wrap" gap={0.5}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {event.date} {event.day}
            </Typography>
            {isToday && (
              <Chip
                icon={<TodayIcon />}
                label="ANIO"
                size="small"
                sx={{ bgcolor: DEFAULT_ACCENT, color: '#fff', fontWeight: 'bold' }}
              />
            )}
          </Box>
          <Box display="flex" gap={0.5}>
            {colorLabel && (
              <Chip
                icon={<ColorIcon sx={{ color: borderColor }} />}
                label={colorLabel}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            )}
            {event.fandraisana && (
              <Chip
                icon={<CommunionIcon />}
                label="FANDRAISANA"
                size="small"
                color="primary"
              />
            )}
          </Box>
        </Box>

        <Typography variant="h6" sx={{ mb: 1, fontStyle: 'italic', color: '#555' }}>
          {event.title}
        </Typography>

        {event.location && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1, color: '#d32f2f' }}>
            <LocationIcon fontSize="small" />
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {event.location}
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 1.5 }} />

        {event.fidirana && event.fidirana.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
            <TimeIcon color="action" fontSize="small" />
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Fidirana: {event.fidirana.join(', ')}
            </Typography>
          </Box>
        )}

        {event.vakiteny && event.vakiteny.length > 0 && (
          <Box sx={{ mb: 1 }}>
            <Typography
              variant="body2"
              sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', gap: 1, mb: 0.5 }}
            >
              <BibleIcon color="action" fontSize="small" /> Vakiteny:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, pl: 3 }}>
              {event.vakiteny.map((v, i) => (
                <Chip size="small" label={v} key={`${event._id}-vak-${i}`} variant="outlined" />
              ))}
            </Box>
          </Box>
        )}

        {event.rakitra && event.rakitra.length > 0 && (
          <Box sx={{ mb: 1 }}>
            <Typography
              variant="body2"
              sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', gap: 1 }}
            >
              <MoneyIcon color="action" fontSize="small" /> Rakitra:
            </Typography>
            <Typography variant="body2" sx={{ pl: 3, fontStyle: 'italic' }}>
              {event.rakitra.join(', ')}
            </Typography>
          </Box>
        )}

        {event.description && event.description.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Typography
              variant="body2"
              sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', gap: 1 }}
            >
              <DescriptionIcon color="action" fontSize="small" /> Fanamarihana:
            </Typography>
            <Typography variant="body2" sx={{ pl: 3 }}>
              {event.description.join(' ')}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
