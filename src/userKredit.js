import React, { useState, useEffect, useCallback } from 'react';
import { Card, Typography, Button, Box, CardContent, Grid, useMediaQuery } from "@mui/material";
import MuiCard from '@mui/material/Card';
import { styled, useTheme } from '@mui/material/styles';


const voucherOptions = [
  {
    category: "Utalványok",
    items: [
      { name: "4000 Ft", description: "Emag utalvány", creditCost: 2700 },
      { name: "3000 Ft", description: "Spar utalvány", creditCost: 1300 },
      { name: "5000 Ft", description: "Decathlon utalvány", creditCost: 2000 },
    ]
  },
  {
    category: "Ajándékkártyák",
    items: [
      { name: "3000 Ft", description: "Steam kártya", creditCost: 100 },
      { name: "2000 Ft", description: "Xbox kártya", creditCost: 1000 },
      { name: "6000 Ft", description: "Amazon kártya", creditCost: 2300 },
    ]
  }
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
    boxShadow:
      'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    minHeight: '700px'
}));

const UserKredit = ({ currentCredits, onPurchase, userId, onClose }) => {
  const [creditHistory, setCreditHistory] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const isNarrow = useMediaQuery('(max-width:1700px) and (min-width:901px)');

  const fetchCreditHistory = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/credit-history/${userId}`);
      const data = await response.json();
      setCreditHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching credit history:', error);
      setCreditHistory([]);
    }
  }, [userId]);


  useEffect(() => {
    fetchCreditHistory();
  }, [fetchCreditHistory]);


  const handleVoucherPurchase = async (item) => {
    try {
      const response = await fetch('http://localhost:3001/api/users/purchase-voucher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId,
          voucherName: item.name,
          creditCost: item.creditCost
        })
      });

      if (response.ok) {
        const data = await response.json();
        onPurchase(data.currentCredits);
        fetchCreditHistory();
      }
    } catch (error) {
      console.error('Error purchasing voucher:', error);
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
      {/* Transaction History Card - Left Side on Desktop, Below on Mobile */}
      <Card
        variant="outlined"
        sx={{
          position: isMobile ? 'static' : 'absolute',
          left: isMobile ? 'auto' : '20px',
          top: isMobile ? 'auto' : '145px',
          width: isMobile ? "95%" : (isNarrow ? "400px" : "550px"),
          flexShrink: 0,
          boxShadow: 'none',
          backgroundColor: 'transparent',
          maxHeight: isMobile ? "500px" : "640px",
          overflowY: "auto",
          margin: isMobile ? "20px auto 40px auto" : undefined,
          order: isMobile ? 2 : 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: isMobile ? "300px" : "auto",
          zIndex: 10,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, pl: 2 }}>Pont előzmények</Typography>
  <Box sx={{ 
    overflowY: "auto", 
    // Biztosítjuk, hogy a tartalom görgethető legyen
    flex: 1,
    // Adjunk neki padding-bottom-ot, hogy látszódjon az utolsó elem is
    pb: 2
  }}>
    {creditHistory.map((transaction, index) => (
      <Button 
        key={`transaction-${transaction.id}-${index}-${transaction.formatted_date}`}
        sx={{
          height: "80px !important",
          width: "100%",
          justifyContent: "space-between",
          textAlign: "left",
          pl: 4,
          mb: 2,
          borderRadius: "10px",
        }}
        variant="outlined"
      >
        <Box>
          <Typography variant="subtitle1">
            {transaction.transaction_type === 'survey' ? 'Kérdőív kitöltés' : transaction.voucher_name}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {transaction.formatted_date}
          </Typography>
        </Box>
        <Typography 
          variant="subtitle1" 
          color={transaction.transaction_type === 'survey' ? 'success.main' : 'error.main'}
          sx={{ mr: 2 }}
        >
          {transaction.transaction_type === 'survey' ? '+' : '-'}{transaction.amount} kredit
        </Typography>
      </Button>
    ))}
  </Box>
</Card>

      {/* Main Voucher Card */}
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
          }}
        >
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            mb: 0,
            mt: 0,
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
                  textAlign: 'center',
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

          {/* Voucher Options */}
          {voucherOptions.map((category, categoryIndex) => (
            <Card key={`category-${categoryIndex}`} sx={{ 
              marginBottom: 1, 
              boxShadow: 'none', 
              height:'auto',
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
                    Kuponok vásárlása
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
                    {category.category}
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
                  {category.items.map((item, itemIndex) => (
                    <Grid 
                      item 
                      key={`voucher-${categoryIndex}-${itemIndex}`}
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
                        <Typography variant="h5" fontWeight="bold" sx={{ mb: 0, mt: 1 }}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0, mt: -2 }}>{item.description}</Typography>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 0 }}>
                          {item.creditCost} kredit
                        </Typography>
                        <Button 
                          variant="contained" 
                          size="small" 
                          onClick={() => handleVoucherPurchase(item)} 
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
    </Box>
  );
};

export default UserKredit;