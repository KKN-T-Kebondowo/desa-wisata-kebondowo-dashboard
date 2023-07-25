import { Helmet } from 'react-helmet-async';
import {
  Container,
  Typography,
  Button,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageUpload from '../components/form/FileUpload';

import { supabase } from '../supabaseClient';
import { AuthContext } from '../providers/authProvider';
import { useNavigate, useParams } from 'react-router-dom';
import GoogleMapComponent from '../components/map/Map';
import Iconify from '../components/iconify/Iconify';

export default function UpdateTourismPage() {
  const [loading, setLoading] = useState(false);
  const { tourismSlug } = useParams();
  const navigate = useNavigate();
  const { api } = useContext(AuthContext);

  const [id, setId] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [pictureUrl, setPictureUrl] = useState('');
  const [map, setMap] = useState({ lat: -7.3060529, lng: 110.4007872 });

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  // Fetch existing tourism data
  useEffect(() => {
    (async () => {
      const response = await api.get(`/api/tourisms/${tourismSlug}`);
      if (response.status === 200) {
        setId(response.data.tourism.id);
        setTitle(response.data.tourism.title);
        setContent(response.data.tourism.description);
        setMap({ lat: response.data.tourism.latitude, lng: response.data.tourism.longitude });
        setPictureUrl(response.data.tourism.cover_picture_url);
        setMap({ lat: response.data.tourism.latitude, lng: response.data.tourism.longitude });
      } else {
        throw new Error('Invalid tourism data');
      }
    })();
  }, []);

  // Function to handle the rich text editor changes
  const handleContentChange = (value) => {
    setContent(value);
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const slug = title.toLowerCase().replace(/\s+/g, '-');

    const timestamp = Date.now(); // Get the current timestamp

    let picture_url = '';

    if (image) {
      // Delete old image
      const { data, error } = await supabase.storage
        .from('desa-wisata-kebondowo-bucket')
        .remove([pictureUrl.split('desa-wisata-kebondowo-bucket/')[1]]);
      const newImageName = `${timestamp}-${image.name}`;

      // Upload image to Supabase Storage bucket
      await supabase.storage.from('desa-wisata-kebondowo-bucket').upload('tourisms/' + newImageName, image);

      picture_url = process.env.REACT_APP_SUPABASE_STORAGE_URL + 'tourisms/' + newImageName;
    }

    const postResponse = await api.put(`/api/tourisms/${id}`, {
      title,
      description: content,
      slug,
      cover_picture_url: picture_url,
      latitude: map.lat,
      longitude: map.lng,
    });

    // Redirect to the tourism page
    setLoading(false);
    navigate('/dashboard/tourisms', { state: { successMessage: 'Berhasil mengubah tempat wisata!' } });
  };

  const handleDeleteTourism = async () => {
    const { data, error } = await supabase.storage
      .from('desa-wisata-kebondowo-bucket')
      .remove([pictureUrl.split('desa-wisata-kebondowo-bucket/')[1]]);

    await api.delete(`/api/tourisms/${id}`);

    navigate('/dashboard/tourisms', { state: { successMessage: 'Berhasil menghapus tempat wisata!' } });
  };

  const handleMapClick = (clickedPosition) => {
    setMap(clickedPosition); // Update the map position state with the clicked position
  };

  return (
    <>
      <Helmet>
        <title>Wisata Baru</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Ubah Wisata
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => navigate(`/dashboard/tourisms/update/${tourismSlug}/pictures`)}
          >
            Tambah Foto
          </Button>
        </Stack>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Judul"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            sx={{ mb: 3 }}
          />

          {/* React Quill Rich Text Editor */}
          <ReactQuill value={content} onChange={handleContentChange} theme="snow" />
          <div style={{ marginBottom: '24px' }}></div>

          <GoogleMapComponent latitude={map.lat} longitude={map.lng} onMapClick={handleMapClick} />
          <div style={{ marginBottom: '24px' }}></div>
          <TextField
            label="Latitude"
            value={map.lat}
            onChange={(e) => setMap({ lat: parseFloat(e.target.value), lng: map.lng })}
            required
            type="number"
            sx={{ mb: 3, mr: 3 }}
          />
          <TextField
            label="Longitude"
            value={map.lng}
            onChange={(e) => setMap({ lat: map.lat, lng: parseFloat(e.target.value) })}
            required
            type="number"
          />

          <ImageUpload onFileChange={setImage} oldImage={pictureUrl} />

          <Button variant="contained" onClick={handleSubmit} sx={{ mt: 3 }} disabled={!title || !content}>
            Save
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={() => {
              setDeleteModalOpen(true);
            }}
            sx={{ mt: 3, ml: 2 }}
          >
            Delete
          </Button>
        </form>
      </Container>

      <Dialog open={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle>Delete Tourism</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this tourism?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteTourism}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
