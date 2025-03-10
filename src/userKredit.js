import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Box, CardContent, Grid } from "@mui/material";
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';

const voucherOptions = [
  { name: "10% kedvezmény", description: "10% kedvezmény a következő vásárlásból", creditCost: 500, discount: 10 },
  { name: "20% kedvezmény", description: "20% kedvezmény a következő vásárlásból", creditCost: 1000, discount: 20 },
  { name: "5000 Ft utalvány", description: "5000 Ft értékű vásárlási utalvány", creditCost: 2000, discount: 5000 },
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
    minHeight: '640px'
}));

const UserKredit = ({ currentCredits, onPurchase }) => {
  const [transactionHistory, setTransactionHistory] = useState([]);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:3001/api/users/transaction-history/${userId}`);
      const data = await response.json();
      setTransactionHistory(data);
    };
    fetchTransactionHistory();
  }, []);

  const handleVoucherPurchase = async (creditCost, voucherId) => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch('http://localhost:3001/api/users/purchase-voucher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId,
          voucherId,
          creditCost
        })
      });

      if (response.ok) {
        const data = await response.json();
        onPurchase(data.currentCredits);
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
        top: '165px',
        width: "550px",
        flexShrink: 0,
        boxShadow: 'none',
        backgroundColor: 'transparent',
        maxHeight: "640px",
        overflowY: "auto"
      }}
    >
        <Typography variant="h6" sx={{ mb: 2, pl: 2 }}>Pont előzmények</Typography>
        {transactionHistory.map((transaction) => (
          <Button key={transaction.id}
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
        mt: 5,
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
        {voucherOptions.map((option, index) => (
          <Card key={index} sx={{ marginBottom: 1, boxShadow: 'none',  height:'100%',  width: '100%', backgroundColor: '#f5f5f5', padding: 2 }}>
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
                {option}
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
                {UserKredit.map((option, idx) => (
                  <Grid 
                    item 
                    xs={12} 
                    sm={4} 
                    key={idx} 
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
                    <Typography variant="h3" fontWeight="bold" sx={{ mb: 0, mt: 1 }}>
                      {option.amount}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0, mt: -2 }}>Kredit</Typography>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 0 }}>
                      {option.price}
                    </Typography>
                    <Button variant="contained" size="small" onClick={() => handleVoucherPurchase(option.creditCost, index + 1)} sx={{ mt: 'auto', fontSize: '0.75rem', padding: '4px 8px', mb: 1 }}></Button>
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