import PropTypes from 'prop-types';
// @mui
import { Box, Card, Link, Typography, Stack, Button, Modal, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';

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
};

export default function ShopProductCard({ product }) {
  const { caption, picture_url } = product;

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleDeleteItem = () => {
    // Implement your logic to delete the item
    console.log('Deleting item:', product);
    setOpenDeleteModal(false);
  };

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        <StyledProductImg alt={caption} src={picture_url} />
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
            Are you sure you want to delete this item?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {caption}
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
