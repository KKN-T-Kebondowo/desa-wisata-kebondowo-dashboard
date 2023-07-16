import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../providers/authProvider';
import { Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../../components/iconify';

const LoginForm = () => {
  const { login, api } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleClick = async () => {
    try {
      // Perform login request and get the JWT token
      const response = await api.post('/api/auth/login', {
        username,
        password,
      });

      if (response.status === 200) {
        const { access_token, refresh_token } = response.data;

        // Store the token in the context
        login({ access_token, refresh_token });

        // Redirect to the home page
        navigate('/');
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (error) {
      // Handle login error
      setError(error.message);
      console.error('Login failed:', error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField
          name="username"
          label="Username address"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={error !== null}
          helperText={error}
          onKeyPress={handleKeyPress}
        />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error !== null}
          helperText={error}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          onKeyPress={handleKeyPress}
        />
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}></Stack>
      <LoadingButton fullWidth size="large" type="button" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
    </>
  );
};

export default LoginForm;
