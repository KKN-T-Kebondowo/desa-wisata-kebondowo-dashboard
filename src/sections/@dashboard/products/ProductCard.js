import PropTypes from 'prop-types';
// @mui
import { Box, Card, Link, Typography, Stack, Button, Modal, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

import DeleteIcon from '@mui/icons-material/Delete';
import { useContext, useState } from 'react';

import { supabase } from '../../../supabaseClient';
import { AuthContext } from '../../../providers/authProvider';

// ----------------------------------------------------------------------
const StyledProductImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
  onDelete: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired, // Add the path prop
};

export default function ShopProductCard({ product, onDelete, path }) {
  const { api } = useContext(AuthContext);
  const { caption, picture_url } = product;

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleDeleteItem = async () => {
    onDelete(product.id);

    console.log('Deleting item:', product);
    console.log(product.picture_url);
    setOpenDeleteModal(false);

    // Delete the image from the Supabase storage
    const imageFileName = product.picture_url.split('/').pop(); // Extract the image name from the URL
    const pathToDelete = `${path}/${imageFileName}`; // Use the path prop to construct the path dynamically

    const { data, error } = await supabase.storage.from('desa-wisata-kebondowo-bucket').remove([pathToDelete]);

    const deleteResponse = await api.delete(`/api/${path}/${product.id}`); // Use the path prop here as well

    // Check for errors and handle them if necessary
    if (error) {
      console.error('Error deleting image:', error);
    } else {
      console.log('Image deleted successfully.');
    }

    // Call the onDelete function with the product id to remove the card from the list
  };

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        <StyledProductImg alt={caption ?? 'wisata kebondowo'} src={picture_url} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover">
          <Typography variant="subtitle2" noWrap>
            {caption}
          </Typography>
        </Link>
      </Stack>

      <Box sx={{ position: 'absolute', bottom: '15px', right: '8px' }}>
        <IconButton color="inherit" onClick={() => setOpenDeleteModal(true)}>
          <DeleteIcon />
        </IconButton>
      </Box>

      {/* Add the confirmation modal */}
      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper', // Use the background color of your choice
            borderRadius: '12px', // Add a border radius to give it a curve
            boxShadow: (theme) => theme.shadows[24], // Add a box shadow for depth
            outline: 'none', // Remove default outline
            minWidth: '300px', // Set the minimum width of the modal
            p: 4, // Add padding
          }}
        >
          <Typography variant="h6" sx={{ mb: 3 }}>
            Apakah anda yakin untuk menghapus gambar ini?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {caption ?? ''}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={() => setOpenDeleteModal(false)} sx={{ flex: 1 }}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={handleDeleteItem} sx={{ flex: 1 }}>
              Delete
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Card>
  );
}
