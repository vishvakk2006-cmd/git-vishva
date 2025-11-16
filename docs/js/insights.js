// Insights JavaScript
document.addEventListener('DOMContentLoaded', async () => {
    const userEmail = localStorage.getItem('userEmail');
    
    if (!userEmail) {
        window.location.href = 'index.html';
        return;
    }

    try {
        // Load insights
        const insights = await apiCall(`/api/insights/${userEmail}`);
        
        // Load recommendations (from last analysis)
        await loadRecommendations(userEmail);
        
        // Initialize charts
        initializeInsightCharts(insights);
        
        // Load leaderboard
        await loadLeaderboard();
    } catch (error) {
        console.error('Error loading insights:', error);
    }
});

async function loadRecommendations(userEmail) {
    try {
        // Get last input to generate recommendations
        const dashboard = await apiCall(`/api/user/dashboard?email=${encodeURIComponent(userEmail)}`);
        
        if (dashboard.insights && dashboard.insights.recommendations) {
            displayRecommendations(dashboard.insights.recommendations);
            displayOptimizationPlan(dashboard.insights.optimizationPlan);
        }
    } catch (error) {
        console.error('Error loading recommendations:', error);
    }
}

function displayRecommendations(recommendations) {
    const grid = document.getElementById('recommendationsGrid');
    if (!grid || !recommendations) return;

    grid.innerHTML = recommendations.map(rec => `
        <div class="recommendation-card ${rec.priority}">
            <div class="recommendation-header">
                <div class="recommendation-title">${rec.title}</div>
                <span class="priority-badge ${rec.priority}">${rec.priority}</span>
            </div>
            <p>${rec.description}</p>
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                <strong>Impact:</strong> ${rec.impact}
            </div>
        </div>
    `).join('');
}

function displayOptimizationPlan(plan) {
    const container = document.getElementById('optimizationPlan');
    if (!container || !plan) return;

    container.innerHTML = `
        <div style="margin-bottom: 2rem;">
            <h3>Current State</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
                <div style="padding: 1rem; background: var(--bg-secondary); border-radius: 8px;">
                    <div style="font-size: 0.9rem; color: var(--text-secondary);">Water Usage</div>
                    <div style="font-size: 1.5rem; font-weight: 600;">${plan.currentState?.waterUsage || 0} L/day</div>
                </div>
                <div style="padding: 1rem; background: var(--bg-secondary); border-radius: 8px;">
                    <div style="font-size: 0.9rem; color: var(--text-secondary);">Efficiency Score</div>
                    <div style="font-size: 1.5rem; font-weight: 600;">${Math.round(plan.currentState?.efficiencyScore || 0)}%</div>
                </div>
            </div>
        </div>
        <div>
            <h3>Estimated Impact</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
                <div style="padding: 1rem; background: #d1fae5; border-radius: 8px;">
                    <div style="font-size: 0.9rem; color: #065f46;">Water Saved</div>
                    <div style="font-size: 1.5rem; font-weight: 600; color: #065f46;">${plan.estimatedImpact?.waterSaved || 0} L/day</div>
                </div>
                <div style="padding: 1rem; background: #d1fae5; border-radius: 8px;">
                    <div style="font-size: 0.9rem; color: #065f46;">Carbon Reduced</div>
                    <div style="font-size: 1.5rem; font-weight: 600; color: #065f46;">${(plan.estimatedImpact?.carbonReduced || 0).toFixed(1)} kg CO₂</div>
                </div>
            </div>
        </div>
    `;
}

function initializeInsightCharts(insights) {
    // Weekly Trends Chart
    const weeklyCtx = document.getElementById('weeklyTrendChart');
    if (weeklyCtx && insights.weeklyTrends) {
        const labels = insights.weeklyTrends.map((_, i) => `Week ${i + 1}`);
        const waterData = insights.weeklyTrends.map(t => t.waterUsage || 0);
        const wasteData = insights.weeklyTrends.map(t => t.wasteGenerated || 0);

        new Chart(weeklyCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Water Usage (L)',
                        data: waterData,
                        borderColor: '#0ea5e9',
                        backgroundColor: 'rgba(14, 165, 233, 0.1)',
                        yAxisID: 'y',
                        tension: 0.4
                    },
                    {
                        label: 'Waste Generated (kg)',
                        data: wasteData,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        yAxisID: 'y1',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        beginAtZero: true
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        beginAtZero: true,
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    }

    // Comparison Chart
    const comparisonCtx = document.getElementById('comparisonChart');
    if (comparisonCtx && insights.comparisons) {
        const comparison = insights.comparisons.previousWeek;
        const regional = insights.comparisons.regionalAverage;

        new Chart(comparisonCtx, {
            type: 'bar',
            data: {
                labels: ['Your Usage', 'Regional Average'],
                datasets: [
                    {
                        label: 'Water Usage (L/person/day)',
                        data: [120, regional?.waterUsage || 135],
                        backgroundColor: ['#0ea5e9', '#94a3b8']
                    }
                ]
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

async function loadLeaderboard() {
    try {
        const leaderboard = await apiCall('/api/leaderboard');
        const container = document.getElementById('leaderboard');
        
        if (!container) return;

        const userEmail = localStorage.getItem('userEmail');
        const userRank = leaderboard.findIndex(entry => entry.email === userEmail) + 1;

        container.innerHTML = `
            <div style="margin-bottom: 2rem; padding: 1.5rem; background: linear-gradient(135deg, #0ea5e9, #06b6d4); border-radius: 12px; color: white;">
                <h3 style="color: white; margin-bottom: 0.5rem;">Your Ranking</h3>
                <div style="font-size: 3rem; font-weight: 700;">#${userRank || 'N/A'}</div>
                <p style="opacity: 0.9;">Keep up the great work!</p>
            </div>
            <div>
                <h3 style="margin-bottom: 1rem;">Top 10</h3>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    ${leaderboard.slice(0, 10).map((entry, index) => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--bg-secondary); border-radius: 8px;">
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <span style="font-weight: 600; color: var(--primary-color);">#${index + 1}</span>
                                <span>${entry.name || entry.email}</span>
                            </div>
                            <div style="font-weight: 600; color: var(--accent-color);">${Math.round(entry.score || 0)} pts</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading leaderboard:', error);
    }
}

