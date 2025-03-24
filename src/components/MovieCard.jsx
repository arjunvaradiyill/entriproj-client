import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Rating,
  Box,
  Chip,
  IconButton,
  Stack,
  Button
} from '@mui/material';
import { ThumbUp, ThumbDown, Comment } from '@mui/icons-material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ReviewDialog from './ReviewDialog';

function MovieCard({ movie, onReviewSubmit }) {
  const [openReview, setOpenReview] = useState(false);
  const { isAuthenticated } = useSelector(state => state.auth);
  const averageRating = movie.averageRating || 0;

  const handleReviewClick = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add a review');
      return;
    }
    setOpenReview(true);
  };

  return (
    <Card sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'scale(1.02)'
      }
    }}>
      <CardMedia
        component="img"
        height="400"
        image={movie.poster}
        alt={movie.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {movie.title}
        </Typography>
        
        <Box display="flex" alignItems="center" mb={1}>
          <Rating 
            value={averageRating} 
            readOnly 
            precision={0.5}
            size="small"
          />
          <Typography variant="body2" color="text.secondary" ml={1}>
            ({movie.reviews?.length || 0} reviews)
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
          {movie.genre.map((genre) => (
            <Chip
              key={genre}
              label={genre}
              size="small"
              sx={{ marginBottom: 1 }}
            />
          ))}
        </Stack>

        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {movie.description}
        </Typography>

        <Box mt={2} display="flex" justifyContent="space-between">
          <Button
            size="small"
            startIcon={<Comment />}
            onClick={handleReviewClick}
            variant="outlined"
          >
            Review
          </Button>
          <Box>
            <IconButton size="small">
              <ThumbUp fontSize="small" />
            </IconButton>
            <IconButton size="small">
              <ThumbDown fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>

      <ReviewDialog
        open={openReview}
        onClose={() => setOpenReview(false)}
        onSubmit={(review) => {
          onReviewSubmit(movie._id, review);
          setOpenReview(false);
        }}
        movie={movie}
      />
    </Card>
  );
}

export default MovieCard; 