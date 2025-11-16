# Aqua Loop - Water & Waste Management Website

A comprehensive water and water waste management website for India with real-time data integration, personalized dashboards, and AI-powered insights.

## Features

- **User Dashboard**: Track water saved, waste diverted, carbon impact, and society ranking
- **Multi-step Input Forms**: Enter family size, water usage activities, and waste generation data
- **AI-Powered Analysis**: Get personalized recommendations and optimization plans
- **Water Quality Map**: Interactive map showing contamination levels across Indian states and cities
- **Insights & Analytics**: Weekly trends, impact graphs, and comparisons
- **Gamification**: Challenges, leaderboard, and achievements
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Professional Logo**: Custom-designed water-themed logo

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js with Express.js
- **Charts**: Chart.js
- **Maps**: Leaflet.js
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Inter, Poppins)

## Installation

1. Clone or download this repository

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure

```
Aqua Loop/
├── server.js              # Express server and API endpoints
├── package.json           # Dependencies and scripts
├── data/                  # JSON data storage (created automatically)
│   ├── users.json
│   ├── userInputs.json
│   └── waterQuality.json
└── public/                # Frontend files
    ├── index.html         # Landing page
    ├── dashboard.html     # User dashboard
    ├── inputs.html        # Input forms
    ├── insights.html      # Insights and recommendations
    ├── water-quality.html # Water quality map
    ├── profile.html       # User profile
    ├── assets/            # Logo and images
    │   ├── logo.svg
    │   └── logo-icon.svg
    ├── css/
    │   ├── main.css       # Main styles
    │   └── components.css # Component styles
    └── js/
        ├── main.js        # Main JavaScript
        ├── dashboard.js   # Dashboard functionality
        ├── forms.js       # Form handling
        ├── insights.js    # Insights functionality
        ├── water-quality.js # Map functionality
        └── profile.js     # Profile functionality
```

## API Endpoints

- `POST /api/user/register` - User registration
- `POST /api/user/login` - User authentication
- `GET /api/user/dashboard` - Get dashboard data
- `POST /api/user/inputs` - Save user inputs
- `GET /api/water-quality/:state?/:city?` - Get water quality data
- `POST /api/ai/analyze` - AI analysis endpoint
- `GET /api/insights/:userId` - Get user insights
- `GET /api/leaderboard` - Get leaderboard data

## Usage

1. **Register/Login**: Create an account or login to access the dashboard
2. **Input Data**: Fill out the multi-step form with your family size, water usage, and waste data
3. **View Dashboard**: See your metrics and progress
4. **Get Insights**: View personalized recommendations and optimization plans
5. **Check Water Quality**: Explore the interactive map to see water quality in different cities
6. **Complete Challenges**: Participate in challenges to improve your score

## Features in Detail

### Dashboard
- Real-time metrics with animated counters
- Interactive charts showing trends
- Recent activity feed
- Quick action buttons

### Input Forms
- Multi-step form with progress indicator
- Auto-save to localStorage
- Location auto-detection
- Form validation

### Insights
- Weekly trends visualization
- Personalized recommendations with priority levels
- Optimization plan with estimated impact
- Challenges with progress tracking
- Leaderboard ranking

### Water Quality Map
- Interactive map of India
- Color-coded markers by quality index
- State and city filters
- Detailed quality information

## Logo

The website features a custom-designed logo:
- **Main Logo**: `public/assets/logo.svg` - Full logo with text
- **Icon**: `public/assets/logo-icon.svg` - Icon only (for favicon)

## Deployment

See deployment options:
- **Render**: https://render.com (Recommended)
- **Railway**: https://railway.app
- **Vercel**: https://vercel.com

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

