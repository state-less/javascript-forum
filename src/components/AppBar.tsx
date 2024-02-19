import * as React from 'react';
import { InputAdornment, useTheme, useMediaQuery } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import IconClear from '@mui/icons-material/Clear';
import IconSearch from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { authContext } from '@state-less/react-client';
import { useComponent } from '@state-less/react-client';

import { Actions, stateContext } from '../provider/StateProvider';
import { ConnectionCounter } from '../server-components/examples/ConnectionCounter';
import { navigation } from '../routes';

import { GoogleLoginButton } from './LoggedInGoogleButton';
import { BackgroundButton } from './BackgroundButton';
const getBreadCrumbs = (pathName, getTitle) => {
  const arr = pathName.split('/').map((e) => getTitle(e));
  for (let i = 0; i < arr.length; i++) {
    if (i % 2 !== 0) {
      arr.splice(i, 0, '/');
    }
  }
  return arr;
};
export default function ButtonAppBar() {
  const { state, dispatch } = React.useContext(stateContext);
  const { authenticate, session } = React.useContext(authContext);
  const { pathname } = useLocation();
  const postId = pathname.split('/').at(-1) || '';
  const [component] = useComponent(postId, {
    skip: !postId,
  });
  const theme = useTheme();

  const lessThanSmall = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => dispatch({ type: Actions.TOGGLE_MENU })}
        >
          <MenuIcon />
        </IconButton>
        {!lessThanSmall && (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <img
              src="/favicon.svg"
              style={{ width: 24, height: 24 }}
              loading="lazy"
            />
            <Link component={RouterLink} to="/" sx={{ color: 'white' }}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {getBreadCrumbs(pathname, (part, i, arr) => {
                  if (part.includes('post-'))
                    return (
                      <Link sx={{ color: 'white' }} href={pathname}>
                        {component?.props?.title || 'Post'}
                      </Link>
                    );
                  return (
                    <Link sx={{ color: 'white' }} href={'/'}>
                      Forum
                    </Link>
                  );
                })}
              </Typography>
            </Link>
          </Box>
        )}
        <Box
          sx={{ display: pathname === '/lists' ? 'flex' : 'none', flexGrow: 1 }}
        >
          <TextField
            label="Search"
            value={state.search}
            onChange={(e) => {
              dispatch({ type: Actions.SEARCH, value: e.target.value });
            }}
            sx={{
              mx: 'auto',
              background: '#FFF',
              borderRadius: 1,
              width: lessThanSmall ? '100%' : '90%',
              marginTop: 1,
              '& label': {
                background: '#FFF',
                borderTopLeftRadius: 50,
                borderTopRightRadius: 200,
                pr: 4,
                pl: 2,
                ml: '-13px',
                // transform: 'translate(0px, 0px)',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="end">
                  <IconSearch sx={{ mr: 1 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={(e) => {
                      dispatch({ type: Actions.SEARCH, value: '' });

                      // setTimeout(() => inputRef.current?.focus(), 0);
                    }}
                    disabled={!state.search}
                  >
                    <IconClear />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box sx={{ ml: 'auto' }} />
        {!lessThanSmall && (
          <Box sx={{ display: 'flex' }}>
            <ConnectionCounter />
            <BackgroundButton />
            <GoogleLoginButton />
          </Box>
        )}
        {lessThanSmall && (
          <Box sx={{ ml: 1 }}>
            <GoogleLoginButton />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
