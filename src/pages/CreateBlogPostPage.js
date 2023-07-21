import { Helmet } from 'react-helmet-async';
import { Container, Typography, Button, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageUpload from '../components/form/FileUpload';

export default function CreateBlogPostPage() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [slug, setSlug] = useState('');

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
  const handleSubmit = (event) => {
    event.preventDefault();
    // Implement your logic to save the article
    console.log('Title:', title);
    console.log('Author:', author);
    console.log('Content:', content);
    console.log('Slug:', slug);
    console.log('Image', image);
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

          <ImageUpload onFileChange={setImage} />

          <Button variant="contained" onClick={handleSubmit} sx={{ mt: 3 }}>
            Save
          </Button>
        </form>
      </Container>
    </>
  );
}
