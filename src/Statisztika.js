import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Typography, Box, LinearProgress, Dialog, DialogTitle, DialogContent, List, ListItem, 
  FormControl, InputLabel, Select, MenuItem, TextField, Grid, Tabs, Tab, Divider, DialogActions, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Chart as ChartJS, 
  ArcElement, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend 
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import DownloadIcon from '@mui/icons-material/Download';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import FilterListIcon from '@mui/icons-material/FilterList';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '95%',
  maxWidth: '700px',
  height: '65%',
  padding: theme.spacing(4),
  marginTop: theme.spacing(2),
  overflow: 'auto'
}));

const AnswerBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  width: '100%'
}));

const Statisztika = ({ onClose }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [textAnswers, setTextAnswers] = useState([]);
  const [companySurveys, setCompanySurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [surveyAnswers, setSurveyAnswers] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [selectedQuestionForChart, setSelectedQuestionForChart] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedSurveysForComparison, setSelectedSurveysForComparison] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [demographicData, setDemographicData] = useState(null);
  const [selectedDemographic, setSelectedDemographic] = useState('nem');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filteredSurveys, setFilteredSurveys] = useState([]);
  const chartRef = useRef(null);
  
  const [filters, setFilters] = useState({
    minCompletionPercentage: 0,
    maxCompletionPercentage: 100,
    dateFrom: '',
    dateTo: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const filtered = companySurveys.filter(survey => {
      // Kitöltöttség szűrése
      const completionPercentage = Math.round(survey.completion_percentage);
      if (completionPercentage < filters.minCompletionPercentage || 
          completionPercentage > filters.maxCompletionPercentage) {
        return false;
      }
      
      // Dátum szűrése
      if (filters.dateFrom || filters.dateTo) {
        const surveyDate = new Date(survey.created_date);
        
        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom);
          if (surveyDate < fromDate) return false;
        }
        
        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          // Beállítjuk a nap végére, hogy a teljes napot tartalmazza
          toDate.setHours(23, 59, 59, 999);
          if (surveyDate > toDate) return false;
        }
      }
      
      return true;
    });
    
    setFilteredSurveys(filtered);
    setFilterDialogOpen(false);
  };

  // Ellenőrizzük, hogy van-e aktív szűrő
  const hasActiveFilters = filters.minCompletionPercentage > 0 || 
                           filters.maxCompletionPercentage < 100 ||
                           filters.dateFrom || 
                           filters.dateTo;

  // A megjelenítendő kérdőívek listája
  const surveysToDisplay = hasActiveFilters ? filteredSurveys : companySurveys;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
    if (!compareMode) {
      // Ha bekapcsoljuk az összehasonlítást, az aktuális kérdőívet hozzáadjuk
      if (selectedSurvey) {
        setSelectedSurveysForComparison([selectedSurvey.id]);
      }
    }
  };

  const handleSurveyComparisonToggle = (surveyId) => {
    setSelectedSurveysForComparison(prev => {
      if (prev.includes(surveyId)) {
        return prev.filter(id => id !== surveyId);
      } else {
        return [...prev, surveyId];
      }
    });
  };

  const handleDemographicChange = (event) => {
    setSelectedDemographic(event.target.value);
  };

  useEffect(() => {
    const fetchSurveys = async () => {
      const cegId = localStorage.getItem('cegId');
      const response = await fetch(`http://localhost:3001/api/main/company-surveys/${cegId}`);
      const data = await response.json();
      setCompanySurveys(data);
    };
    fetchSurveys();
  }, []);

  useEffect(() => {
    if (selectedSurvey) {
      const fetchAnswers = async () => {
        const response = await fetch(`http://localhost:3001/api/main/survey-answers/${selectedSurvey.id}`);
        const data = await response.json();
        setSurveyAnswers(data);
        
        // Az első nem szöveges kérdést választjuk ki a diagramhoz
        const firstNonTextQuestion = data.find(q => q.type !== 'text');
        if (firstNonTextQuestion) {
          setSelectedQuestionForChart(firstNonTextQuestion);
        }
      };
      
      const fetchDemographics = async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/companies/survey-demographics/${selectedSurvey.id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setDemographicData(data);
          }
        } catch (error) {
          console.error('Error fetching demographics:', error);
        }
      };
      
      fetchAnswers();
      fetchDemographics();
    }
  }, [selectedSurvey]);

  useEffect(() => {
    if (compareMode && selectedSurveysForComparison.length > 0) {
      const fetchComparisonData = async () => {
        const comparisonResults = {};
        
        for (const surveyId of selectedSurveysForComparison) {
          const response = await fetch(`http://localhost:3001/api/main/survey-answers/${surveyId}`);
          const data = await response.json();
          
          const surveyInfo = companySurveys.find(s => s.id === surveyId);
          if (surveyInfo) {
            comparisonResults[surveyId] = {
              title: surveyInfo.title,
              data: data
            };
          }
        }
        
        setComparisonData(comparisonResults);
      };
      
      fetchComparisonData();
    }
  }, [compareMode, selectedSurveysForComparison, companySurveys]);

  const handleOpenTextAnswers = (answers) => {
    setTextAnswers(answers);
    setOpenDialog(true);
  };

  // Pie chart adatok előkészítése
  const getPieChartData = (question) => {
    if (!question) return null;
    
    const labels = question.answers.map(a => a.option);
    const data = question.answers.map(a => a.count);
    
    // Véletlenszerű színek generálása, átlátszóság nélkül
    const backgroundColors = question.answers.map(() => 
      `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`
    );
    
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderWidth: 1,
        },
      ],
    };
  };

  // Demográfiai adatok előkészítése
  const getDemographicChartData = () => {
    if (!demographicData || !demographicData[selectedDemographic]) return null;
    
    const rawData = demographicData[selectedDemographic];
    const labels = Object.keys(rawData);
    const data = Object.values(rawData);
    
    const backgroundColors = labels.map(() => 
      `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`
    );
    
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderWidth: 1,
        },
      ],
    };
  };

  // Összehasonlító adatok előkészítése
  const getComparisonChartData = () => {
    if (!comparisonData || Object.keys(comparisonData).length === 0) return null;
    
    // Egyszerű példa: az első kérdés válaszainak összehasonlítása
    const datasets = [];
    const labels = [];
    
    // Minden kérdőívhez egy dataset
    Object.entries(comparisonData).forEach(([surveyId, surveyData], index) => {
      const firstQuestion = surveyData.data.find(q => q.type !== 'text');
      if (!firstQuestion) return;
      
      // Az első kérdőív válaszait használjuk címkeként
      if (index === 0) {
        labels.push(...firstQuestion.answers.map(a => a.option));
      }
      
      datasets.push({
        label: surveyData.title,
        data: firstQuestion.answers.map(a => a.count),
        backgroundColor: `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`,
        borderWidth: 1,
      });
    });
    
    return {
      labels,
      datasets
    };
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: selectedQuestionForChart ? selectedQuestionForChart.questionText : '',
      },
    },
  };

  const demographicChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: `Kitöltők megoszlása: ${
          selectedDemographic === 'vegzettseg' ? 'Végzettség' :
          selectedDemographic === 'nem' ? 'Nem' :
          selectedDemographic === 'regio' ? 'Régió' :
          selectedDemographic === 'anyagi' ? 'Anyagi helyzet' :
          'Korcsoport'
        }`,
      },
    },
  };

  const comparisonChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Kérdőívek összehasonlítása',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Diagram exportálása képként
  const exportChart = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then(canvas => {
        canvas.toBlob(blob => {
          saveAs(blob, `survey-chart-${Date.now()}.png`);
        });
      });
    }
  };

  // Adatok exportálása CSV-ként
  const exportDataAsCSV = () => {
    if (!selectedSurvey || !surveyAnswers.length) return;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Fejléc
    csvContent += "Kérdés,Válasz,Darabszám,Százalék\n";
    
    // Adatok
    surveyAnswers.forEach(question => {
      if (question.type === 'text') {
        question.answers.forEach(answer => {
          csvContent += `"${question.questionText}","${answer.option}",1,100%\n`;
        });
      } else {
        question.answers.forEach(answer => {
          csvContent += `"${question.questionText}","${answer.option}",${answer.count},${answer.percentage}%\n`;
        });
      }
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `survey-data-${selectedSurvey.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        width: '95%',
        maxWidth: '700px',
        mt: 2
      }}>
        <Typography
          variant="h5"
          sx={{
            textAlign: 'center',
            mb: 1,
          }}
        >
          {selectedSurvey ? 'Kérdőív statisztika' : 'Válasszon kérdőívet'}
        </Typography>
        
         {/* Eszköztár gombok */}
         {selectedSurvey ? (
          // Ha egy konkrét kérdőívet nézünk, akkor ezek a gombok jelennek meg
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Exportálás képként">
              <IconButton onClick={exportChart}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Exportálás CSV-ként">
              <IconButton onClick={exportDataAsCSV}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={compareMode ? "Összehasonlítás kikapcsolása" : "Összehasonlítás"}>
              <IconButton onClick={toggleCompareMode} color={compareMode ? "primary" : "default"}>
                <CompareArrowsIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          // Ha a kérdőívek listáját nézzük, akkor csak a szűrés gomb jelenik meg
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Szűrés">
              <IconButton onClick={() => setFilterDialogOpen(true)}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
      
      <StyledCard variant="outlined">
        {!selectedSurvey ? (
          <>
            {hasActiveFilters && (
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1">
                  Szűrt eredmények: {filteredSurveys.length} kérdőív
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => {
                    setFilters({
                      minCompletionPercentage: 0,
                      maxCompletionPercentage: 100,
                      dateFrom: '',
                      dateTo: ''
                    });
                    setFilteredSurveys([]);
                  }}
                >
                  Szűrés törlése
                </Button>
              </Box>
            )}
            
            {surveysToDisplay.length > 0 ? (
              surveysToDisplay.map(survey => (
                <Button
                  key={survey.id}
                  onClick={() => setSelectedSurvey(survey)}
                  sx={{
                    height: "80px",
                    textAlign: "left",
                    pl: 4,
                    fontSize: "1.2rem",
                    mb: 2,
                    width: "100%",
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                  variant="outlined"
                >
                  <span>{survey.title}</span>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, mr: 2 }}>
                    <Typography>{survey.created_date}</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography>{Math.round(survey.completion_percentage)}%</Typography>
                      <Typography variant="caption">Kitöltöttség</Typography>
                    </Box>
                  </Box>
                </Button>
              ))
            ) : (
              <Typography sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
                Nincs a szűrési feltételeknek megfelelő kérdőív.
              </Typography>
            )}
          </>
        ) : compareMode ? (
          // Összehasonlító nézet
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Kérdőívek összehasonlítása
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Válassza ki az összehasonlítandó kérdőíveket:
              </Typography>
              <Grid container spacing={1}>
                {companySurveys.map(survey => (
                  <Grid item key={survey.id}>
                    <Button 
                      variant={selectedSurveysForComparison.includes(survey.id) ? "contained" : "outlined"}
                      size="small"
                      onClick={() => handleSurveyComparisonToggle(survey.id)}
                    >
                      {survey.title}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>
            
            {comparisonData && (
              <Box sx={{ height: 400 }} ref={chartRef}>
                <Bar 
                  data={getComparisonChartData()} 
                  options={comparisonChartOptions} 
                />
              </Box>
            )}
            
            <Button 
              onClick={() => setCompareMode(false)}
              variant="outlined"
              sx={{ 
                mt: 3,
                display: 'block',
                margin: '0 auto',
                width: 'fit-content'
              }}
            >
              Vissza a részletes nézethez
            </Button>
          </Box>
        ) : (
          // Részletes nézet
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h5">
                {selectedSurvey.title}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                ({selectedSurvey.created_date})
              </Typography>
            </Box>
            
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
              <Tab label="Válaszok" />
              <Tab label="Demográfia" />
              <Tab label="Időbeli adatok" />
            </Tabs>
            
            {tabValue === 0 && (
              // Válaszok tab
              <>
                {selectedQuestionForChart && selectedQuestionForChart.type !== 'text' && (
                  <Box sx={{ mb: 5 }} ref={chartRef}>
                    <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                      Válaszok megoszlása
                    </Typography>
                    
                    {/* Kördiagram magassága fix, hogy ne nyúljon bele a kérdésválasztóba */}
                    <Box sx={{ height: 300 }}>
                      <Pie data={getPieChartData(selectedQuestionForChart)} options={pieChartOptions} />
                    </Box>
                    
                    {/* Kérdésválasztó elkülönítve, jól látható határral */}
                    <Box sx={{ 
                      mt: 3, 
                      pt: 2, 
                      borderTop: '1px solid',
                      borderColor: 'divider',
                      backgroundColor: (theme) => theme.palette.mode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)',
                      borderRadius: 1,
                      p: 2
                    }}>
                      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                        Válasszon kérdést a diagramhoz:
                      </Typography>
                      <Grid container spacing={1}>
                      {surveyAnswers
                        .filter(q => q.type !== 'text')
                        .map((q, idx) => (
                          <Grid item key={idx}>
                            <Button 
                              variant={selectedQuestionForChart === q ? "contained" : "outlined"}
                              size="small"
                              onClick={() => setSelectedQuestionForChart(q)}
                              sx={{
                                minWidth: '40px',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: '20px'
                              }}
                            >
                              {idx + 1}. kérdés
                            </Button>
                          </Grid>
                        ))
                      }
                    </Grid>
                    </Box>
                  </Box>
                )}
                
                <Divider sx={{ my: 3 }} />
                
                {surveyAnswers.map((question, qIndex) => (
                  <Box key={qIndex} sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {qIndex + 1}. {question.questionText} 
                      <span style={{ fontWeight: 'normal', fontSize: '0.9em' }}>
                        ({question.type === 'radio' ? 'Feleletválasztó' : 
                          question.type === 'checkbox' ? 'Jelölőnégyzet' : 
                          'Szöveges válasz'})
                      </span>
                    </Typography>
                    {question.type === 'text' ? (
                      <Button
                        variant="outlined"
                        onClick={() => handleOpenTextAnswers(question.answers)}
                        sx={{ width: '100%', mt: 1 }}
                      >
                        Szöveges válaszok megtekintése
                      </Button>
                    ) : (
                      question.answers.map((answer, aIndex) => (
                        <AnswerBar key={aIndex}>
                          <Box sx={{ minWidth: 120 }}>
                            <Typography>{aIndex + 1}. {answer.option}</Typography>
                          </Box>
                          <Box sx={{ flex: 1, mr: 2 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={answer.percentage} 
                              sx={{ height: 20, borderRadius: 2 }}
                            />
                          </Box>
                          <Box sx={{ minWidth: 60 }}>
                            <Typography>{answer.count} ({answer.percentage}%)</Typography>
                          </Box>
                        </AnswerBar>
                      ))
                    )}
                  </Box>
                ))}
              </>
            )}
            
            {tabValue === 1 && (
              // Demográfia tab
              <>
                {demographicData ? (
                  <Box>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel 
                        sx={{ 
                          transform: 'translate(-5px, -8px) scale(0.75)',
                          '&.Mui-focused': {
                            transform: 'translate(-5px, -8px) scale(0.75)'
                          },
                          '&.MuiInputLabel-shrink': {
                            transform: 'translate(-5px, -8px) scale(0.75)'
                          }
                        }}
                      >
                        Demográfiai adat
                      </InputLabel>
                      <Select
                        value={selectedDemographic}
                        onChange={handleDemographicChange}
                        label="Demográfiai adat"
                      >
                        <MenuItem value="nem">Nem</MenuItem>
                        <MenuItem value="korcsoport">Korcsoport</MenuItem>
                        <MenuItem value="vegzettseg">Végzettség</MenuItem>
                        <MenuItem value="regio">Régió</MenuItem>
                        <MenuItem value="anyagi">Anyagi helyzet</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <Box sx={{ height: 400 }} ref={chartRef}>
                      <Pie 
                        data={getDemographicChartData()} 
                        options={demographicChartOptions} 
                      />
                    </Box>
                  </Box>
                ) : (
                  <Typography sx={{ textAlign: 'center', mt: 4 }}>
                    Nincs elérhető demográfiai adat ehhez a kérdőívhez.
                  </Typography>
                )}
              </>
            )}
            
            {tabValue === 2 && (
              // Időbeli adatok tab
              <Typography sx={{ textAlign: 'center', mt: 4 }}>
                Az időbeli adatok megjelenítése fejlesztés alatt áll.
              </Typography>
            )}
            
            <Button 
              onClick={() => {
                setSelectedSurvey(null);
                setTabValue(0);
              }}
              variant="outlined"
              sx={{ 
                mb: 2,
                display: 'block',
                margin: '0 auto',
                width: 'fit-content'
              }}
            >
              Vissza a kérdőívekhez
            </Button>
          </Box>
        )}
      </StyledCard>

      {/* Szöveges válaszok dialógus */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Szöveges válaszok</DialogTitle>
        <DialogContent>
          <List>
            {textAnswers.map((answer, index) => (
              <ListItem key={index} sx={{ borderBottom: 1, borderColor: 'divider', py: 2 }}>
                {answer.option}
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      {/* Szűrő dialógus */}
      <Dialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Kérdőívek szűrése</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Kitöltöttség (%)
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Minimum</InputLabel>
                  <Select
                    name="minCompletionPercentage"
                    value={filters.minCompletionPercentage}
                    onChange={handleFilterChange}
                    label="Minimum"
                  >
                    <MenuItem value={0}>0%</MenuItem>
                    <MenuItem value={25}>25%</MenuItem>
                    <MenuItem value={50}>50%</MenuItem>
                    <MenuItem value={75}>75%</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Maximum</InputLabel>
                  <Select
                    name="maxCompletionPercentage"
                    value={filters.maxCompletionPercentage}
                    onChange={handleFilterChange}
                    label="Maximum"
                  >
                    <MenuItem value={25}>25%</MenuItem>
                    <MenuItem value={50}>50%</MenuItem>
                    <MenuItem value={75}>75%</MenuItem>
                    <MenuItem value={100}>100%</MenuItem>
                  </Select>
                </FormControl>
                </Grid>
            </Grid>
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Dátum szerint
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Kezdő dátum"
                  type="date"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Záró dátum"
                  type="date"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilterDialogOpen(false)}>Mégse</Button>
          <Button onClick={applyFilters} variant="contained">Szűrés</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Statisztika;