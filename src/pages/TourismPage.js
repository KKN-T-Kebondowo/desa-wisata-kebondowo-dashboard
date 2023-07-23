import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Button, Container, Stack, Typography } from '@mui/material';
// components
import Iconify from '../components/iconify';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';
// mock
import POSTS from '../_mock/blog';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../providers/authProvider';
import TourismPostCard from '../sections/@dashboard/tourism/TourismPostCard';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

// ----------------------------------------------------------------------

export default function BlogPage() {
  const { api } = useContext(AuthContext);
  const [data, setData] = useState({ tourisms: [], meta: { limit: 0, total: 0, offset: 0 } });

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const response = await api.get('/api/tourisms/');
      if (response.status === 200) {
        setData(response.data);
      } else {
        throw new Error('Invalid username or password');
      }
    })();
  }, []);

  return (
    <>
      <Helmet>
        <title> Wisata Kebondowo </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Wisata
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => navigate('/dashboard/tourisms/new')}
          >
            Wisata Baru
          </Button>
        </Stack>

        {/* <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch posts={data.articles} />
          <BlogPostsSort options={SORT_OPTIONS} />
        </Stack> */}

        <Grid container spacing={3}>
          {data.tourisms.map((post) => (
            <TourismPostCard key={post.id} post={post} index={0} />
          ))}
        </Grid>
      </Container>
    </>
  );
}
