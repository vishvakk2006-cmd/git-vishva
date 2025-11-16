// Water Quality Map JavaScript
let map;
let markers = [];

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize map
    map = L.map('waterQualityMap').setView([20.5937, 78.9629], 5); // Center of India

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Load water quality data
    await loadWaterQualityData();

    // Setup filters
    const stateFilter = document.getElementById('stateFilter');
    if (stateFilter) {
        stateFilter.addEventListener('change', updateCityFilter);
    }
});

async function loadWaterQualityData() {
    try {
        const data = await apiCall('/api/water-quality');
        
        // Clear existing markers
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];

        // Add markers for each state/city
        Object.keys(data).forEach(state => {
            const stateData = data[state];
            if (typeof stateData === 'object') {
                Object.keys(stateData).forEach(city => {
                    const cityData = stateData[city];
                    if (cityData && cityData.qualityIndex !== undefined) {
                        addMarker(state, city, cityData);
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error loading water quality data:', error);
    }
}

function addMarker(state, city, data) {
    // Get approximate coordinates for Indian cities
    const coordinates = getCityCoordinates(state, city);
    if (!coordinates) return;

    const qualityIndex = data.qualityIndex || 0;
    let status = 'poor';
    let color = '#ef4444';

    if (qualityIndex >= 70) {
        status = 'good';
        color = '#10b981';
    } else if (qualityIndex >= 50) {
        status = 'moderate';
        color = '#f59e0b';
    }

    const marker = L.circleMarker(coordinates, {
        radius: 10,
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
    }).addTo(map);

    marker.bindPopup(`
        <div style="min-width: 200px;">
            <h3 style="margin: 0 0 0.5rem 0;">${city}, ${state}</h3>
            <div style="margin-bottom: 0.5rem;">
                <strong>Quality Index:</strong> ${qualityIndex}
            </div>
            <div style="margin-bottom: 0.5rem;">
                <span class="quality-indicator ${status}">${status.toUpperCase()}</span>
            </div>
            <div>
                <strong>Contaminants:</strong> ${(data.contaminants || []).join(', ')}
            </div>
            <button onclick="showQualityDetails('${state}', '${city}')" 
                    style="margin-top: 0.5rem; padding: 0.5rem 1rem; background: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer;">
                View Details
            </button>
        </div>
    `);

    marker.on('click', () => {
        showQualityDetails(state, city);
    });

    markers.push(marker);
}

function getCityCoordinates(state, city) {
    // Approximate coordinates for major Indian cities
    const cityCoords = {
        'Mumbai': [19.0760, 72.8777],
        'Pune': [18.5204, 73.8567],
        'New Delhi': [28.6139, 77.2090],
        'Delhi': [28.6139, 77.2090],
        'Bangalore': [12.9716, 77.5946],
        'Chennai': [13.0827, 80.2707],
        'Kolkata': [22.5726, 88.3639],
        'Hyderabad': [17.3850, 78.4867],
        'Ahmedabad': [23.0225, 72.5714],
        'Jaipur': [26.9124, 75.7873],
        'Surat': [21.1702, 72.8311],
        'Lucknow': [26.8467, 80.9462],
        'Kanpur': [26.4499, 80.3319],
        'Nagpur': [21.1458, 79.0882],
        'Indore': [22.7196, 75.8577],
        'Thane': [19.2183, 72.9781],
        'Bhopal': [23.2599, 77.4126],
        'Visakhapatnam': [17.6868, 83.2185],
        'Patna': [25.5941, 85.1376],
        'Vadodara': [22.3072, 73.1812],
        'Ghaziabad': [28.6692, 77.4538],
        'Ludhiana': [30.9010, 75.8573],
        'Agra': [27.1767, 78.0081],
        'Nashik': [19.9975, 73.7898],
        'Faridabad': [28.4089, 77.3178],
        'Meerut': [28.9845, 77.7064],
        'Rajkot': [22.3039, 70.8022],
        'Varanasi': [25.3176, 82.9739],
        'Srinagar': [34.0837, 74.7973],
        'Amritsar': [31.6340, 74.8723],
        'Chandigarh': [30.7333, 76.7794],
        'Coimbatore': [11.0168, 76.9558],
        'Kochi': [9.9312, 76.2673],
        'Guwahati': [26.1445, 91.7362],
        'Bhubaneswar': [20.2961, 85.8245],
        'Dehradun': [30.3165, 78.0322],
        'Raipur': [21.2514, 81.6296],
        'Jamshedpur': [22.8046, 86.2029],
        'Ranchi': [23.3441, 85.3096],
        'Gwalior': [26.2183, 78.1828],
        'Dhanbad': [23.7957, 86.4304],
        'Jabalpur': [23.1815, 79.9864],
        'Allahabad': [25.4358, 81.8463],
        'Warangal': [18.0000, 79.5833],
        'Aurangabad': [19.8762, 75.3433],
        'Solapur': [17.6599, 75.9064],
        'Mysore': [12.2958, 76.6394],
        'Tiruchirappalli': [10.7905, 78.7047],
        'Salem': [11.6643, 78.1460],
        'Jalandhar': [31.3260, 75.5762],
        'Bareilly': [28.3670, 79.4304],
        'Aligarh': [27.8974, 78.0880],
        'Moradabad': [28.8384, 78.7733],
        'Gurgaon': [28.4089, 77.0378],
        'Noida': [28.5355, 77.3910],
        'Howrah': [22.5958, 88.2636],
        'Durgapur': [23.5204, 87.3119],
        'Asansol': [23.6739, 86.9524],
        'Jamshedpur': [22.8046, 86.2029],
        'Dhanbad': [23.7957, 86.4304],
        'Gaya': [24.7969, 84.9914],
        'Muzaffarpur': [26.1209, 85.3647],
        'Patna': [25.5941, 85.1376],
        'Silchar': [24.8333, 92.7833],
        'Dibrugarh': [27.4728, 94.9120],
        'Shillong': [25.5788, 91.8933],
        'Imphal': [24.8170, 93.9368],
        'Aizawl': [23.7271, 92.7176],
        'Kohima': [25.6751, 94.1086],
        'Agartala': [23.8315, 91.2868],
        'Gangtok': [27.3389, 88.6065],
        'Itanagar': [27.0844, 93.6053],
        'Panaji': [15.4909, 73.8278],
        'Vasco da Gama': [15.3983, 73.8158],
        'Margao': [15.2736, 73.9581],
        'Shimla': [31.1048, 77.1734],
        'Mandi': [31.7083, 76.9314],
        'Dharamshala': [32.2190, 76.3234],
        'Haridwar': [29.9457, 78.1642],
        'Nainital': [29.3919, 79.4542],
        'Bilaspur': [22.0796, 82.1391],
        'Durg': [21.1904, 81.2849],
        'Hubli': [15.3647, 75.1240],
        'Mangalore': [12.9141, 74.8560],
        'Vijayawada': [16.5062, 80.6480],
        'Guntur': [16.3067, 80.4365],
        'Warangal': [18.0000, 79.5833],
        'Nizamabad': [18.6715, 78.0988],
        'Kozhikode': [11.2588, 75.7804],
        'Thiruvananthapuram': [8.5241, 76.9366],
        'Panipat': [29.3909, 76.9635],
        'Amritsar': [31.6340, 74.8723],
        'Ludhiana': [30.9010, 75.8573],
        'Udaipur': [24.5854, 73.7125],
        'Jodhpur': [26.2389, 73.0243],
        'Kota': [25.2138, 75.8648],
        'Bikaner': [28.0229, 73.3119],
        'Ajmer': [26.4499, 74.6399],
        'Alwar': [27.5665, 76.6128],
        'Bharatpur': [27.2152, 77.4901],
        'Bhilwara': [25.3463, 74.6369],
        'Pali': [25.7713, 73.3237],
        'Sri Ganganagar': [29.9038, 73.8772],
        'Hanumangarh': [29.5815, 74.3294],
        'Tonk': [26.1667, 75.7833],
        'Sikar': [27.6119, 75.1397],
        'Churu': [28.3000, 74.9500],
        'Jhunjhunu': [28.1256, 75.3975],
        'Dausa': [26.8944, 76.3347],
        'Karauli': [26.4981, 77.0275],
        'Sawai Madhopur': [26.0239, 76.3447],
        'Dholpur': [26.7025, 77.8933],
        'Baran': [25.1000, 76.5167],
        'Jhalawar': [24.5967, 76.1614],
        'Bundi': [25.4417, 75.6403],
        'Banswara': [23.5500, 74.4500],
        'Dungarpur': [23.8333, 73.7167],
        'Pratapgarh': [24.0333, 74.7833],
        'Chittorgarh': [24.8883, 74.6269],
        'Rajsamand': [25.0667, 73.8833],
        'Bhilwara': [25.3463, 74.6369],
        'Nagaur': [27.2000, 73.7333],
        'Jalore': [25.3500, 72.6167],
        'Sirohi': [24.8833, 72.8500],
        'Jaisalmer': [26.9117, 70.9164],
        'Barmer': [25.7500, 71.3833],
        'Jodhpur': [26.2389, 73.0243],
        'Pali': [25.7713, 73.3237],
        'Sirohi': [24.8833, 72.8500],
        'Jalore': [25.3500, 72.6167],
        'Banswara': [23.5500, 74.4500],
        'Dungarpur': [23.8333, 73.7167],
        'Pratapgarh': [24.0333, 74.7833],
        'Chittorgarh': [24.8883, 74.6269],
        'Rajsamand': [25.0667, 73.8833],
        'Bhilwara': [25.3463, 74.6369],
        'Nagaur': [27.2000, 73.7333],
        'Jalore': [25.3500, 72.6167],
        'Sirohi': [24.8833, 72.8500],
        'Jaisalmer': [26.9117, 70.9164],
        'Barmer': [25.7500, 71.3833]
    };

    return cityCoords[city] || null;
}

async function showQualityDetails(state, city) {
    try {
        const data = await apiCall(`/api/water-quality/${state}/${city}`);
        const container = document.getElementById('qualityDetails');
        const content = document.getElementById('qualityDetailsContent');

        if (!container || !content) return;

        const qualityIndex = data.qualityIndex || 0;
        let status = 'poor';
        if (qualityIndex >= 70) status = 'good';
        else if (qualityIndex >= 50) status = 'moderate';

        content.innerHTML = `
            <div class="quality-card">
                <h4>${city}, ${state}</h4>
                <p><strong>Quality Index:</strong> ${qualityIndex}</p>
                <p><span class="quality-indicator ${status}">${status.toUpperCase()}</span></p>
            </div>
            <div class="quality-card">
                <h4>Contaminants</h4>
                <p>${(data.contaminants || []).join(', ') || 'None detected'}</p>
            </div>
            <div class="quality-card">
                <h4>Last Updated</h4>
                <p>${new Date(data.lastUpdated || Date.now()).toLocaleDateString()}</p>
            </div>
        `;

        container.style.display = 'block';
        container.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error loading quality details:', error);
    }
}

function updateCityFilter() {
    const stateFilter = document.getElementById('stateFilter');
    const cityFilter = document.getElementById('cityFilter');
    
    if (!stateFilter || !cityFilter) return;

    const selectedState = stateFilter.value;
    cityFilter.innerHTML = '<option value="">All Cities</option>';

    if (selectedState) {
        // You would populate this based on your data
        // For now, it's a placeholder
    }
}

function applyFilters() {
    const stateFilter = document.getElementById('stateFilter').value;
    const cityFilter = document.getElementById('cityFilter').value;

    // Filter markers based on selection
    markers.forEach(marker => {
        // This would need to store state/city info with each marker
        // For simplicity, we'll just reload all data
    });

    loadWaterQualityData();
}

// Make function global for onclick
window.showQualityDetails = showQualityDetails;
window.applyFilters = applyFilters;

