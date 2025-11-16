// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', async () => {
    const userEmail = localStorage.getItem('userEmail');
    
    if (!userEmail) {
        window.location.href = 'index.html';
        return;
    }

    // Load dashboard data
    try {
        const data = await apiCall(`/api/user/dashboard?email=${encodeURIComponent(userEmail)}`);
        
        // Update stats
        updateStat('waterSaved', data.dashboard.waterSaved || 0);
        updateStat('wasteDiverted', data.dashboard.wasteDiverted || 0);
        updateStat('carbonImpact', data.dashboard.carbonImpact || 0);
        updateStat('ranking', `#${data.dashboard.ranking || 0}`);

        // Initialize charts
        initializeCharts(data);

        // Update activity feed
        updateActivityFeed(data.recentInputs || []);
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
});

function updateStat(id, value) {
    const element = document.getElementById(id);
    if (element) {
        if (typeof value === 'number') {
            animateValue(element, 0, value, 1000);
        } else {
            element.textContent = value;
        }
    }
}

function initializeCharts(data) {
    // Water Usage Chart
    const waterCtx = document.getElementById('waterChart');
    if (waterCtx) {
        new Chart(waterCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Water Usage (L)',
                    data: [120, 115, 110, 105],
                    borderColor: '#0ea5e9',
                    backgroundColor: 'rgba(14, 165, 233, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Waste Chart
    const wasteCtx = document.getElementById('wasteChart');
    if (wasteCtx) {
        new Chart(wasteCtx, {
            type: 'doughnut',
            data: {
                labels: ['Plastic', 'Organic', 'Paper', 'E-Waste'],
                datasets: [{
                    data: [2.5, 3.0, 1.5, 0.5],
                    backgroundColor: [
                        '#0ea5e9',
                        '#10b981',
                        '#f59e0b',
                        '#8b5cf6'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Carbon Impact Chart
    const carbonCtx = document.getElementById('carbonChart');
    if (carbonCtx) {
        new Chart(carbonCtx, {
            type: 'bar',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Carbon Impact (kg CO₂)',
                    data: [5.2, 4.8, 4.5, 4.2],
                    backgroundColor: '#10b981'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

function updateActivityFeed(activities) {
    const feed = document.getElementById('activityFeed');
    if (!feed || !activities.length) return;

    feed.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <i class="fas fa-check-circle"></i>
            <div class="activity-content">
                <p><strong>Input submitted</strong></p>
                <span class="activity-time">${formatTime(activity.timestamp)}</span>
            </div>
        </div>
    `).join('');
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
}

