// Script to build static version for GitHub Pages
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const docsDir = path.join(__dirname, 'docs');

// Create docs directory if it doesn't exist
if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
}

// Function to copy directory recursively
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Copy all files from public to docs
console.log('Building static site for GitHub Pages...');
console.log('Copying files from public to docs...');
copyDir(publicDir, docsDir);

// Update all HTML files to ensure correct paths
const htmlFiles = [
    'index.html',
    'dashboard.html',
    'inputs.html',
    'insights.html',
    'water-quality.html',
    'profile.html'
];

htmlFiles.forEach(file => {
    const filePath = path.join(docsDir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Ensure all asset paths are relative (they already are)
        // Make sure logo paths work
        content = content.replace(/href="assets\//g, 'href="./assets/');
        content = content.replace(/src="assets\//g, 'src="./assets/');
        content = content.replace(/href="css\//g, 'href="./css/');
        content = content.replace(/href="js\//g, 'href="./js/');
        content = content.replace(/src="js\//g, 'src="./js/');
        
        fs.writeFileSync(filePath, content);
        console.log(`✓ Updated ${file}`);
    }
});

// Create .nojekyll file to prevent Jekyll processing
fs.writeFileSync(path.join(docsDir, '.nojekyll'), '');
console.log('✓ Created .nojekyll file');

console.log('\n✅ Static build complete!');
console.log('📁 Files are in the docs/ directory');
console.log('\n⚠️  Note: Backend API will not work on GitHub Pages.');
console.log('💡 Deploy backend separately to Render/Railway/Vercel for full functionality.');
console.log('\n📝 Next steps:');
console.log('1. Push to GitHub');
console.log('2. Go to Settings → Pages');
console.log('3. Select "Deploy from a branch"');
console.log('4. Choose "main" branch and "/docs" folder');
console.log('5. Save and wait for deployment');

