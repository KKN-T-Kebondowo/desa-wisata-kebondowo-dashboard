// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/home',
    icon: icon('ic_analytics'),
  },
  {
    title: 'wisata',
    path: '/dashboard/destinations',
    icon: icon('ic_user'),
  },
  {
    title: 'galeri',
    path: '/dashboard/galleries',
    icon: icon('ic_cart'),
  },
  {
    title: 'artikel',
    path: '/dashboard/articles',
    icon: icon('ic_blog'),
  },
];

export default navConfig;
