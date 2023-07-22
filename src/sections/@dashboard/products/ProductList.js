import PropTypes from 'prop-types';
// @mui
import { Grid } from '@mui/material';
import ShopProductCard from './ProductCard';

// ----------------------------------------------------------------------

ProductList.propTypes = {
  products: PropTypes.array.isRequired,
  onDeleteProduct: PropTypes.func.isRequired,
};

export default function ProductList({ products, onDeleteProduct, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {products.map((product) => (
        <Grid key={product.id} item xs={12} sm={6} md={3}>
          <ShopProductCard product={product} onDelete={() => onDeleteProduct(product.id)} />
        </Grid>
      ))}
    </Grid>
  );
}
