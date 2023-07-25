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

export default function UpdateUMKMPage() {
  const { umkmSlug } = useParams();
  const navigate = useNavigate();
  const { api } = useContext(AuthContext);

  const [id, setId] = useState(0);
  const [title, setTitle] = useState('');
  const [owner, setOwner] = useState('');
  const [contact, setContact] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [pictureUrl, setPictureUrl] = useState('');
  const [map, setMap] = useState({ lat: -7.3060529, lng: 110.4007872 });

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  // Fetch existing tourism data
  useEffect(() => {
    (async () => {
      const response = await api.get(`/api/umkms/${umkmSlug}`);
      if (response.status === 200) {
        setId(response.data.umkm.id);
        setTitle(response.data.umkm.title);
        setContact(response.data.umkm.contact);
        setOwner(response.data.umkm.contact_name);
        setContent(response.data.umkm.description);
        setMap({ lat: response.data.umkm.latitude, lng: response.data.umkm.longitude });
        setPictureUrl(response.data.umkm.cover_picture_url);
        setMap({ lat: response.data.umkm.latitude, lng: response.data.umkm.longitude });
      } else {
        throw new Error('Invalid umkm data');
      }
    })();
  }, []);

  // Function to handle the rich text editor changes
  const handleContentChange = (value) => {
    setContent(value);
  };

  const handlePhoneNumberBlur = () => {
    let clearContact = contact;
    if (contact && contact.startsWith('0')) {
      clearContact = contact.replace(/^0+/, '');
    }
    // Check if the contact has a value and if it doesn't start with "+62", add the prefix
    if (contact && !contact.startsWith('+62')) {
      clearContact = '+62' + clearContact;
    }
    setContact(clearContact);
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    const timestamp = Date.now(); // Get the current timestamp

    let picture_url = '';

    if (image) {
      // Delete old image
      const { data, error } = await supabase.storage
        .from('desa-wisata-kebondowo-bucket')
        .remove([pictureUrl.split('desa-wisata-kebondowo-bucket/')[1]]);
      const newImageName = `${timestamp}-${image.name}`;

      // Upload image to Supabase Storage bucket
      await supabase.storage.from('desa-wisata-kebondowo-bucket').upload('umkms/' + newImageName, image);

      picture_url = process.env.REACT_APP_SUPABASE_STORAGE_URL + 'umkms/' + newImageName;
    }

    const slug = title.toLowerCase().replace(/\s+/g, '-');

    const postResponse = await api.put(`/api/umkms/${id}`, {
      title,
      description: content,
      slug,
      contact,
      contact_name: owner,
      cover_picture_url: picture_url,
      latitude: map.lat,
      longitude: map.lng,
    });

    // Redirect to the tourism page
    navigate('/dashboard/umkm', { state: { successMessage: 'Berhasil mengubah UMKM!' } });
  };

  const handleDeleteTourism = async () => {
    setLoading(true);
    const { data, error } = await supabase.storage
      .from('desa-wisata-kebondowo-bucket')
      .remove([pictureUrl.split('desa-wisata-kebondowo-bucket/')[1]]);

    await api.delete(`/api/umkms/${id}`);

    navigate('/dashboard/umkm', { state: { successMessage: 'Berhasil menghapus UMKM!' } });
  };

  const handleMapClick = (clickedPosition) => {
    setMap(clickedPosition); // Update the map position state with the clicked position
  };

  return (
    <>
      <Helmet>
        <title>Ubah UMKM</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Ubah UMKM
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => navigate(`/dashboard/umkm/update/${umkmSlug}/pictures`)}
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

          <TextField
            label="Pemilik"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            fullWidth
            required
            sx={{ mb: 3 }}
          />
          <TextField
            label="Nomor HP Pemilik"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            onBlur={handlePhoneNumberBlur} // Add onBlur event to ensure the "+62" prefix remains
            fullWidth
            required
            placeholder="+62"
            sx={{ mb: 3 }}
            type="tel" // Set the input type to "tel" for phone numbers
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

          <Button variant="contained" onClick={handleSubmit} sx={{ mt: 3 }} disabled={!title || !content || loading}>
            Save
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={() => {
              setDeleteModalOpen(true);
            }}
            sx={{ mt: 3, ml: 2 }}
            disabled={loading}
          >
            Delete
          </Button>
        </form>
      </Container>

      <Dialog open={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle>Hapus UMKM</DialogTitle>
        <DialogContent>
          <DialogContentText>Apakah anda yakin untuk menghapus UMKM ini?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteTourism} disabled={loading}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
