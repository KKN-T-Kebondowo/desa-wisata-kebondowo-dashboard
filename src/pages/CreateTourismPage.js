import { Helmet } from 'react-helmet-async';
import { Container, Typography, Button, Stack, TextField } from '@mui/material';
import { useContext, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageUpload from '../components/form/FileUpload';

import { supabase } from '../supabaseClient';
import { AuthContext } from '../providers/authProvider';
import { useNavigate } from 'react-router-dom';
import GoogleMapComponent from '../components/map/Map';

export default function CreateTourismPage() {
  const { api } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [slug, setSlug] = useState('');
  const [map, setMap] = useState({ lat: -7.3060529, lng: 110.4007872 });

  const handleMapClick = (clickedPosition) => {
    setMap(clickedPosition); // Update the map position state with the clicked position
  };

  const navigate = useNavigate();

  // Function to update the slug based on the title
  const handleTitleChange = (event) => {
    const newTitle = event.target.value;
    setTitle(newTitle);
    const slugifiedTitle = newTitle.toLowerCase().replace(/\s+/g, '-');
    setSlug(slugifiedTitle);
  };

  // Function to handle the rich text editor changes
  const handleContentChange = (value) => {
    setContent(value);
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Implement your logic to save the article
    console.log('Title:', title);
    console.log('Content:', content);
    console.log('Slug:', slug);
    console.log('Image', image);

    const timestamp = Date.now(); // Get the current timestamp

    const newImageName = `${timestamp}-${image.name}`;

    // Upload image to Supabase Storage bucket
    const { img, error } = await supabase.storage
      .from('desa-wisata-kebondowo-bucket')
      .upload('tourisms/' + newImageName, image);

    const picture_url = process.env.REACT_APP_SUPABASE_STORAGE_URL + 'tourisms/' + newImageName;

    const postResponse = await api.post('/api/tourisms/', {
      title,
      description: content,
      slug,
      cover_picture_url: picture_url,
      latitude: map.lat,
      longitude: map.lng,
    });

    // Redirect to the article page
    navigate('/dashboard/tourisms');
  };

  return (
    <>
      <Helmet>
        <title>Wisata Baru</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Buat Wisata Baru
          </Typography>
        </Stack>

        <form onSubmit={handleSubmit}>
          <TextField label="Judul" value={title} onChange={handleTitleChange} fullWidth required sx={{ mb: 3 }} />
          <TextField
            label="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            fullWidth
            required
            sx={{ mb: 3 }}
            disabled
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

          <ImageUpload onFileChange={setImage} />

          <Button variant="contained" onClick={handleSubmit} sx={{ mt: 3 }} disabled={!title || !content || !image}>
            Save
          </Button>
        </form>
      </Container>
    </>
  );
}
