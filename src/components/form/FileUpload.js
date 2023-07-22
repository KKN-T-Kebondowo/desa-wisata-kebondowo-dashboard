import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

const ImageUpload = ({ onFileChange, oldImage }) => {
  const [previewImage, setPreviewImage] = useState(oldImage);

  useEffect(() => {
    setPreviewImage(oldImage);
  }, [oldImage]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileChange(file);
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
      onFileChange(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <div
      style={{
        border: '2px dashed #ddd',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => document.getElementById('fileInput').click()}
    >
      {previewImage ? (
        <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', marginBottom: '16px' }} />
      ) : (
        <Typography variant="body2" color="text.secondary">
          Drag and drop an image or click to browse
        </Typography>
      )}
      <input id="fileInput" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
    </div>
  );
};

export default ImageUpload;
