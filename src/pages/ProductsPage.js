import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
// @mui
import { Button, Container, Modal, Stack, TextField, Typography } from '@mui/material';
// components
import { ProductSort, ProductList } from '../sections/@dashboard/products';
// mock
import { AuthContext } from '../providers/authProvider';
import Iconify from '../components/iconify/Iconify';
import FileUpload from '../components/form/FileUpload';

import { supabase } from '../supabaseClient';

// ----------------------------------------------------------------------

export default function GalleriesPage() {
  const { accessToken, api } = useContext(AuthContext);
  const [data, setData] = useState({ galleries: [], meta: { limit: 0, total: 0, offset: 0 } });
  const [openFilter, setOpenFilter] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await api.get('/api/galleries/');
      if (response.status === 200) {
        // console.log(response.data);
        setData(response.data);
      } else {
        throw new Error('Invalid username or password');
      }
    })();
  }, []);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCaption('');
    setImage(null);
    setPreviewImage(null);
  };

  const handleCaptionChange = (event) => {
    setCaption(event.target.value);
  };

  const handleSubmit = async () => {
    // Implement your logic to upload the image and caption
    const fileExtension = image.name.split('.').pop(); // Get the file extension from the image name
    const timestamp = Date.now(); // Get the current timestamp

    const newImageName = `${timestamp}-${image.name}.${fileExtension}`;

    const { img, error } = await supabase.storage
      .from('desa-wisata-kebondowo-bucket')
      .upload('gallery/' + newImageName, image);

    const path = process.env.REACT_APP_SUPABASE_STORAGE_URL + 'gallery/' + newImageName;

    const postResponse = await api.post('/api/galleries/', { caption, picture_url: path });

    // Reset form values
    setCaption('');
    setImage(null);
    setPreviewImage(null);
    handleCloseModal();

    // set new data on state
    setData((prevState) => ({
      ...prevState,
      galleries: [
        {
          id: postResponse.data.gallery.id,
          caption,
          picture_url: path,
        },
        ...prevState.galleries,
      ],
      meta: {
        ...prevState.meta,
        total: prevState.meta.total + 1,
      },
    }));
  };

  return (
    <>
      <Helmet>
        <title>Galeri Kebondowo</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Galeri</Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModal}>
            Foto Baru
          </Button>
        </Stack>

        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            {/* <ProductFilterSidebar
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            /> */}
            <ProductSort />
          </Stack>
        </Stack>

        <ProductList products={data.galleries} />
        {/* <ProductCartWidget />  */}
      </Container>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Container
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'white',
            p: 4,
          }}
        >
          <Typography variant="h5" mb={3}>
            Upload Foto Baru
          </Typography>
          <TextField label="Caption" value={caption} onChange={handleCaptionChange} fullWidth sx={{ mb: 3 }} />

          <FileUpload onFileChange={setImage} />

          <Button variant="contained" onClick={handleSubmit} disabled={!image} sx={{ mt: 3 }}>
            Upload
          </Button>
        </Container>
      </Modal>
    </>
  );
}
