const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Data storage (in production, use a proper database)
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// Helper function to read/write JSON data
const readData = (filename) => {
  const filePath = path.join(DATA_DIR, filename);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return {};
};

const writeData = (filename, data) => {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// API Routes

// User Registration
app.post('/api/user/register', (req, res) => {
  const { email, password, name } = req.body;
  const users = readData('users.json');
  
  if (users[email]) {
    return res.status(400).json({ error: 'User already exists' });
  }
  
  users[email] = {
    name,
    email,
    password, // In production, hash this
    createdAt: new Date().toISOString(),
    dashboard: {
      waterSaved: 0,
      wasteDiverted: 0,
      carbonImpact: 0,
      ranking: 0
    }
  };
  
  writeData('users.json', users);
  res.json({ success: true, user: { email, name } });
});

// User Login
app.post('/api/user/login', (req, res) => {
  const { email, password } = req.body;
  const users = readData('users.json');
  
  if (users[email] && users[email].password === password) {
    res.json({ success: true, user: { email, name: users[email].name } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Get Dashboard Data
app.get('/api/user/dashboard', (req, res) => {
  const { email } = req.query;
  const users = readData('users.json');
  const userInputs = readData('userInputs.json');
  
  if (!users[email]) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const userData = userInputs[email] || {};
  const dashboard = users[email].dashboard || {
    waterSaved: 0,
    wasteDiverted: 0,
    carbonImpact: 0,
    ranking: 0
  };
  
  res.json({
    dashboard,
    recentInputs: userData.recentInputs || [],
    insights: calculateInsights(userData)
  });
});

// Save User Inputs
app.post('/api/user/inputs', (req, res) => {
  const { email, inputs } = req.body;
  const userInputs = readData('userInputs.json');
  
  if (!userInputs[email]) {
    userInputs[email] = { inputs: [], recentInputs: [] };
  }
  
  const timestamp = new Date().toISOString();
  const inputData = {
    ...inputs,
    timestamp,
    id: Date.now()
  };
  
  userInputs[email].inputs.push(inputData);
  userInputs[email].recentInputs = userInputs[email].inputs.slice(-5);
  
  writeData('userInputs.json', userInputs);
  
  // Calculate and update dashboard
  const analysis = analyzeInputs(inputs);
  updateDashboard(email, analysis);
  
  res.json({ success: true, analysis });
});

// Water Quality Data
app.get('/api/water-quality/:state?/:city?', (req, res) => {
  const { state, city } = req.params;
  
  // Mock data - in production, fetch from real API
  const waterQualityData = readData('waterQuality.json');
  
  if (state && city) {
    const cityData = waterQualityData[state]?.[city];
    if (cityData) {
      return res.json(cityData);
    }
  } else if (state) {
    const stateData = waterQualityData[state];
    if (stateData) {
      return res.json(stateData);
    }
  }
  
  res.json(waterQualityData);
});

// AI Analysis
app.post('/api/ai/analyze', (req, res) => {
  const { inputs, userId } = req.body;
  
  const analysis = analyzeInputs(inputs);
  const recommendations = generateRecommendations(inputs, analysis);
  
  res.json({
    analysis,
    recommendations,
    optimizationPlan: generateOptimizationPlan(analysis, recommendations)
  });
});

// Get Insights
app.get('/api/insights/:userId', (req, res) => {
  const { userId } = req.params;
  const userInputs = readData('userInputs.json');
  const userData = userInputs[userId] || {};
  
  const insights = calculateInsights(userData);
  res.json(insights);
});

// Leaderboard
app.get('/api/leaderboard', (req, res) => {
  const users = readData('users.json');
  const leaderboard = Object.entries(users)
    .map(([email, user]) => ({
      email,
      name: user.name,
      score: calculateScore(user.dashboard || {}),
      ...user.dashboard
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 100);
  
  res.json(leaderboard);
});

// Helper Functions
function calculateInsights(userData) {
  const inputs = userData.inputs || [];
  if (inputs.length === 0) {
    return {
      weeklyTrends: [],
      comparisons: {},
      predictions: {}
    };
  }
  
  const recent = inputs.slice(-4); // Last 4 weeks
  const weeklyTrends = recent.map(input => ({
    week: input.timestamp,
    waterUsage: calculateWaterUsage(input),
    wasteGenerated: calculateWaste(input)
  }));
  
  return {
    weeklyTrends,
    comparisons: {
      previousWeek: recent.length > 1 ? compareWeeks(recent[recent.length - 2], recent[recent.length - 1]) : null,
      regionalAverage: getRegionalAverage(userData.location)
    },
    predictions: predictFutureWaste(inputs)
  };
}

function analyzeInputs(inputs) {
  const waterUsage = calculateWaterUsage(inputs);
  const wasteGenerated = calculateWaste(inputs);
  const inefficiencies = identifyInefficiencies(inputs);
  
  return {
    waterUsage,
    wasteGenerated,
    inefficiencies,
    carbonImpact: calculateCarbonImpact(wasteGenerated),
    efficiencyScore: calculateEfficiencyScore(inputs)
  };
}

function calculateWaterUsage(inputs) {
  const familySize = inputs.familySize || 1;
  const activities = inputs.activities || {};
  
  // Approximate water usage calculations (liters)
  const showerWater = (activities.showering || 0) * 10 * familySize; // 10L per minute
  const dishWater = (activities.dishes || 0) * 20 * familySize; // 20L per wash
  const laundryWater = (activities.laundry || 0) * 50; // 50L per load
  const cookingWater = (activities.cooking || 0) * 5 * familySize; // 5L per meal
  const gardeningWater = (activities.gardening || 0) * 30; // 30L per hour
  
  return showerWater + dishWater + laundryWater + cookingWater + gardeningWater;
}

function calculateWaste(inputs) {
  const waste = inputs.waste || {};
  return {
    plastic: waste.plastic || 0,
    organic: waste.organic || 0,
    paper: waste.paper || 0,
    eWaste: waste.eWaste || 0,
    total: (waste.plastic || 0) + (waste.organic || 0) + (waste.paper || 0)
  };
}

function identifyInefficiencies(inputs) {
  const inefficiencies = [];
  const activities = inputs.activities || {};
  const familySize = inputs.familySize || 1;
  
  const avgShowerTime = 10; // minutes
  const avgDishWashes = 2; // per day
  
  if (activities.showering > avgShowerTime * familySize) {
    inefficiencies.push({
      type: 'showering',
      issue: 'Shower time exceeds average',
      impact: 'high',
      current: activities.showering,
      average: avgShowerTime * familySize
    });
  }
  
  if (activities.dishes > avgDishWashes * familySize) {
    inefficiencies.push({
      type: 'dishes',
      issue: 'Dish washing frequency is high',
      impact: 'medium',
      current: activities.dishes,
      average: avgDishWashes * familySize
    });
  }
  
  return inefficiencies;
}

function calculateCarbonImpact(waste) {
  // CO2 equivalent in kg
  const plasticCO2 = waste.plastic * 2.5; // kg CO2 per kg plastic
  const organicCO2 = waste.organic * 0.5; // kg CO2 per kg organic
  const paperCO2 = waste.paper * 1.0; // kg CO2 per kg paper
  
  return plasticCO2 + organicCO2 + paperCO2;
}

function calculateEfficiencyScore(inputs) {
  const waterUsage = calculateWaterUsage(inputs);
  const familySize = inputs.familySize || 1;
  const avgWaterPerPerson = 135; // liters per day average in India
  
  const score = Math.max(0, 100 - ((waterUsage / familySize - avgWaterPerPerson) / avgWaterPerPerson * 100));
  return Math.min(100, Math.max(0, score));
}

function generateRecommendations(inputs, analysis) {
  const recommendations = [];
  
  analysis.inefficiencies.forEach(ineff => {
    if (ineff.type === 'showering') {
      recommendations.push({
        priority: 'high',
        title: 'Reduce shower time',
        description: 'Try to reduce shower time by 2-3 minutes',
        impact: 'Save ~20-30 liters per day',
        category: 'water'
      });
    }
    
    if (ineff.type === 'dishes') {
      recommendations.push({
        priority: 'medium',
        title: 'Optimize dish washing',
        description: 'Use a dishwasher or wash dishes in batches',
        impact: 'Save ~10-15 liters per day',
        category: 'water'
      });
    }
  });
  
  // General recommendations
  recommendations.push({
    priority: 'low',
    title: 'Fix leaks',
    description: 'Check for and fix any water leaks in your home',
    impact: 'Save ~20-30 liters per day',
    category: 'water'
  });
  
  return recommendations;
}

function generateOptimizationPlan(analysis, recommendations) {
  return {
    currentState: {
      waterUsage: analysis.waterUsage,
      efficiencyScore: analysis.efficiencyScore
    },
    recommendations: recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }),
    estimatedImpact: {
      waterSaved: recommendations.reduce((sum, rec) => {
        const match = rec.impact.match(/(\d+)/);
        return sum + (match ? parseInt(match[1]) : 0);
      }, 0),
      carbonReduced: analysis.carbonImpact * 0.3 // 30% reduction potential
    }
  };
}

function updateDashboard(email, analysis) {
  const users = readData('users.json');
  if (users[email]) {
    const dashboard = users[email].dashboard || {};
    dashboard.waterSaved = (dashboard.waterSaved || 0) + (analysis.waterUsage * 0.1); // 10% savings potential
    dashboard.wasteDiverted = (dashboard.wasteDiverted || 0) + (analysis.wasteGenerated.total || 0);
    dashboard.carbonImpact = (dashboard.carbonImpact || 0) + analysis.carbonImpact;
    dashboard.ranking = calculateScore(dashboard);
    
    users[email].dashboard = dashboard;
    writeData('users.json', users);
  }
}

function calculateScore(dashboard) {
  return (dashboard.waterSaved || 0) * 0.5 + 
         (dashboard.wasteDiverted || 0) * 2 + 
         (dashboard.carbonImpact || 0) * 10;
}

function compareWeeks(week1, week2) {
  const usage1 = calculateWaterUsage(week1);
  const usage2 = calculateWaterUsage(week2);
  return {
    waterChange: ((usage2 - usage1) / usage1 * 100).toFixed(1),
    wasteChange: ((calculateWaste(week2).total - calculateWaste(week1).total) / calculateWaste(week1).total * 100).toFixed(1)
  };
}

function getRegionalAverage(location) {
  // Mock regional averages
  return {
    waterUsage: 135, // liters per person per day
    wasteGeneration: 0.5 // kg per person per day
  };
}

function predictFutureWaste(inputs) {
  if (inputs.length < 2) return {};
  
  const recent = inputs.slice(-4);
  const trend = recent.map(input => calculateWaste(input).total);
  const avgTrend = trend.reduce((a, b) => a + b, 0) / trend.length;
  
  return {
    nextWeek: avgTrend * 1.05, // 5% increase prediction
    nextMonth: avgTrend * 1.2 // 20% increase prediction
  };
}

// Initialize default data
if (!fs.existsSync(path.join(DATA_DIR, 'waterQuality.json'))) {
  const defaultWaterQuality = {
    'Maharashtra': {
      'Mumbai': {
        qualityIndex: 65,
        contaminants: ['Chlorine', 'Heavy Metals'],
        status: 'moderate',
        lastUpdated: new Date().toISOString()
      },
      'Pune': {
        qualityIndex: 72,
        contaminants: ['Chlorine'],
        status: 'good',
        lastUpdated: new Date().toISOString()
      }
    },
    'Delhi': {
      'New Delhi': {
        qualityIndex: 58,
        contaminants: ['Heavy Metals', 'Bacteria'],
        status: 'poor',
        lastUpdated: new Date().toISOString()
      }
    },
    'Karnataka': {
      'Bangalore': {
        qualityIndex: 68,
        contaminants: ['Chlorine', 'Chemicals'],
        status: 'moderate',
        lastUpdated: new Date().toISOString()
      }
    }
  };
  writeData('waterQuality.json', defaultWaterQuality);
}

// Serve index page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

