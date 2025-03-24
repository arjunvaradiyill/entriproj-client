import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
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
  ListItemText,
  Fade,
  Chip,
  Paper,
  alpha
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Movie as MovieIcon,
  Brightness4,
  Brightness7,
  Settings,
  Favorite,
  History,
  AdminPanelSettings,
  Notifications,
  Dashboard,
  Add as AddIcon,
  AccountCircle
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { toggleTheme } from '../../store/slices/themeSlice';

// Styled components for modern UI
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  backdropFilter: 'blur(10px)',
  backgroundColor: theme.palette.mode === 'dark' 
    ? alpha(theme.palette.background.default, 0.8)
    : alpha(theme.palette.background.paper, 0.8),
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 38,
  height: 38,
  cursor: 'pointer',
  border: `2px solid ${theme.palette.primary.main}`,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}, 0 0 0 4px ${theme.palette.primary.main}`
  }
}));

const ProfileMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 12,
    minWidth: 240,
    overflow: 'visible',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 8px 40px rgba(0,0,0,0.4)'
      : '0 8px 40px rgba(0,0,0,0.1)',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.mode === 'dark' 
      ? alpha(theme.palette.background.paper, 0.9)
      : alpha(theme.palette.background.paper, 0.9),
    backdropFilter: 'blur(8px)',
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      right: 20,
      width: 10,
      height: 10,
      backgroundColor: theme.palette.background.paper,
      transform: 'translateY(-50%) rotate(45deg)',
      zIndex: 0,
    },
  }
}));

const NavButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: '8px 16px',
  textTransform: 'none',
  fontWeight: 600,
  letterSpacing: 0.5,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    backgroundColor: theme.palette.mode === 'dark' 
      ? alpha(theme.palette.primary.main, 0.1)
      : alpha(theme.palette.primary.main, 0.08)
  }
}));

const MenuItemStyled = styled(MenuItem)(({ theme }) => ({
  borderRadius: 8,
  margin: '4px 0',
  padding: '10px 16px',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? alpha(theme.palette.primary.main, 0.15)
      : alpha(theme.palette.primary.main, 0.08)
  }
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  borderRadius: 8,
  marginBottom: theme.spacing(1),
  backgroundColor: theme.palette.mode === 'dark' 
    ? alpha(theme.palette.primary.main, 0.1)
    : alpha(theme.palette.primary.main, 0.05)
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
  
  // Get avatar color based on username
  const getAvatarColor = (name) => {
    if (!name) return theme.palette.primary.main;
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
                  <ListItemText primary="Admin Dashboard" />
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
        <ListItem disablePadding>
          <ListItemButton 
            onClick={() => {
              handleDrawerToggle();
              handleThemeToggle();
            }}
            sx={{ textAlign: 'center' }}
          >
            <ListItemText primary={darkMode ? "Light Mode" : "Dark Mode"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
  
  return (
    <>
      <StyledAppBar position="sticky">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Mobile menu icon */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Logo */}
            <MovieIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
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
              MOVIE REVIEWS
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
              MOVIES
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
              <IconButton 
                onClick={handleThemeToggle} 
                color="inherit" 
                sx={{ 
                  mr: 1,
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'rotate(30deg)' }
                }}
              >
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>
            
            {/* User profile section */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <Tooltip title="Notifications">
                    <IconButton 
                      color="inherit" 
                      sx={{ 
                        mr: 1,
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-2px)' }
                      }}
                    >
                      <Badge 
                        badgeContent={3} 
                        color="error"
                        sx={{
                          '& .MuiBadge-badge': {
                            animation: 'pulse 1.5s infinite',
                            '@keyframes pulse': {
                              '0%': { transform: 'scale(1)' },
                              '50%': { transform: 'scale(1.2)' },
                              '100%': { transform: 'scale(1)' }
                            }
                          }
                        }}
                      >
                        <Notifications />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                  
                  {/* User avatar and menu */}
                  <Box>
                    <Tooltip title="Account settings">
                      <Box 
                        onClick={handleMenu}
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          cursor: 'pointer',
                          p: 0.5,
                          borderRadius: 2,
                          transition: 'background-color 0.2s',
                          '&:hover': {
                            bgcolor: theme.palette.mode === 'dark' 
                              ? 'rgba(255,255,255,0.08)' 
                              : 'rgba(0,0,0,0.04)'
                          }
                        }}
                      >
                        <UserAvatar 
                          sx={{ 
                            bgcolor: user ? getAvatarColor(user.username) : theme.palette.primary.main,
                            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
                          }}
                        >
                          {user ? getAvatarText(user.username) : <AccountCircle />}
                        </UserAvatar>
                        
                        {!isMobile && (
                          <Box sx={{ ml: 1.5, mr: 0.5 }}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 600, 
                                lineHeight: 1.2,
                                color: theme.palette.text.primary
                              }}
                            >
                              {user?.username || 'User'}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                lineHeight: 1,
                                color: theme.palette.text.secondary,
                                display: 'block'
                              }}
                            >
                              {user?.role === 'admin' || user?.isAdmin ? (
                                <Chip 
                                  label="Admin" 
                                  size="small" 
                                  color="primary" 
                                  sx={{ 
                                    height: 16, 
                                    fontSize: '0.6rem',
                                    fontWeight: 'bold'
                                  }}
                                />
                              ) : 'Member'}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Tooltip>
                    
                    <ProfileMenu
                      anchorEl={anchorEl}
                      id="account-menu"
                      open={open}
                      onClose={handleClose}
                      onClick={handleClose}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      TransitionComponent={Fade}
                      transitionDuration={200}
                    >
                      {user && (
                        <ProfileHeader>
                          <UserAvatar 
                            sx={{ 
                              width: 50, 
                              height: 50,
                              bgcolor: getAvatarColor(user.username)
                            }}
                          >
                            {getAvatarText(user.username)}
                          </UserAvatar>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {user.username}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {user.email}
                            </Typography>
                          </Box>
                        </ProfileHeader>
                      )}
                      
                      <MenuItemStyled component={RouterLink} to="/profile">
                        <ListItemIcon>
                          <PersonIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        Profile
                      </MenuItemStyled>
                      
                      <MenuItemStyled component={RouterLink} to="/favorites">
                        <ListItemIcon>
                          <Favorite fontSize="small" color="error" />
                        </ListItemIcon>
                        Favorites
                      </MenuItemStyled>
                      
                      <MenuItemStyled component={RouterLink} to="/watch-history">
                        <ListItemIcon>
                          <History fontSize="small" color="action" />
                        </ListItemIcon>
                        Watch History
                      </MenuItemStyled>
                      
                      <MenuItemStyled component={RouterLink} to="/settings">
                        <ListItemIcon>
                          <Settings fontSize="small" color="info" />
                        </ListItemIcon>
                        Settings
                      </MenuItemStyled>
                      
                      {user && (user.role === 'admin' || user.isAdmin) && (
                        <>
                          <Divider sx={{ my: 1 }} />
                          <Typography 
                            variant="caption" 
                            color="text.secondary" 
                            sx={{ px: 2, py: 0.5, display: 'block' }}
                          >
                            ADMIN
                          </Typography>
                          
                          <MenuItemStyled component={RouterLink} to="/admin/dashboard">
                            <ListItemIcon>
                              <Dashboard fontSize="small" color="secondary" />
                            </ListItemIcon>
                            Dashboard
                          </MenuItemStyled>
                          
                          <MenuItemStyled component={RouterLink} to="/admin/add-movie">
                            <ListItemIcon>
                              <AddIcon fontSize="small" color="success" />
                            </ListItemIcon>
                            Add Movie
                          </MenuItemStyled>
                        </>
                      )}
                      
                      <Divider sx={{ my: 1 }} />
                      
                      <MenuItemStyled onClick={handleLogout}>
                        <ListItemIcon>
                          <LogoutIcon fontSize="small" color="warning" />
                        </ListItemIcon>
                        Logout
                      </MenuItemStyled>
                    </ProfileMenu>
                  </Box>
                </>
              ) : (
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                  <Button 
                    component={RouterLink} 
                    to="/login"
                    variant="outlined"
                    color="inherit"
                    sx={{ 
                      mr: 1.5, 
                      borderRadius: 2, 
                      textTransform: 'none', 
                      fontWeight: 600,
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button 
                    component={RouterLink} 
                    to="/register"
                    variant="contained"
                    sx={{ 
                      borderRadius: 2, 
                      textTransform: 'none', 
                      fontWeight: 600,
                      boxShadow: 4,
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 6
                      }
                    }}
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