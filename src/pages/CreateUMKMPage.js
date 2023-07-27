import { Helmet } from 'react-helmet-async';
import { Container, Typography, Button, Stack, TextField } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageUpload from '../components/form/FileUpload';

import { supabase } from '../supabaseClient';
import { AuthContext } from '../providers/authProvider';
import { useNavigate } from 'react-router-dom';
import GoogleMapComponent from '../components/map/Map';

export default function CreateUMKMPage() {
  const { api } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contact, setContact] = useState('+62');
  const [owner, setOwner] = useState('');
  const [image, setImage] = useState(null);
  const [map, setMap] = useState({ lat: -7.3060529, lng: 110.4007872 });

  const [loading, setLoading] = useState(false);

  const handleMapClick = (clickedPosition) => {
    setMap(clickedPosition); // Update the map position state with the clicked position
  };

  const navigate = useNavigate();

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
    event.preventDefault();
    setLoading(true);

    const slug = title.toLowerCase().replace(/\s+/g, '-');

    const timestamp = Date.now(); // Get the current timestamp

    const newImageName = `${timestamp}-${image.name}`;

    // Upload image to Supabase Storage bucket
    const { img, error } = await supabase.storage
      .from('desa-wisata-kebondowo-bucket')
      .upload('umkms/' + newImageName, image);

    const picture_url = process.env.REACT_APP_SUPABASE_STORAGE_URL + 'umkms/' + newImageName;

    const postResponse = await api.post('/api/umkms/', {
      title,
      description: content,
      slug,
      cover_picture_url: picture_url,
      contact,
      contact_name: owner,
      latitude: map.lat,
      longitude: map.lng,
    });

    // Redirect to the article page
    navigate('/dashboard/umkm', { state: { successMessage: 'Berhasil menambahkan tempat umkm baru!' } });
    localStorage.removeItem('umkmDraft');
  };

  // Function to save the state to local storage
  const saveToLocalStorage = () => {
    if (!loading) {
      // Create an object to store the state variables you want to save
      const draftData = {
        title,
        content,
        contact,
        owner,
        image,
        map,
      };

      // Convert the object to a JSON string and save it to local storage
      localStorage.setItem('umkmDraft', JSON.stringify(draftData));
    }
  };

  const loadFromLocalStorage = () => {
    // Get the JSON string from local storage and parse it back to an object
    const savedData = localStorage.getItem('umkmDraft');
    if (savedData) {
      const parsedData = JSON.parse(savedData);

      // Update the state variables with the values from local storage
      setTitle(parsedData.title || '');
      setContent(parsedData.content || '');
      setContact(parsedData.contact || '+62');
      setOwner(parsedData.owner || '');
      setImage(parsedData.image || null);
      setMap(parsedData.map || { lat: -7.3060529, lng: 110.4007872 });
    }
  };

  // Use the useEffect hook to save the state to local storage whenever it changes
  useEffect(() => {
    const intervalId = setInterval(() => {
      saveToLocalStorage();
    }, 0);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [title, content, contact, owner, image, map, loading]);

  // Use the useEffect hook to load the state from local storage when the component mounts
  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  return (
    <>
      <Helmet>
        <title>UMKM Baru</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Buat UMKM Baru
          </Typography>
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

          <ImageUpload onFileChange={setImage} />

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ mt: 3 }}
            disabled={!title || !content || !image || loading}
          >
            Save
          </Button>
        </form>
      </Container>
    </>
  );
}
