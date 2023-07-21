import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
// @mui
import { Button, Container, Modal, Stack, TextField, Typography } from '@mui/material';
// components
import { ProductSort, ProductList } from '../sections/@dashboard/products';
// mock
import PRODUCTS from '../_mock/products';
import { AuthContext } from '../providers/authProvider';
import Iconify from '../components/iconify/Iconify';
import FileUpload from '../components/form/FileUpload';

// ----------------------------------------------------------------------

export default function GalleriesPage() {
  const { accessToken, api } = useContext(AuthContext);
  const [galleries, setGalleries] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await api.get('/api/galleries/');
      if (response.status === 200) {
        console.log(response);
        setGalleries(response.data.galleries);
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    // Implement your logic to upload the image and caption
    console.log('Caption:', caption);
    console.log('Image:', image);
    // Reset form values
    setCaption('');
    setImage(null);
    setPreviewImage(null);
    handleCloseModal();
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

        <ProductList products={galleries} />
        {/* <ProductCartWidget /> */}
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
