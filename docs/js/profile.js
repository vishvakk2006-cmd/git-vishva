// Profile JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');

    if (!userEmail) {
        window.location.href = 'index.html';
        return;
    }

    // Populate profile
    const nameElement = document.getElementById('userName');
    const emailElement = document.getElementById('userEmail');
    const profileNameInput = document.getElementById('profileName');
    const profileEmailInput = document.getElementById('profileEmail');

    if (nameElement) nameElement.textContent = userName || 'User';
    if (emailElement) emailElement.textContent = userEmail;
    if (profileNameInput) profileNameInput.value = userName || '';
    if (profileEmailInput) profileEmailInput.value = userEmail;

    // Load preferences
    loadPreferences();
});

function updateProfile() {
    const name = document.getElementById('profileName').value;
    if (!name) {
        alert('Please enter your name');
        return;
    }

    localStorage.setItem('userName', name);
    document.getElementById('userName').textContent = name;
    alert('Profile updated successfully!');
}

function exportData(format) {
    const userEmail = localStorage.getItem('userEmail');
    
    // In a real app, this would fetch data from the server
    const data = {
        user: userEmail,
        exportedAt: new Date().toISOString(),
        data: 'Your data would be here'
    };

    let content, filename, mimeType;

    if (format === 'csv') {
        content = 'Date,Water Saved,Waste Diverted,Carbon Impact\n';
        content += `${new Date().toISOString()},0,0,0\n`;
        filename = `aqua-loop-data-${Date.now()}.csv`;
        mimeType = 'text/csv';
    } else {
        content = JSON.stringify(data, null, 2);
        filename = `aqua-loop-data-${Date.now()}.json`;
        mimeType = 'application/json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function loadPreferences() {
    const emailNotifications = localStorage.getItem('emailNotifications') !== 'false';
    const weeklyReports = localStorage.getItem('weeklyReports') !== 'false';

    const emailCheckbox = document.getElementById('emailNotifications');
    const weeklyCheckbox = document.getElementById('weeklyReports');

    if (emailCheckbox) emailCheckbox.checked = emailNotifications;
    if (weeklyCheckbox) weeklyCheckbox.checked = weeklyReports;
}

function savePreferences() {
    const emailNotifications = document.getElementById('emailNotifications').checked;
    const weeklyReports = document.getElementById('weeklyReports').checked;

    localStorage.setItem('emailNotifications', emailNotifications);
    localStorage.setItem('weeklyReports', weeklyReports);

    alert('Preferences saved!');
}

function deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        if (confirm('This will permanently delete all your data. Are you absolutely sure?')) {
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userName');
            alert('Account deleted. Redirecting to home page...');
            window.location.href = 'index.html';
        }
    }
}

// Make functions global
window.updateProfile = updateProfile;
window.exportData = exportData;
window.savePreferences = savePreferences;
window.deleteAccount = deleteAccount;

