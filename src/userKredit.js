import React, { useState, useEffect, useCallback } from 'react';
import { Card, Typography, Button, Box, CardContent, Grid } from "@mui/material";
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';


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
    [theme.breakpoints.up('sm')]: {
      width: '700px',
    },
    minHeight: '740px'
}));

const UserKredit = ({ currentCredits, onPurchase, userId }) => {
  const [creditHistory, setCreditHistory] = useState([]);


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
          voucher_name: item.description,  // Ezt módosítottuk
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
    <>
      {/* Transaction History Card - Left Side */}
      <Card
      variant="outlined"
      sx={{
        position: 'absolute',
        left: '20px',
        top: '145px',
        width: "550px",
        flexShrink: 0,
        boxShadow: 'none',
        backgroundColor: 'transparent',
        maxHeight: "640px",
        overflowY: "auto"
      }}
    >
        <Typography variant="h6" sx={{ mb: 2, pl: 2 }}>Pont előzmények</Typography>
        {creditHistory.map((transaction, index) => (
          <Button key={`transaction-${transaction.id}-${index}-${transaction.formatted_date}`}
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
      </Card>

      {/* Main Voucher Card */}
      <StyledCard
      variant="outlined"
      sx={{
        mt: 15,
        width: "95% !important",
        maxWidth: "700px !important",
        display: 'flex',
        alignItems: 'center',
        padding: 2,
        margin: '0 auto'
      }}
      >
        
    <Box sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 2,
        mt: 1,
        width: '100%'
      }}>
        <Typography variant="h4" fontWeight="bold" sx={{ textAlign: 'left', ml: 4 }}>
          Aktuális egyenleg
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{
              fontSize: '1.875rem'
            }}
          >
           {currentCredits}
          </Typography>
          <Typography sx={{ ml: 1 }}>
            Kredit
          </Typography>
        </Box>
      </Box>


        {/* Voucher Options */}
        {voucherOptions.map((category, categoryIndex) => (
          <Card key={`category-${categoryIndex}`} sx={{ marginBottom: 1, boxShadow: 'none',  height:'100%',  width: '100%', backgroundColor: '#f5f5f5', padding: 2 }}>
            <CardContent sx={{ padding: '4px 0 0 0' }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 1, 
              width: '100%'
            }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ textAlign: 'left', ml: 2 }}>
                Kuponok vásárlása
            </Typography>
            <Typography 
                variant="subtitle1" 
                fontWeight="bold" 
                sx={{ 
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '0.875rem'
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
                    <Button variant="contained" size="small" onClick={() => handleVoucherPurchase(item)} sx={{ mt: 'auto', fontSize: '0.75rem', padding: '4px 8px', mb: 1 }}>Vásárlás</Button>
                  </Card>
                </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        ))}
      </StyledCard>
    </>
  );
};

export default UserKredit;