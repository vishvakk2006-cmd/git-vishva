// Forms JavaScript
let currentStep = 1;
const totalSteps = 3;

// Indian cities by state
const citiesByState = {
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
    'Delhi': ['New Delhi', 'Delhi'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi'],
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad'],
    'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar'],
    'Haryana': ['Gurgaon', 'Faridabad', 'Panipat'],
    'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior'],
    'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela'],
    'Assam': ['Guwahati', 'Silchar', 'Dibrugarh'],
    'Bihar': ['Patna', 'Gaya', 'Muzaffarpur'],
    'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad'],
    'Chhattisgarh': ['Raipur', 'Bilaspur', 'Durg'],
    'Himachal Pradesh': ['Shimla', 'Mandi', 'Dharamshala'],
    'Uttarakhand': ['Dehradun', 'Haridwar', 'Nainital'],
    'Goa': ['Panaji', 'Vasco da Gama', 'Margao'],
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur'],
    'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar'],
    'Manipur': ['Imphal'],
    'Meghalaya': ['Shillong'],
    'Mizoram': ['Aizawl'],
    'Nagaland': ['Kohima'],
    'Tripura': ['Agartala'],
    'Sikkim': ['Gangtok'],
    'Arunachal Pradesh': ['Itanagar']
};

document.addEventListener('DOMContentLoaded', () => {
    // State-City dropdown relationship
    const stateSelect = document.getElementById('state');
    const citySelect = document.getElementById('city');

    if (stateSelect && citySelect) {
        stateSelect.addEventListener('change', () => {
            const selectedState = stateSelect.value;
            citySelect.innerHTML = '<option value="">Select City</option>';
            
            if (selectedState && citiesByState[selectedState]) {
                citySelect.disabled = false;
                citiesByState[selectedState].forEach(city => {
                    const option = document.createElement('option');
                    option.value = city;
                    option.textContent = city;
                    citySelect.appendChild(option);
                });
            } else {
                citySelect.disabled = true;
            }
        });
    }

    // Auto-detect location
    const detectLocationBtn = document.getElementById('detectLocation');
    if (detectLocationBtn) {
        detectLocationBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                detectLocationBtn.disabled = true;
                detectLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Detecting...';
                
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        // In a real app, you'd reverse geocode the coordinates
                        // For now, we'll just show a message
                        alert('Location detected! Please select your state and city manually.');
                        detectLocationBtn.disabled = false;
                        detectLocationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Auto-detect Location';
                    },
                    (error) => {
                        alert('Could not detect location. Please select manually.');
                        detectLocationBtn.disabled = false;
                        detectLocationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Auto-detect Location';
                    }
                );
            } else {
                alert('Geolocation is not supported by your browser.');
            }
        });
    }

    // Form submission
    const form = document.getElementById('inputForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await submitForm();
        });
    }

    // Load draft from localStorage
    loadDraft();
});

function nextStep() {
    if (currentStep < totalSteps) {
        // Validate current step
        const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                input.style.borderColor = 'var(--danger-color)';
            } else {
                input.style.borderColor = '';
            }
        });

        if (!isValid) {
            alert('Please fill in all required fields');
            return;
        }

        // Save draft
        saveDraft();

        // Move to next step
        currentStep++;
        updateProgress();
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateProgress();
    }
}

function updateProgress() {
    // Update form steps
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');

    // Update progress bar
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNum = index + 1;
        if (stepNum <= currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

function saveDraft() {
    const formData = {
        familySize: document.getElementById('familySize')?.value,
        state: document.getElementById('state')?.value,
        city: document.getElementById('city')?.value,
        showering: document.getElementById('showering')?.value,
        dishes: document.getElementById('dishes')?.value,
        laundry: document.getElementById('laundry')?.value,
        cooking: document.getElementById('cooking')?.value,
        gardening: document.getElementById('gardening')?.value,
        otherWater: document.getElementById('otherWater')?.value,
        plasticWaste: document.getElementById('plasticWaste')?.value,
        organicWaste: document.getElementById('organicWaste')?.value,
        paperWaste: document.getElementById('paperWaste')?.value,
        eWaste: document.getElementById('eWaste')?.value,
        otherWaste: document.getElementById('otherWaste')?.value
    };

    localStorage.setItem('formDraft', JSON.stringify(formData));
}

function loadDraft() {
    const draft = localStorage.getItem('formDraft');
    if (draft) {
        const formData = JSON.parse(draft);
        Object.keys(formData).forEach(key => {
            const element = document.getElementById(key);
            if (element && formData[key]) {
                element.value = formData[key];
            }
        });

        // Trigger state change to populate cities
        const stateSelect = document.getElementById('state');
        if (stateSelect && formData.state) {
            stateSelect.dispatchEvent(new Event('change'));
        }
    }
}

async function submitForm() {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        alert('Please login first');
        window.location.href = 'index.html';
        return;
    }

    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }

    const formData = {
        familySize: parseInt(document.getElementById('familySize').value),
        location: {
            state: document.getElementById('state').value,
            city: document.getElementById('city').value
        },
        activities: {
            showering: parseFloat(document.getElementById('showering').value) || 0,
            dishes: parseFloat(document.getElementById('dishes').value) || 0,
            laundry: parseFloat(document.getElementById('laundry').value) || 0,
            cooking: parseFloat(document.getElementById('cooking').value) || 0,
            gardening: parseFloat(document.getElementById('gardening').value) || 0,
            other: parseFloat(document.getElementById('otherWater').value) || 0
        },
        waste: {
            plastic: parseFloat(document.getElementById('plasticWaste').value) || 0,
            organic: parseFloat(document.getElementById('organicWaste').value) || 0,
            paper: parseFloat(document.getElementById('paperWaste').value) || 0,
            eWaste: parseFloat(document.getElementById('eWaste').value) || 0,
            other: parseFloat(document.getElementById('otherWaste').value) || 0
        }
    };

    try {
        const response = await apiCall('/api/user/inputs', {
            method: 'POST',
            body: JSON.stringify({
                email: userEmail,
                inputs: formData
            })
        });

        // Clear draft
        localStorage.removeItem('formDraft');

        // Redirect to insights page
        window.location.href = 'insights.html';
    } catch (error) {
        console.error('Form submission error:', error);
        alert('An error occurred while submitting your data. Please try again.');
    } finally {
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }
}

// Make functions global for onclick handlers
window.nextStep = nextStep;
window.prevStep = prevStep;

