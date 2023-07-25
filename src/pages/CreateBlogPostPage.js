import { Helmet } from 'react-helmet-async';
import { Container, Typography, Button, Stack, TextField } from '@mui/material';
import { useContext, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageUpload from '../components/form/FileUpload';

import { supabase } from '../supabaseClient';
import { AuthContext } from '../providers/authProvider';
import { useNavigate } from 'react-router-dom';

export default function CreateBlogPostPage() {
  const { api } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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

    const newImageName = `${timestamp}-${image.name}`;

    // Upload image to Supabase Storage bucket
    const { img, error } = await supabase.storage
      .from('desa-wisata-kebondowo-bucket')
      .upload('articles/' + newImageName, image);

    const picture_url = process.env.REACT_APP_SUPABASE_STORAGE_URL + 'articles/' + newImageName;

    const postResponse = await api.post('/api/articles/', {
      title,
      author,
      content,
      slug,
      picture_url,
    });

    // Redirect to the article page
    navigate('/dashboard/articles', { state: { successMessage: 'Berhasil membuat artikel!' } });
  };

  return (
    <>
      <Helmet>
        <title>Artikel Baru</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Buat Artikel Baru
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
            label="Penulis"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            fullWidth
            required
            sx={{ mb: 3 }}
          />

          {/* React Quill Rich Text Editor */}
          <ReactQuill value={content} onChange={handleContentChange} theme="snow" />
          <div style={{ marginBottom: '24px' }}></div>

          <ImageUpload onFileChange={setImage} />

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ mt: 3 }}
            disabled={!title || !author || !content || !image || loading}
          >
            Save
          </Button>
        </form>
      </Container>
    </>
  );
}
