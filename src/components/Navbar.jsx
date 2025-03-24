import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  useTheme,
  Container,
  useMediaQuery,
  Tooltip,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Switch,
  Fade,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Movie as MovieIcon,
  AccountCircle,
  Brightness4,
  Brightness7,
  Settings,
  Favorite,
  History,
  AdminPanelSettings,
  MovieFilter,
  DarkMode,
  LightMode,
  Notifications
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { toggleTheme } from '../store/slices/themeSlice';

// Styled components for modern UI
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  backdropFilter: 'blur(10px)',
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(18, 18, 18, 0.8)'
    : 'rgba(255, 255, 255, 0.8)',
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  cursor: 'pointer',
  border: `2px solid ${theme.palette.primary.main}`,
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)'
  }
}));

const ProfileMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 12,
    minWidth: 220,
    boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(30, 30, 30, 0.95)'
      : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(8px)'
  }
}));

const NavButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: '8px 16px',
  textTransform: 'none',
  fontWeight: 600,
  letterSpacing: 0.5,
  transition: 'background-color 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.05)'
  }
}));

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const darkMode = useSelector((state) => state.theme.darkMode);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  // Generate avatar text from username
  const getAvatarText = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  // Get random avatar color based on username
  const getAvatarColor = (name) => {
    if (!name) return '#1976d2';
    const colors = [
      '#1976d2', '#e53935', '#43a047', '#fdd835', 
      '#8e24aa', '#6d4c41', '#546e7a', '#d81b60',
      '#5e35b1', '#00acc1', '#3949ab', '#7cb342'
    ];
    const charCode = name.charCodeAt(0);
    return colors[charCode % colors.length];
  };
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate('/login');
  };
  
  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };
  
  const drawer = (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: 'bold' }}>
        Movie Reviews
      </Typography>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton 
            component={RouterLink} 
            to="/"
            onClick={handleDrawerToggle}
            sx={{ textAlign: 'center' }}
          >
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton 
            component={RouterLink} 
            to="/movies"
            onClick={handleDrawerToggle}
            sx={{ textAlign: 'center' }}
          >
            <ListItemText primary="Movies" />
          </ListItemButton>
        </ListItem>
        {isAuthenticated ? (
          <>
            <ListItem disablePadding>
              <ListItemButton 
                component={RouterLink} 
                to="/profile"
                onClick={handleDrawerToggle}
                sx={{ textAlign: 'center' }}
              >
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
            {user && user.role === 'admin' && (
              <ListItem disablePadding>
                <ListItemButton 
                  component={RouterLink} 
                  to="/admin/dashboard"
                  onClick={handleDrawerToggle}
                  sx={{ textAlign: 'center' }}
                >
                  <ListItemText primary="Admin" />
                </ListItemButton>
              </ListItem>
            )}
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => {
                  handleDrawerToggle();
                  handleLogout();
                }}
                sx={{ textAlign: 'center' }}
              >
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton 
                component={RouterLink} 
                to="/login"
                onClick={handleDrawerToggle}
                sx={{ textAlign: 'center' }}
              >
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton 
                component={RouterLink} 
                to="/register"
                onClick={handleDrawerToggle}
                sx={{ textAlign: 'center' }}
              >
                <ListItemText primary="Register" />
              </ListItemButton>
            </ListItem>
          </>
        )}
        <ListItem sx={{ justifyContent: 'center', mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LightMode sx={{ mr: 1, color: darkMode ? 'text.disabled' : 'warning.main' }} />
            <Switch 
              checked={darkMode}
              onChange={handleThemeToggle}
              color="primary"
            />
            <DarkMode sx={{ ml: 1, color: darkMode ? 'primary.main' : 'text.disabled' }} />
          </Box>
        </ListItem>
      </List>
    </Box>
  );
  
  useEffect(() => {
    console.log('Auth state in Navbar:', { user, isAuthenticated });
  }, [user, isAuthenticated]);
  
  return (
    <>
      <StyledAppBar position="sticky">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Mobile menu icon */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            {/* Logo */}
            <MovieFilter sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Movie Reviews
            </Typography>
            
            {/* Mobile logo */}
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                flexGrow: 1,
                display: { xs: 'flex', md: 'none' },
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              MR
            </Typography>
            
            {/* Desktop navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <NavButton
                component={RouterLink}
                to="/"
                sx={{ my: 2, color: 'inherit', display: 'block' }}
              >
                Home
              </NavButton>
              <NavButton
                component={RouterLink}
                to="/movies"
                sx={{ my: 2, color: 'inherit', display: 'block' }}
              >
                Movies
              </NavButton>
            </Box>
            
            {/* Theme toggle */}
            <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              <IconButton onClick={handleThemeToggle} color="inherit" sx={{ mr: 1 }}>
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>
            
            {/* User profile section */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isAuthenticated ? (
                user ? (
                  <>
                    {/* Notifications */}
                    <Tooltip title="Notifications">
                      <IconButton color="inherit" sx={{ mr: 1 }}>
                        <Badge badgeContent={3} color="error">
                          <Notifications />
                        </Badge>
                      </IconButton>
                    </Tooltip>
                    
                    {/* User avatar and menu */}
                    <Tooltip title="Account settings">
                      <Box onClick={handleMenu}>
                        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                          <UserAvatar 
                            sx={{ bgcolor: user ? getAvatarColor(user.username) : 'primary.main' }}
                            alt={user ? user.username : 'User'}
                          >
                            {user ? getAvatarText(user.username) : 'U'}
                          </UserAvatar>
                          
                          {!isMobile && user && (
                            <Box sx={{ ml: 1, textAlign: 'left' }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                                {user.username || 'User'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
                                {user.role === 'admin' || user.isAdmin ? (
                                  <Chip 
                                    label="Admin" 
                                    size="small" 
                                    color="primary" 
                                    sx={{ height: 16, fontSize: '0.6rem' }}
                                  />
                                ) : 'Member'}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Tooltip>
                    
                    <ProfileMenu
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      onClick={handleClose}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      TransitionComponent={Fade}
                    >
                      {user && (
                        <Box sx={{ px: 2, py: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {user.username || 'User'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {user.email || 'No email available'}
                          </Typography>
                        </Box>
                      )}
                      
                      <Divider />
                      
                      <MenuItem component={RouterLink} to="/profile">
                        <ListItemIcon>
                          <PersonIcon fontSize="small" />
                        </ListItemIcon>
                        Profile
                      </MenuItem>
                      
                      <MenuItem component={RouterLink} to="/favorites">
                        <ListItemIcon>
                          <Favorite fontSize="small" />
                        </ListItemIcon>
                        Favorites
                      </MenuItem>
                      
                      <MenuItem component={RouterLink} to="/watch-history">
                        <ListItemIcon>
                          <History fontSize="small" />
                        </ListItemIcon>
                        Watch History
                      </MenuItem>
                      
                      <MenuItem component={RouterLink} to="/settings">
                        <ListItemIcon>
                          <Settings fontSize="small" />
                        </ListItemIcon>
                        Settings
                      </MenuItem>
                      
                      {user.role === 'admin' && (
                        <MenuItem component={RouterLink} to="/admin/dashboard">
                          <ListItemIcon>
                            <AdminPanelSettings fontSize="small" />
                          </ListItemIcon>
                          Admin Dashboard
                        </MenuItem>
                      )}
                      
                      <Divider />
                      
                      <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                          <LogoutIcon fontSize="small" />
                        </ListItemIcon>
                        Logout
                      </MenuItem>
                    </ProfileMenu>
                  </>
                ) : (
                  <Tooltip title="Profile">
                    <IconButton 
                      color="inherit"
                      onClick={() => navigate('/profile')}
                      sx={{ 
                        border: `2px solid ${theme.palette.primary.main}`,
                        borderRadius: '50%'
                      }}
                    >
                      <AccountCircle />
                    </IconButton>
                  </Tooltip>
                )
              ) : (
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                  <Button 
                    component={RouterLink} 
                    to="/login"
                    variant="text"
                    color="inherit"
                    sx={{ mr: 1, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                  >
                    Login
                  </Button>
                  <Button 
                    component={RouterLink} 
                    to="/register"
                    variant="contained"
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                  >
                    Sign Up
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </StyledAppBar>
      
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar; 