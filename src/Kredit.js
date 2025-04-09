import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Grid, Box, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Slide } from "@mui/material";
import MuiCard from '@mui/material/Card';
import { styled, useTheme } from '@mui/material/styles';
import { get, post } from './services/apiService';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const creditOptions = [
  { amount: 500, price: "10 000 Ft" },
  { amount: 1000, price: "20 000 Ft" },
  { amount: 2000, price: "40 000 Ft" },
];

const StyledCard = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(2),
  gap: theme.spacing(1),
  margin: 'auto',
  overflow: 'auto',
  backgroundColor: theme.palette.mode === 'light' 
    ? 'rgba(255, 255, 255, 0.7) !important'
    : 'rgba(0, 0, 5, 0.8) !important',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  minHeight: '740px',
  animation: 'fadeIn 0.5s ease-out',
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      transform: 'translateY(10px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const CreditPurchase = ({ currentCredits, onPurchase }) => {
  const [creditHistory, setCreditHistory] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const isNarrow = useMediaQuery('(max-width:1700px) and (min-width:901px)');

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedCreditAmount, setSelectedCreditAmount] = useState(null);
  const [purchaseType, setPurchaseType] = useState('');

  useEffect(() => {
    const fetchCreditHistory = async () => {
      try {
        const data = await get(`/companies/credit-history/${localStorage.getItem('cegId')}`);
        
        // Ellenőrizzük, hogy a data egy tömb-e
        if (Array.isArray(data)) {
          setCreditHistory(data);
        } else {
          console.error('Expected array but got:', data);
          setCreditHistory([]); // Üres tömböt állítunk be, ha nem tömböt kaptunk
        }
      } catch (error) {
        console.error('Error fetching credit history:', error);
        setCreditHistory([]); // Hiba esetén üres tömböt állítunk be
      }
    };
    fetchCreditHistory();
  }, []);

  const handlePurchase = async (amount, type) => {
    setSelectedCreditAmount(amount);
    setPurchaseType(type);
    setConfirmDialogOpen(true);
  };

  const confirmPurchase = async () => {
    try {
      const companyId = localStorage.getItem('cegId');
      if (!companyId) {
        console.error('Company ID not found');
        return;
      }
  
      const data = await post('/companies/purchase-credits', { 
        packageAmount: selectedCreditAmount, 
        companyId: parseInt(companyId) 
      });
  
      onPurchase(data.currentCredits);
  
      const historyData = await get(`/companies/credit-history/${companyId}`);
      if (Array.isArray(historyData)) {
        setCreditHistory(historyData);
      } else {
        console.error('Expected array but got:', historyData);
        setCreditHistory([]); // Üres tömböt állítunk be, ha nem tömböt kaptunk
      }
      
      // Close the dialog
      setConfirmDialogOpen(false);
    } catch (error) {
      console.error('Error purchasing credits:', error);
      setConfirmDialogOpen(false);
    }
  };

  return (
    <Box
  sx={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    overflow: 'auto',
  }}
>
<Card
  variant="outlined"
  sx={{
    position: isMobile ? 'static' : 'absolute',
    left: isMobile ? 'auto' : '20px',
    top: isMobile ? 'auto' : '200px',
    width: isMobile ? "95%" : (isNarrow ? "400px" : "550px"),
    flexShrink: 0,
    boxShadow: 'none',
    backgroundColor: 'transparent',
    maxHeight: isMobile ? "400px" : "640px",
    overflowY: "auto",
    margin: isMobile ? "20px auto" : undefined,
    order: isMobile ? 2 : 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: isMobile ? "300px" : "auto",
    zIndex: 10,
    animation: 'slideInLeft 0.6s ease-out',
    '@keyframes slideInLeft': {
      '0%': {
        opacity: 0,
        transform: 'translateX(-30px)',
      },
      '100%': {
        opacity: 1,
        transform: 'translateX(0)',
      },
    },
  }}
>
        <Typography variant="h6" sx={{ mb: 2, pl: 2 }}>Pont előzmények</Typography>
        {creditHistory.map((transaction) => (
          <Button
            key={transaction.id}
            sx={{
              height: "80px !important",
              width: "100%",
              justifyContent: "space-between",
              textAlign: "left",
              pl: 4,
              mb: 2,
              borderRadius: "10px",
              opacity: 0.9, // Nagyobb opacitás (kevésbé átlátszó)
              backgroundColor: "rgba(255, 255, 255, 0.9)", // Fehér háttér nagyobb opacitással
            }}
            variant="outlined"
          >
            <Box>
              <Typography variant="subtitle1">
                {transaction.transaction_type === 'purchase' ? 'Kredit vásárlás' : transaction.survey_title}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {transaction.formatted_date}
              </Typography>
            </Box>
            <Typography 
              variant="subtitle1" 
              color={transaction.transaction_type === 'purchase' ? 'success.main' : 'error.main'}
              sx={{ mr: 2 }}
            >
              {transaction.transaction_type === 'purchase' ? '+' : '-'}{transaction.amount} kredit
            </Typography>
          </Button>
        ))}
      </Card>

      <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      width: '100%',
      flexGrow: 1,
    }}>
        <StyledCard
          variant="outlined"
          sx={{
            mt: 15,
            width: "100%",
            maxWidth: "700px",
            height: isMobile ? "auto" : "600px",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 2,
            margin: '0 auto',
            overflowY: 'auto',
            order: isMobile ? 1 : 2,
            animation: 'fadeInUp 0.7s ease-out',
            '@keyframes fadeInUp': {
              '0%': {
                opacity: 0,
                transform: 'translateY(20px)',
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}
        >
          <Box sx={{
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: 'center',
  justifyContent: 'center',
  mb: 2,
  mt: 1,
  width: '100%',
  position: 'relative',
  padding: { xs: '0 10px', sm: '0 20px' }
}}>
  <Typography 
    variant="h4" 
    fontWeight="bold" 
    sx={{ 
      textAlign: 'center',
      fontSize: { xs: '1.4rem', sm: '1.6rem' },
      mb: { xs: 2, sm: 0 },
      position: { sm: 'absolute' },
      left: { sm: '20px' }
    }}
  >
    Aktuális egyenleg
  </Typography>
  
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center',
    justifyContent: 'center',
    width: { xs: '100%', sm: 'auto' }
  }}>
    <Typography
      variant="subtitle1"
      fontWeight="bold"
      sx={{
        fontSize: { xs: '1.5rem', sm: '1.875rem' },
        textAlign: 'center' ,
        ml: 6
      }}
    >
      {currentCredits}
    </Typography>
    <Typography sx={{ ml: 1, textAlign: 'center' }}>
      Kredit
    </Typography>
  </Box>
</Box>
          {['Havi feltöltés', 'Egyszeri feltöltés'].map((category, index) => (
            <Card key={index} sx={{ 
              marginBottom: 1, 
              boxShadow: 'none', 
              height:'100%',
              width: '100%', 
              backgroundColor: '#f5f5f5', 
              padding: 2 
            }}>
              <CardContent sx={{ padding: '4px 0 0 0' }}>
              <Box sx={{ 
  display: 'flex', 
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: 'center',
  justifyContent: 'center',
  mb: 1, 
  width: '100%',
  padding: { xs: '0 10px', sm: '0 20px' },
  position: 'relative'
}}>
  <Typography 
    variant="subtitle1" 
    fontWeight="bold" 
    sx={{ 
      textAlign: 'center',
      mb: { xs: 1, sm: 0 },
      position: { sm: 'absolute' },
      left: { sm: '20px' }
    }}
  >
    Kredit vásárlása
  </Typography>
  
  <Typography 
    variant="subtitle1" 
    fontWeight="bold" 
    sx={{ 
      textAlign: 'center',
      fontSize: '0.875rem',
      width: { xs: '100%', sm: 'auto' }
    }}
  >
    {category}
  </Typography>
</Box>
                
                <Grid 
                  container 
                  spacing={2} 
                  justifyContent="center" 
                  alignItems="center" 
                  sx={{ 
                    width: '100%', 
                    margin: '0 auto',
                    padding: '0'
                  }}
                >
                  {creditOptions.map((option, idx) => (
                    <Grid 
                      item 
                      key={idx}
                      xs={12} 
                      sm={4} 
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '12px'
                      }}
                    >
                      <Card variant="outlined" sx={{ 
                        textAlign: "center", 
                        padding: 1, 
                        border: "1px solid grey",
                        height: "180px",
                        width: "100%",
                        maxWidth: "280px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}>
                        <Typography variant="h4" fontWeight="bold" sx={{ mb: 0, mt: 1 }}>
                          {option.amount}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0, mt: -2 }}>Kredit</Typography>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 0 }}>
                          {option.price}
                        </Typography>
                        <Button 
                          variant="contained" 
                          size="small" 
                          onClick={() => handlePurchase(option.amount, category)} 
                          sx={{ mt: 'auto', fontSize: '0.75rem', padding: '4px 8px', mb: 1 }}
                        >
                          Vásárlás
                        </Button>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          ))}
        </StyledCard>
      </Box>
      <Dialog
        open={confirmDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setConfirmDialogOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Kredit vásárlás megerősítése"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Biztosan meg szeretné vásárolni a {selectedCreditAmount} kredit csomagot ({purchaseType})?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Mégse</Button>
          <Button onClick={confirmPurchase}>Vásárlás</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreditPurchase;