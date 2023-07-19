import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
// @mui
import { Container, Stack, Typography } from '@mui/material';
// components
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';
// mock
import PRODUCTS from '../_mock/products';
import { AuthContext } from '../providers/authProvider';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  const { accessToken, api } = useContext(AuthContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      // const res = await fetch('http://localhost:8080/api/galleries');
      // console.log(res);
      const response = await api.get('/api/galleries/');
      console.log(response);
      if (response.status === 200) {
        setProducts(response.data);
      } else {
        throw new Error('Invalid username or password');
      }
    })();
  }, []);

  console.log(products);

  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  return (
    <>
      <Helmet>
        <title> Dashboard: Products | Minimal UI </title>
      </Helmet>

      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Products
        </Typography>

        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack>

        <ProductList products={PRODUCTS} />
        <ProductCartWidget />
      </Container>
    </>
  );
}
