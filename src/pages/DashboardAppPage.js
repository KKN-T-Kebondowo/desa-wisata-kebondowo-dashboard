import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import Iconify from '../components/iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
import { Link } from 'react-router-dom';
import { generateDateLabels } from '../helpers/dashboard';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../providers/authProvider';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
  const { api } = useContext(AuthContext);
  const [data, setData] = useState();

  useEffect(() => {
    (async () => {
      const response = await api.get('/api/dashboard/');
      if (response.status === 200) {
        // console.log(response.data);
        setData(response.data);
      } else {
        throw new Error('Invalid username or password');
      }
    })();
  }, []);

  return (
    <>
      <Helmet>
        <title> Dashboard Desa Wisata Kebondowo </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Halo, selamat datang kembali
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Link to="/dashboard/articles" style={{ textDecoration: 'none' }}>
              <AppWidgetSummary
                title="Artikel"
                total={data ? data.total_article : 0}
                icon={'ant-design:android-filled'}
              />
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Link to="/dashboard/galleries" style={{ textDecoration: 'none' }}>
              <AppWidgetSummary
                title="Galeri"
                total={data ? data.total_gallery : 0}
                color="info"
                icon={'ant-design:apple-filled'}
              />
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Link to="/dashboard/tourisms" style={{ textDecoration: 'none' }}>
              <AppWidgetSummary
                title="Wisata"
                total={data ? data.total_tourism : 0}
                color="warning"
                icon={'ant-design:windows-filled'}
              />
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Pengunjung" total={234} color="error" icon={'ant-design:bug-filled'} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Data Website"
              subheader="(+43%) than last year"
              chartLabels={generateDateLabels()}
              chartData={[
                {
                  name: 'Artikel',
                  type: 'column',
                  fill: 'solid',
                  data: data ? data.article_per_month : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                },
                {
                  name: 'Galeri',
                  type: 'area',
                  fill: 'gradient',
                  data: data ? data.gallery_per_month : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                },
                {
                  name: 'Wisata',
                  type: 'line',
                  fill: 'solid',
                  data: data ? data.tourism_per_month : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Data Website"
              chartData={[
                { label: 'Wisata', value: data ? data.total_tourism : 0 },
                { label: 'Galeri', value: data ? data.total_gallery : 0 },
                { label: 'Artikel', value: data ? data.total_article : 0 },
              ]}
              chartColors={[theme.palette.info.main, theme.palette.warning.main, theme.palette.error.main]}
            />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Conversion Rates"
              subheader="(+43%) than last year"
              chartData={[
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} />,
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />,
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} />,
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} />,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid> */}
        </Grid>
      </Container>
    </>
  );
}
