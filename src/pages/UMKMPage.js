import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Button, Container, Stack, Typography } from '@mui/material';
// components
import Iconify from '../components/iconify';
// mock
import POSTS from '../_mock/blog';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../providers/authProvider';
import TourismPostCard from '../sections/@dashboard/tourism/TourismPostCard';

import toast, { Toaster } from 'react-hot-toast';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

// ----------------------------------------------------------------------

export default function UMKMPage() {
  const { api } = useContext(AuthContext);
  const [data, setData] = useState({ umkms: [], meta: { limit: 0, total: 0, offset: 0 } });

  const navigate = useNavigate();
  const location = useLocation();

  const successMessage = location.state?.successMessage || null;

  useEffect(() => {
    (async () => {
      const response = await api.get('/api/umkms/');
      if (response.status === 200) {
        setData(response.data);
      } else {
        throw new Error('Invalid username or password');
      }
    })();

    if (successMessage) {
      toast.success(successMessage);
    }
  }, []);

  return (
    <>
      <Helmet>
        <title> UMKM Kebondowo </title>
      </Helmet>

      <Toaster />

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            UMKM
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => navigate('/dashboard/umkm/new')}
          >
            UMKM Baru
          </Button>
        </Stack>

        {/* <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch posts={data.articles} />
          <BlogPostsSort options={SORT_OPTIONS} />
        </Stack> */}

        <Grid container spacing={3}>
          {data.umkms.map((post) => (
            <TourismPostCard key={post.id} post={post} index={0} path={'umkm'} />
          ))}
        </Grid>
      </Container>
    </>
  );
}
