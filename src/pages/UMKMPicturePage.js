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
import { useParams } from 'react-router-dom';

import toast, { Toaster } from 'react-hot-toast';

// ----------------------------------------------------------------------

export default function CreateUMKMPicturePage() {
  const { umkmSlug } = useParams();

  const { api } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [pictures, setPictures] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await api.get(`/api/umkms/${umkmSlug}`);
      if (response.status === 200) {
        setData(response.data.umkm);
        if (response.data.umkm.pictures) {
          setPictures(response.data.umkm.pictures);
        }
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
    const timestamp = Date.now(); // Get the current timestamp

    const newImageName = `${timestamp}-${image.name}`;

    const { img, error } = await supabase.storage
      .from('desa-wisata-kebondowo-bucket')
      .upload('umkm-pictures/' + newImageName, image);

    const picture_url = process.env.REACT_APP_SUPABASE_STORAGE_URL + 'umkm-pictures/' + newImageName;

    const postResponse = await api.post('/api/umkm-pictures/', { umkm_id: data.id, caption, picture_url });

    // Create the new picture object
    const newPicture = {
      id: postResponse.data.umkm_picture.id,
      picture_url: postResponse.data.umkm_picture.picture_url,
      caption: postResponse.data.umkm_picture.caption,
      umkm_id: data.id,
      created_at: postResponse.data.umkm_picture.created_at,
      updated_at: postResponse.data.umkm_picture.updated_at,
    };

    // Update the pictures state by adding the new picture to the existing array
    setPictures([...pictures, newPicture]);

    // Reset form values
    setCaption('');
    setImage(null);
    setPreviewImage(null);
    handleCloseModal();

    toast.success('Foto berhasil ditambahkan!');
  };

  const handleDeleteProduct = (pictureId) => {
    setPictures(pictures.filter((picture) => picture.id !== pictureId));
    toast.success('Foto berhasil dihapus!');
  };

  return (
    <>
      <Helmet>
        <title>Galeri Kebondowo</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Galeri {data.title}</Typography>
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

        <ProductList products={pictures} onDeleteProduct={handleDeleteProduct} path={'umkm-pictures'} />
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

          <Button variant="contained" onClick={handleSubmit} disabled={!image || !caption} sx={{ mt: 3 }}>
            Upload
          </Button>
        </Container>
      </Modal>
    </>
  );
}
