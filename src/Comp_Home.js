import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import BarChartIcon from '@mui/icons-material/BarChart';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useLocation } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import ColorModeSelect from './ColorModeSelect';
import Button from '@mui/material/Button';
import AppTheme from './AppTheme';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import MuiCard from '@mui/material/Card';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));



const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));


const SimpleBottomNavigation = ({ value, onChange }) => {
    const theme = useTheme();

  return (
    <BottomNavigation
      showLabels
      value={value}
      onChange={onChange}
      sx={{
        mt: 2, // Margin a tetejétől
        backgroundColor: theme.palette.background.default, 
        boxShadow: theme.shadows[1],
        width: '18%', // Szélesség növelése (arányos a konténerhez)
      }}
    >
      <BottomNavigationAction label="Új kérdőív" icon={<AddBoxIcon />} />
      <BottomNavigationAction label="Kérdőíveim" icon={<DashboardIcon />} />
      <BottomNavigationAction label="Statisztika" icon={<BarChartIcon />} />
    </BottomNavigation>
  );
};


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const CompHome = ({ onSignOut }) => {
  const Credit = 120;
  const location = useLocation();
  console.log(location);
  const name = location.state?.userName || location.state?.companyName;


  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const [anchorEl, setAnchorEl] = React.useState(null);
  const openprofile = Boolean(anchorEl);
  const handleClickProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseProfile = () => {
    setAnchorEl(null);
  };

  return (
    <AppTheme>
      <React.Fragment>
      
        <CssBaseline enableColorScheme />
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 4, // Padding a tetején
      }}
    >

    

    <ColorModeSelect sx={{ position: 'absolute', top: '1rem', right: '5rem' }} />

    <IconButton aria-label="cart" sx={{ position: 'absolute', top: '1rem', right: '12.5rem' }}>
      <StyledBadge badgeContent={4} color="secondary">
        <MailIcon />
      </StyledBadge>
    </IconButton>
    

      {/* Tetején középen: "Ez a kezdőoldal." */}
      <Typography
        component="h1"
        variant="h6"
        sx={{
          textAlign: 'center',
          mb: 2,
        }}
      >
        Köszöntjük az oldalon, {name}!
      </Typography>

      {/* Tetején középen, alatta a navigációs sáv */}
      <SimpleBottomNavigation
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
      />

      {/* Bal felső sarok: "Köszöntjük az oldalon, {name}!" */}
      <Typography
        component="h1"
        variant="h3"
        sx={{
          position: 'absolute',
          top: 26,
          left: 26,
        }}
      >
       {Credit} Kredit
      </Typography>


      <Card variant="outlined">

      <Button variant="outlined" startIcon={<AddCircleOutlineIcon />}>
        Kérdőív létrehozása
      </Button>







      </Card>


      <Tooltip title="Account settings">
  <IconButton
    onClick={handleClickProfile}
    size="small"
    sx={{
      position: 'absolute',
      top: 16,
      right: 16,
      padding: 0, // Eltávolítja a belső margót
      width: 40, // Azonos szélesség, mint az Avatar
      height: 40, // Azonos magasság, mint az Avatar
      borderRadius: '50%', // Kör alakúvá teszi az IconButton-t
      overflow: 'hidden', // Eltünteti az esetleges tartalmi túllógást
    }}
    aria-controls={openprofile ? 'account-menu' : undefined}
    aria-haspopup="true"
    aria-expanded={openprofile ? 'true' : undefined}
  >
    <Avatar sx={{ width: 40, height: 40 }}>M</Avatar>
  </IconButton>
</Tooltip>

        <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={openprofile}
        onClose={handleCloseProfile}
        onClick={handleCloseProfile}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleCloseProfile}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={handleCloseProfile}>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleCloseProfile}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleCloseProfile}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleClickOpen}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>


      
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Kijelentkezés"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Biztosan ki szeretne jelentkezni?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Nem</Button>
          <Button onClick={onSignOut}>Igen</Button>
        </DialogActions>
      </Dialog>
      
    </Box>
    
    </React.Fragment>
    </AppTheme>
  );
};

export default CompHome;
