import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  AppBar,
  Toolbar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Radio,
  Checkbox
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import CustomizedSnackbars from './CustomizedSnackbars';
import { v4 as uuidv4 } from 'uuid';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function AdminDashboard({ onSignOut }) {
  const [creditCost, setCreditCost] = useState(30);
  const [value, setValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openCompanyDialog, setOpenCompanyDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [companiesList, setCompaniesList] = useState([]);
  const [surveyTitle, setSurveyTitle] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [participantCount, setParticipantCount] = useState(50);
  const [questions, setQuestions] = useState([{
    id: uuidv4(),
    selectedButton: "radio",
    questionText: "",
    options: [{ id: uuidv4(), label: "" }]
  }]);
  const [filterCriteria, setFilterCriteria] = useState({
    vegzettseg: null,
    korcsoport: null,
    regio: null,
    nem: null,
    anyagi: null
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      // Felhasználók lekérdezése
      const usersResponse = await fetch('http://localhost:3001/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData);
      }

      // Cégek lekérdezése
      const companiesResponse = await fetch('http://localhost:3001/api/admin/companies', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (companiesResponse.ok) {
        const companiesData = await companiesResponse.json();
        setCompanies(companiesData);
      }

      // Kérdőívek lekérdezése
      const surveysResponse = await fetch('http://localhost:3001/api/admin/surveys', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const companiesListResponse = await fetch('http://localhost:3001/api/admin/companies-list', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (companiesListResponse.ok) {
        const companiesListData = await companiesListResponse.json();
        setCompaniesList(companiesListData);
      }

      if (surveysResponse.ok) {
        const surveysData = await surveysResponse.json();
        setSurveys(surveysData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setSnackbar({
        open: true,
        message: 'Hiba az adatok lekérdezése során',
        severity: 'error'
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleButtonClick = (questionId, type) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? { ...question, selectedButton: type }
          : question
      )
    );
  };


  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: uuidv4(),
        selectedButton: "radio",
        questionText: "",
        options: [{ id: uuidv4(), label: "" }],
      },
    ]);
  };


  const handleRemoveQuestion = (id) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleLabelChange = (questionId, optionId, value) => {
    setQuestions(prev =>
      prev.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map((option) =>
                option.id === optionId ? { ...option, label: value } : option
              )
            }
          : question
      )
    );
  };

  const handleQuestionTextChange = (questionId, value) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? {...q, questionText: value}
        : q
    ));
  };

  const handleAddOption = (questionId) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: [
              ...q.options,
              { id: uuidv4(), label: "" },
            ],
          };
        }
        return q;
      })
    );
  };



  const handleRemoveOption = (questionId, optionId) => {
    setQuestions((prev) =>
      prev.map((question) => {
        if (question.id === questionId) {
          const updatedOptions = question.options.filter(
            (option) => option.id !== optionId
          );
          return {
            ...question,
            options: updatedOptions,
          };
        }
        return question;
      })
    );
  };

  const handleCreateSurvey = async () => {
    if (!surveyTitle) {
      setSnackbar({
        open: true,
        message: 'Kérdőív címe kötelező',
        severity: 'error'
      });
      return;
    }

    if (!selectedCompany) {
      setSnackbar({
        open: true,
        message: 'Válassz céget',
        severity: 'error'
      });
      return;
    }



    const invalidQuestions = questions.filter(q => !q.questionText);
    if (invalidQuestions.length > 0) {
      setSnackbar({
        open: true,
        message: 'Minden kérdésnek kell szöveget adni',
        severity: 'error'
      });
      return;
    }

    // Ellenőrizzük, hogy minden opciónak van-e szövege
    let invalidOptions = false;
    questions.forEach(q => {
      if (q.selectedButton !== 'text') {
        q.options.forEach(o => {
          if (!o.label) invalidOptions = true;
        });
      }
    });

    if (invalidOptions) {
      setSnackbar({
        open: true,
        message: 'Minden opciónak kell szöveget adni',
        severity: 'error'
      });
      return;
    }


    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3001/api/admin/create-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: surveyTitle,
          questions,
          participantCount,
          filterCriteria,
          creditCost: creditCost, 
          companyId: selectedCompany
        })
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Kérdőív sikeresen létrehozva',
          severity: 'success'
        });
        
        // Alaphelyzetbe állítjuk a formot
        setSurveyTitle('');
        setSelectedCompany('');
        setParticipantCount(50);
        setQuestions([{
          id: uuidv4(),
          selectedButton: "radio",
          questionText: "",
          options: [{ id: uuidv4(), label: "" }]
        }]);
        setFilterCriteria({
          vegzettseg: null,
          korcsoport: null,
          regio: null,
          nem: null,
          anyagi: null
        });
        
        // Frissítjük a kérdőívek listáját
        fetchData();
      } else {
        const errorData = await response.json();
        setSnackbar({
          open: true,
          message: `Hiba a kérdőív létrehozása során: ${errorData.error}`,
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error creating survey:', error);
      setSnackbar({
        open: true,
        message: 'Hiba a kérdőív létrehozása során',
        severity: 'error'
      });
    }
  };


  const handleEditUser = (user) => {
    setCurrentUser(user);
    setOpenUserDialog(true);
  };

  const handleEditCompany = (company) => {
    setCurrentCompany(company);
    setOpenCompanyDialog(true);
  };

  const handleDeleteSurvey = async (id) => {
    if (!window.confirm('Biztosan törölni szeretnéd ezt a kérdőívet?')) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3001/api/admin/surveys/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSurveys(surveys.filter(survey => survey.id !== id));
        setSnackbar({
          open: true,
          message: 'Kérdőív sikeresen törölve',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Hiba a kérdőív törlése során',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error deleting survey:', error);
      setSnackbar({
        open: true,
        message: 'Hiba a kérdőív törlése során',
        severity: 'error'
      });
    }
  };

  const handleSaveUser = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3001/api/admin/users/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(currentUser)
      });

      if (response.ok) {
        setUsers(users.map(user => user.id === currentUser.id ? currentUser : user));
        setOpenUserDialog(false);
        setSnackbar({
          open: true,
          message: 'Felhasználó sikeresen frissítve',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Hiba a felhasználó frissítése során',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setSnackbar({
        open: true,
        message: 'Hiba a felhasználó frissítése során',
        severity: 'error'
      });
    }
  };

  const handleSaveCompany = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3001/api/admin/companies/${currentCompany.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(currentCompany)
      });

      if (response.ok) {
        setCompanies(companies.map(company => company.id === currentCompany.id ? currentCompany : company));
        setOpenCompanyDialog(false);
        setSnackbar({
          open: true,
          message: 'Cég sikeresen frissítve',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Hiba a cég frissítése során',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error updating company:', error);
      setSnackbar({
        open: true,
        message: 'Hiba a cég frissítése során',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // DataGrid oszlop definíciók
  const userColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Név', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'credits', headerName: 'Kreditek', width: 120, type: 'number' },
    { field: 'role', headerName: 'Szerepkör', width: 120 },
    {
      field: 'actions',
      headerName: 'Műveletek',
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button 
          startIcon={<EditIcon />} 
          onClick={() => handleEditUser(params.row)}
        >
          Szerkesztés
        </Button>
      ),
    },
  ];

  const companyColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'cegnev', headerName: 'Cégnév', width: 200 },
    { field: 'ceg_email', headerName: 'Email', width: 250 },
    { field: 'credits', headerName: 'Kreditek', width: 120, type: 'number' },
    {
      field: 'actions',
      headerName: 'Műveletek',
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button 
          startIcon={<EditIcon />} 
          onClick={() => handleEditCompany(params.row)}
        >
          Szerkesztés
        </Button>
      ),
    },
  ];

  const surveyColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Cím', width: 200 },
    { field: 'company_name', headerName: 'Cég', width: 200 },
    { field: 'mintavetel', headerName: 'Mintavétel', width: 120, type: 'number' },
    { field: 'created_date', headerName: 'Létrehozva', width: 120 },
    {
      field: 'actions',
      headerName: 'Műveletek',
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button 
          startIcon={<DeleteIcon />} 
          color="error"
          onClick={() => handleDeleteSurvey(params.row.id)}
        >
          Törlés
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Vezérlőpult
          </Typography>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="logout"
            onClick={onSignOut}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="Felhasználók" />
            <Tab label="Cégek" />
            <Tab label="Kérdőívek" />
            <Tab label="Új kérdőív" />
          </Tabs>

          {/* Felhasználók panel */}
          <TabPanel value={value} index={0}>
            <Typography variant="h6" gutterBottom>
              Felhasználók kezelése
            </Typography>
            <Box sx={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={users}
                columns={userColumns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 25]}
                disableSelectionOnClick
                slots={{ toolbar: GridToolbar }}
                initialState={{
                  filter: {
                    filterModel: {
                      items: [],
                    },
                  },
                }}
              />
            </Box>
          </TabPanel>

          {/* Cégek panel */}
          <TabPanel value={value} index={1}>
            <Typography variant="h6" gutterBottom>
              Cégek kezelése
            </Typography>
            <Box sx={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={companies}
                columns={companyColumns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 25]}
                disableSelectionOnClick
                slots={{ toolbar: GridToolbar }}
                initialState={{
                  filter: {
                    filterModel: {
                      items: [],
                    },
                  },
                }}
              />
            </Box>
          </TabPanel>

          {/* Kérdőívek panel */}
          <TabPanel value={value} index={2}>
            <Typography variant="h6" gutterBottom>
              Kérdőívek kezelése
            </Typography>
            <Box sx={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={surveys}
                columns={surveyColumns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 25]}
                disableSelectionOnClick
                slots={{ toolbar: GridToolbar }}
                initialState={{
                  filter: {
                    filterModel: {
                      items: [],
                    },
                  },
                }}
              />
            </Box>
          </TabPanel>

          {/* Új kérdőív panel */}
          <TabPanel value={value} index={3}>
            <Typography variant="h6" gutterBottom>
              Új kérdőív létrehozása
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Kérdőív címe"
                    value={surveyTitle}
                    onChange={(e) => setSurveyTitle(e.target.value)}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Cég kiválasztása</InputLabel>
                    <Select
                      value={selectedCompany}
                      onChange={(e) => setSelectedCompany(e.target.value)}
                      label="Cég kiválasztása"
                      required
                    >
                      {companiesList.map((company) => (
                        <MenuItem key={company.id} value={company.id}>
                          {company.cegnev}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Résztvevők száma"
                    type="number"
                    value={participantCount}
                    onChange={(e) => setParticipantCount(parseInt(e.target.value))}
                    fullWidth
                    margin="normal"
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Kérdések
            </Typography>

            {questions.map((question, qIndex) => (
              <Paper key={question.id} sx={{ p: 3, mb: 3, position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                  <IconButton 
                    color="error" 
                    onClick={() => handleRemoveQuestion(question.id)}
                    disabled={questions.length === 1}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>

                <Typography variant="subtitle1" gutterBottom>
                  Kérdés #{qIndex + 1}
                </Typography>

                <TextField
                  label="Kérdés szövege"
                  value={question.questionText}
                  onChange={(e) => handleQuestionTextChange(question.id, e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />

                <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
                  <Button
                    variant={question.selectedButton === "radio" ? "contained" : "outlined"}
                    startIcon={<RadioButtonCheckedIcon />}
                    onClick={() => handleButtonClick(question.id, "radio")}
                  >
                    Egyszeres választás
                  </Button>
                  <Button
                    variant={question.selectedButton === "checkbox" ? "contained" : "outlined"}
                    startIcon={<CheckBoxIcon />}
                    onClick={() => handleButtonClick(question.id, "checkbox")}
                  >
                    Többszörös választás
                  </Button>
                  <Button
                    variant={question.selectedButton === "text" ? "contained" : "outlined"}
                    startIcon={<TextFieldsIcon />}
                    onClick={() => handleButtonClick(question.id, "text")}
                  >
                    Szöveges válasz
                  </Button>
                </Box>

                {question.selectedButton !== "text" && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Válaszlehetőségek
                    </Typography>
                    
                    {question.options.map((option) => (
                      <Box key={option.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {question.selectedButton === "radio" ? (
                          <Radio disabled />
                        ) : (
                          <Checkbox disabled />
                        )}
                        <TextField
                          value={option.label}
                          onChange={(e) => handleLabelChange(question.id, option.id, e.target.value)}
                          fullWidth
                          size="small"
                          placeholder="Válaszlehetőség"
                        />
                        <IconButton 
                          color="error" 
                          onClick={() => handleRemoveOption(question.id, option.id)}
                          disabled={question.options.length === 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Box>
                    ))}
                    
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => handleAddOption(question.id)}
                      sx={{ mt: 1 }}
                    >
                      Válaszlehetőség hozzáadása
                    </Button>
                  </Box>
                )}
              </Paper>
            ))}

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddQuestion}
              sx={{ mb: 3 }}
            >
              Új kérdés hozzáadása
            </Button>
            <Grid item xs={12} md={6}>
              <TextField
                label="Kredit költség"
                type="number"
                value={creditCost}
                onChange={(e) => setCreditCost(parseInt(e.target.value))}
                fullWidth
                margin="normal"
                InputProps={{ inputProps: { min: 30 } }}
                helperText="Minimum 30 kredit"
              />
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateSurvey}
                size="large"
              >
                Kérdőív létrehozása
              </Button>
            </Box>
          </TabPanel>
        </Paper>
      </Container>

      {/* Felhasználó szerkesztése dialógus */}
      <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)}>
        <DialogTitle>Felhasználó szerkesztése</DialogTitle>
        <DialogContent>
          {currentUser && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <TextField
                label="Név"
                value={currentUser.name}
                onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                fullWidth
              />
              <TextField
                label="Email"
                value={currentUser.email}
                onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                fullWidth
              />
              <TextField
                label="Kreditek"
                type="number"
                value={currentUser.credits}
                onChange={(e) => setCurrentUser({ ...currentUser, credits: parseInt(e.target.value) })}
                fullWidth
              />
              <TextField
                label="Szerepkör"
                value={currentUser.role || 'user'}
                onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
                fullWidth
                helperText="Lehetséges értékek: user, admin"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUserDialog(false)}>Mégse</Button>
          <Button onClick={handleSaveUser} variant="contained">Mentés</Button>
        </DialogActions>
      </Dialog>

      {/* Cég szerkesztése dialógus */}
      <Dialog open={openCompanyDialog} onClose={() => setOpenCompanyDialog(false)}>
        <DialogTitle>Cég szerkesztése</DialogTitle>
        <DialogContent>
          {currentCompany && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <TextField
                label="Cégnév"
                value={currentCompany.cegnev}
                onChange={(e) => setCurrentCompany({ ...currentCompany, cegnev: e.target.value })}
                fullWidth
              />
              <TextField
                label="Email"
                value={currentCompany.ceg_email}
                onChange={(e) => setCurrentCompany({ ...currentCompany, ceg_email: e.target.value })}
                fullWidth
              />
              <TextField
                label="Kreditek"
                type="number"
                value={currentCompany.credits}
                onChange={(e) => setCurrentCompany({ ...currentCompany, credits: parseInt(e.target.value) })}
                fullWidth
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCompanyDialog(false)}>Mégse</Button>
          <Button onClick={handleSaveCompany} variant="contained">Mentés</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar értesítések */}
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={handleCloseSnackbar}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
}