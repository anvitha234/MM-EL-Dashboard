// Application Data
const appData = {
  "current_state_data": [
    {"State": "Odisha", "Avg_Cases_Per_District": 25000, "Avg_Deaths_Per_District": 25, "Risk_Level": "Very High", "Malaria_Burden_Index": 50.0, "A_percent": 20.8, "B_percent": 33.2, "O_percent": 38.2, "AB_percent": 7.8, "Rh_positive": 94.7, "Rh_negative": 5.3, "Susceptibility_Index": 0.885},
    {"State": "Chhattisgarh", "Avg_Cases_Per_District": 20000, "Avg_Deaths_Per_District": 8, "Risk_Level": "Very High", "Malaria_Burden_Index": 28.0, "A_percent": 22.7, "B_percent": 31.7, "O_percent": 38.7, "AB_percent": 6.9, "Rh_positive": 94.6, "Rh_negative": 5.4, "Susceptibility_Index": 0.576},
    {"State": "Jharkhand", "Avg_Cases_Per_District": 15000, "Avg_Deaths_Per_District": 3, "Risk_Level": "High", "Malaria_Burden_Index": 18.0, "A_percent": 23.1, "B_percent": 33.6, "O_percent": 36.0, "AB_percent": 7.3, "Rh_positive": 94.8, "Rh_negative": 5.2, "Susceptibility_Index": 0.444},
    {"State": "Madhya Pradesh", "Avg_Cases_Per_District": 12000, "Avg_Deaths_Per_District": 5, "Risk_Level": "High", "Malaria_Burden_Index": 17.0, "A_percent": 23.1, "B_percent": 36.2, "O_percent": 32.4, "AB_percent": 8.3, "Rh_positive": 93.9, "Rh_negative": 6.1, "Susceptibility_Index": 0.441},
    {"State": "Kerala", "Avg_Cases_Per_District": 200, "Avg_Deaths_Per_District": 1, "Risk_Level": "Very Low", "Malaria_Burden_Index": 1.2, "A_percent": 22.7, "B_percent": 31.7, "O_percent": 38.7, "AB_percent": 7.0, "Rh_positive": 94.6, "Rh_negative": 5.4, "Susceptibility_Index": 0.201},
    {"State": "Punjab", "Avg_Cases_Per_District": 50, "Avg_Deaths_Per_District": 0, "Risk_Level": "Very Low", "Malaria_Burden_Index": 0.05, "A_percent": 21.9, "B_percent": 37.6, "O_percent": 31.2, "AB_percent": 9.3, "Rh_positive": 97.3, "Rh_negative": 2.7, "Susceptibility_Index": 0.207}
  ],
  "allele_frequencies": [
    {"State": "Odisha", "IA_freq": 0.154, "IB_freq": 0.231, "i_freq": 0.615, "Malaria_Burden_Index": 50.0, "O_percent": 38.2},
    {"State": "Chhattisgarh", "IA_freq": 0.161, "IB_freq": 0.217, "i_freq": 0.622, "Malaria_Burden_Index": 28.0, "O_percent": 38.7},
    {"State": "Jharkhand", "IA_freq": 0.166, "IB_freq": 0.232, "i_freq": 0.602, "Malaria_Burden_Index": 18.0, "O_percent": 36.0}
  ],
  "evolution_simulation": [
    {"Generation": 0, "High_Malaria_i_freq": 0.6027, "Low_Malaria_i_freq": 0.5813, "Difference": 0.0214},
    {"Generation": 5, "High_Malaria_i_freq": 0.6685, "Low_Malaria_i_freq": 0.5852, "Difference": 0.0833},
    {"Generation": 10, "High_Malaria_i_freq": 0.7284, "Low_Malaria_i_freq": 0.5891, "Difference": 0.1393},
    {"Generation": 15, "High_Malaria_i_freq": 0.7819, "Low_Malaria_i_freq": 0.5930, "Difference": 0.1889},
    {"Generation": 20, "High_Malaria_i_freq": 0.8284, "Low_Malaria_i_freq": 0.5970, "Difference": 0.2314}
  ],
  "correlations": {
    "malaria_o_correlation": 0.342,
    "malaria_i_correlation": 0.364,
    "p_values": {"o_blood": 0.179, "i_allele": 0.151}
  },
  "scenarios": {
    "Current Trend": {"avg_change": 0.1400, "description": "No change in malaria burden"},
    "Moderate Control": {"avg_change": 0.1848, "description": "2% annual reduction"},
    "Aggressive Control": {"avg_change": 0.2563, "description": "5% annual reduction"},
    "Eradication Effort": {"avg_change": 0.3409, "description": "10% annual reduction"}
  }
};

// Chart colors
const chartColors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];

// Global chart instances
let charts = {};

// Tab Navigation
function initializeTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.dataset.tab;
      
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      document.getElementById(targetTab).classList.add('active');
      
      // Initialize charts for the active tab
      initializeTabCharts(targetTab);
    });
  });
}

// Initialize charts based on active tab
function initializeTabCharts(tab) {
  switch(tab) {
    case 'regional':
      if (!charts.correlation) createCorrelationChart();
      if (!charts.bloodGroup) createBloodGroupChart();
      break;
    case 'evolution':
      if (!charts.evolution) createEvolutionChart();
      break;
    case 'scenarios':
      if (!charts.scenario) createScenarioChart();
      break;
    case 'susceptibility':
      if (!charts.susceptibility) createSusceptibilityChart();
      break;
    case 'ml':
      if (!charts.feature) createFeatureChart();
      break;
  }
}

// Create Correlation Chart
function createCorrelationChart() {
  const ctx = document.getElementById('correlationChart').getContext('2d');
  
  const data = appData.current_state_data.map(state => ({
    x: state.Malaria_Burden_Index,
    y: state.O_percent,
    label: state.State,
    riskLevel: state.Risk_Level
  }));

  const backgroundColors = data.map(point => {
    switch(point.riskLevel) {
      case 'Very High': return chartColors[2]; // Red
      case 'High': return chartColors[6]; // Yellow
      case 'Very Low': return chartColors[0]; // Blue
      default: return chartColors[4]; // Gray
    }
  });

  charts.correlation = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'States',
        data: data,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors,
        borderWidth: 2,
        pointRadius: 8,
        pointHoverRadius: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Malaria Burden vs Blood Group O Frequency',
          font: { size: 16, weight: 'bold' }
        },
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const point = context.parsed;
              const dataPoint = data[context.dataIndex];
              return [
                `State: ${dataPoint.label}`,
                `Malaria Burden: ${point.x}`,
                `O Blood Group: ${point.y}%`,
                `Risk Level: ${dataPoint.riskLevel}`
              ];
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Malaria Burden Index'
          },
          min: 0
        },
        y: {
          title: {
            display: true,
            text: 'O Blood Group Percentage (%)'
          },
          min: 30,
          max: 40
        }
      }
    }
  });
}

// Create Blood Group Distribution Chart
function createBloodGroupChart() {
  const ctx = document.getElementById('bloodGroupChart').getContext('2d');
  
  const states = appData.current_state_data.map(state => state.State);
  const aPercent = appData.current_state_data.map(state => state.A_percent);
  const bPercent = appData.current_state_data.map(state => state.B_percent);
  const oPercent = appData.current_state_data.map(state => state.O_percent);
  const abPercent = appData.current_state_data.map(state => state.AB_percent);

  charts.bloodGroup = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: states,
      datasets: [
        {
          label: 'A',
          data: aPercent,
          backgroundColor: chartColors[0],
          borderWidth: 1
        },
        {
          label: 'B',
          data: bPercent,
          backgroundColor: chartColors[1],
          borderWidth: 1
        },
        {
          label: 'O',
          data: oPercent,
          backgroundColor: chartColors[2],
          borderWidth: 1
        },
        {
          label: 'AB',
          data: abPercent,
          backgroundColor: chartColors[3],
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Blood Group Distribution by State',
          font: { size: 16, weight: 'bold' }
        }
      },
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: 'States'
          }
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: 'Percentage (%)'
          },
          max: 100
        }
      }
    }
  });
}

// Create Evolution Chart
function createEvolutionChart() {
  const ctx = document.getElementById('evolutionChart').getContext('2d');
  
  const generations = appData.evolution_simulation.map(item => item.Generation);
  const highMalariaFreq = appData.evolution_simulation.map(item => item.High_Malaria_i_freq);
  const lowMalariaFreq = appData.evolution_simulation.map(item => item.Low_Malaria_i_freq);

  charts.evolution = new Chart(ctx, {
    type: 'line',
    data: {
      labels: generations,
      datasets: [
        {
          label: 'High Malaria Region',
          data: highMalariaFreq,
          borderColor: chartColors[2],
          backgroundColor: chartColors[2] + '20',
          borderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 8,
          tension: 0.2
        },
        {
          label: 'Low Malaria Region',
          data: lowMalariaFreq,
          borderColor: chartColors[0],
          backgroundColor: chartColors[0] + '20',
          borderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 8,
          tension: 0.2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Evolution of i Allele Frequency Over Generations',
          font: { size: 16, weight: 'bold' }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Generations'
          }
        },
        y: {
          title: {
            display: true,
            text: 'i Allele Frequency'
          },
          min: 0.55,
          max: 0.9
        }
      }
    }
  });
}

// Create Scenario Chart
function createScenarioChart() {
  const ctx = document.getElementById('scenarioChart').getContext('2d');
  
  const scenarios = Object.keys(appData.scenarios);
  const changes = scenarios.map(scenario => appData.scenarios[scenario].avg_change * 100);

  charts.scenario = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: scenarios,
      datasets: [{
        label: 'Average Change (%)',
        data: changes,
        backgroundColor: [
          chartColors[4], // Current Trend
          chartColors[6], // Moderate Control
          chartColors[1], // Aggressive Control
          chartColors[0]  // Eradication Effort
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Projected Allele Frequency Changes by Scenario',
          font: { size: 16, weight: 'bold' }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Scenarios'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Change in i Allele Frequency (%)'
          },
          min: 0
        }
      }
    }
  });
}

// Create Susceptibility Chart
function createSusceptibilityChart() {
  const ctx = document.getElementById('susceptibilityChart').getContext('2d');
  
  const states = appData.current_state_data.map(state => state.State);
  const susceptibility = appData.current_state_data.map(state => state.Susceptibility_Index);
  
  const backgroundColors = susceptibility.map(value => {
    if (value > 0.5) return chartColors[2]; // Very High - Red
    if (value > 0.3) return chartColors[6]; // High - Yellow
    return chartColors[0]; // Low - Blue
  });

  charts.susceptibility = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: states,
      datasets: [{
        label: 'Susceptibility Index',
        data: susceptibility,
        backgroundColor: backgroundColors,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Malaria Susceptibility Index by State',
          font: { size: 16, weight: 'bold' }
        },
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'States'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Susceptibility Index'
          },
          min: 0,
          max: 1
        }
      }
    }
  });
}

// Create Feature Importance Chart
function createFeatureChart() {
  const ctx = document.getElementById('featureChart').getContext('2d');
  
  const features = ['Malaria Burden', 'Geographic Location', 'Population Density', 'Climate Factors', 'Migration Patterns'];
  const importance = [0.364, 0.287, 0.198, 0.156, 0.095];

  charts.feature = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: features,
      datasets: [{
        label: 'Feature Importance',
        data: importance,
        backgroundColor: chartColors.slice(0, 5),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        title: {
          display: true,
          text: 'Feature Importance in Predicting Blood Group Distribution',
          font: { size: 16, weight: 'bold' }
        },
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Importance Score'
          },
          min: 0,
          max: 0.4
        },
        y: {
          title: {
            display: true,
            text: 'Features'
          }
        }
      }
    }
  });
}

// Populate State Table
function populateStateTable() {
  const tableBody = document.querySelector('#stateTable tbody');
  
  appData.current_state_data.forEach(state => {
    const row = document.createElement('tr');
    
    const riskClass = state.Risk_Level.toLowerCase().replace(' ', '-');
    
    row.innerHTML = `
      <td><strong>${state.State}</strong></td>
      <td>${state.Malaria_Burden_Index}</td>
      <td>${state.O_percent}%</td>
      <td><span class="risk-${riskClass}">${state.Risk_Level}</span></td>
      <td>${state.Susceptibility_Index.toFixed(3)}</td>
    `;
    
    tableBody.appendChild(row);
  });
}

// Simulation Controls
function initializeSimulationControls() {
  const selectionCoeffSlider = document.getElementById('selectionCoeff');
  const generationsSlider = document.getElementById('generations');
  const selectionValue = document.getElementById('selectionValue');
  const generationsValue = document.getElementById('generationsValue');
  const runButton = document.getElementById('runSimulation');

  selectionCoeffSlider.addEventListener('input', (e) => {
    selectionValue.textContent = e.target.value;
  });

  generationsSlider.addEventListener('input', (e) => {
    generationsValue.textContent = e.target.value;
  });

  runButton.addEventListener('click', () => {
    updateSimulation();
  });
}

// Update Simulation
function updateSimulation() {
  const selectionCoeff = parseFloat(document.getElementById('selectionCoeff').value);
  const maxGenerations = parseInt(document.getElementById('generations').value);
  
  // Generate new simulation data based on parameters
  const newData = generateSimulationData(selectionCoeff, maxGenerations);
  
  // Update the chart
  if (charts.evolution) {
    charts.evolution.data.labels = newData.generations;
    charts.evolution.data.datasets[0].data = newData.highMalariaFreq;
    charts.evolution.data.datasets[1].data = newData.lowMalariaFreq;
    
    // Update y-axis scale based on new data
    const allValues = [...newData.highMalariaFreq, ...newData.lowMalariaFreq];
    const minVal = Math.min(...allValues) - 0.05;
    const maxVal = Math.max(...allValues) + 0.05;
    charts.evolution.options.scales.y.min = Math.max(0.5, minVal);
    charts.evolution.options.scales.y.max = Math.min(1.0, maxVal);
    
    charts.evolution.update();
  }
  
  // Update interpretation
  updateEvolutionInterpretation(selectionCoeff, maxGenerations, newData);
}

// Generate Simulation Data
function generateSimulationData(selectionCoeff, maxGenerations) {
  const data = {
    generations: [],
    highMalariaFreq: [],
    lowMalariaFreq: []
  };
  
  let highFreq = 0.6027;
  let lowFreq = 0.5813;
  
  const stepSize = Math.max(1, Math.floor(maxGenerations / 10));
  
  for (let gen = 0; gen <= maxGenerations; gen += stepSize) {
    data.generations.push(gen);
    data.highMalariaFreq.push(parseFloat(highFreq.toFixed(4)));
    data.lowMalariaFreq.push(parseFloat(lowFreq.toFixed(4)));
    
    // Apply selection pressure with more visible effects
    if (gen < maxGenerations) {
      // High malaria region: stronger selection for i allele
      const highSelectionEffect = selectionCoeff * stepSize * 2; // Amplified effect
      highFreq = Math.min(0.95, highFreq + (highSelectionEffect * (1 - highFreq) * highFreq));
      
      // Low malaria region: weaker selection
      const lowSelectionEffect = selectionCoeff * stepSize * 0.3; // Reduced effect
      lowFreq = Math.min(0.95, lowFreq + (lowSelectionEffect * (1 - lowFreq) * lowFreq));
    }
  }
  
  return data;
}

// Update Evolution Interpretation
function updateEvolutionInterpretation(selectionCoeff, generations, data) {
  const interpretation = document.getElementById('evolutionInterpretation');
  const finalDifference = data.highMalariaFreq[data.highMalariaFreq.length - 1] - 
                         data.lowMalariaFreq[data.lowMalariaFreq.length - 1];
  const initialDifference = data.highMalariaFreq[0] - data.lowMalariaFreq[0];
  const changeMagnitude = ((finalDifference - initialDifference) * 100).toFixed(1);
  
  interpretation.textContent = `With a selection coefficient of ${selectionCoeff} over ${generations} generations, 
    the difference in i allele frequency between high and low malaria regions increases by ${changeMagnitude} percentage points 
    to ${(finalDifference * 100).toFixed(1)}%. This demonstrates how malaria-driven natural selection amplifies 
    blood group O frequency differences across populations with varying disease burden.`;
}

// Export Data Function
function exportData(filename) {
  const urls = {
    'malaria_blood_analysis.csv': 'https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/cb264b7206212dd75c5153fd40b37121/6b66cd6e-401a-4c47-9b4c-aaa8840380e3/f1cbcb28.csv',
    'evolution_simulation.csv': 'https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/cb264b7206212dd75c5153fd40b37121/6b66cd6e-401a-4c47-9b4c-aaa8840380e3/041f1ba4.csv',
    'allele_frequencies.csv': 'https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/cb264b7206212dd75c5153fd40b37121/6b66cd6e-401a-4c47-9b4c-aaa8840380e3/6b521e95.csv'
  };
  
  const url = urls[filename];
  if (url) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  initializeTabs();
  populateStateTable();
  initializeSimulationControls();
  
  // Initialize charts for the default active tab (overview)
  // Charts will be initialized when tabs are clicked
  
  // Set up chart responsive handling
  Chart.defaults.responsive = true;
  Chart.defaults.maintainAspectRatio = false;
});

// Handle window resize
window.addEventListener('resize', function() {
  Object.values(charts).forEach(chart => {
    if (chart) {
      chart.resize();
    }
  });
});