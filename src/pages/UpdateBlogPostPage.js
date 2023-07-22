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

export default function UpdateBlogPostPage() {
  const { articleSlug } = useParams();
  const navigate = useNavigate();
  const { api } = useContext(AuthContext);

  const [id, setId] = useState(0);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [pictureUrl, setPictureUrl] = useState('');
  const [slug, setSlug] = useState('');

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await api.get(`/api/articles/${articleSlug}`);
      if (response.status === 200) {
        setId(response.data.article.id);
        setTitle(response.data.article.title);
        setAuthor(response.data.article.author);
        setContent(response.data.article.content);
        setSlug(response.data.article.slug);
        setPictureUrl(response.data.article.picture_url);
      } else {
        throw new Error('Invalid username or password');
      }
    })();
  }, []);

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
    let picture_url = '';

    if (image) {
      // Delete old image
      const { data, error } = await supabase.storage
        .from('desa-wisata-kebondowo-bucket')
        .remove([pictureUrl.split('desa-wisata-kebondowo-bucket/')[1]]);
      const timestamp = Date.now(); // Get the current timestamp

      const newImageName = `${timestamp}-${image.name}`;

      // Upload image to Supabase Storage bucket
      await supabase.storage.from('desa-wisata-kebondowo-bucket').upload('articles/' + newImageName, image);

      picture_url = process.env.REACT_APP_SUPABASE_STORAGE_URL + 'articles/' + newImageName;
    }

    const postResponse = await api.put(`/api/articles/${id}`, {
      title,
      author,
      content,
      slug,
      picture_url,
    });

    // Redirect to the article page
    navigate('/dashboard/articles');
  };

  const handleDeleteArticle = async () => {
    const { data, error } = await supabase.storage
      .from('desa-wisata-kebondowo-bucket')
      .remove([pictureUrl.split('desa-wisata-kebondowo-bucket/')[1]]);

    await api.delete(`/api/articles/${id}`);

    navigate('/dashboard/articles');
  };

  return (
    <>
      <Helmet>
        <title>Artikel Baru</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Ubah Artikel
          </Typography>
        </Stack>

        <form onSubmit={handleSubmit}>
          <TextField label="Title" value={title} onChange={handleTitleChange} fullWidth required sx={{ mb: 3 }} />
          <TextField
            label="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            fullWidth
            required
            sx={{ mb: 3 }}
            disabled
          />

          <TextField
            label="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            fullWidth
            required
            sx={{ mb: 3 }}
          />

          {/* React Quill Rich Text Editor */}
          <ReactQuill value={content} onChange={handleContentChange} theme="snow" />
          <div style={{ marginBottom: '24px' }}></div>

          <ImageUpload onFileChange={setImage} oldImage={pictureUrl} />

          <Button variant="contained" onClick={handleSubmit} sx={{ mt: 3 }} disabled={!title || !author || !content}>
            Simpan
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              setDeleteModalOpen(true);
            }}
            sx={{ mt: 3, ml: 2 }}
          >
            Hapus
          </Button>
        </form>
      </Container>

      <Dialog open={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle>Hapus Artikel</DialogTitle>
        <DialogContent>
          <DialogContentText>Apakah Anda yakin ingin menghapus artikel ini?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)}>Batal</Button>
          <Button color="error" onClick={handleDeleteArticle}>
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
