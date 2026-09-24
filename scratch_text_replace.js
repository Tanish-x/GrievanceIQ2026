const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

let modifiedFiles = [];

walk(path.join(__dirname, 'client/src'), function(filePath) {
    if (!filePath.match(/\.(js|jsx)$/)) return;
    
    let original = fs.readFileSync(filePath, 'utf8');
    let content = original;
    
    // 1. Remove flag emojis
    content = content.replace(/🇮🇳/g, '');
    
    // 2. Replace Government of India Initiative
    content = content.replace(/भारत सरकार की पहल • Government of India Initiative/g, 'Digital Governance Platform');
    
    // 3. Replace Truth Alone Triumphs
    content = content.replace(/सत्यमेव जयते • Truth Alone Triumphs/g, 'Transparent. Accountable. Citizen-first.');
    
    // 4. Replace hardcoded headers
    content = content.replace(/ग्रीवांस आईक्यू डैशबोर्ड/g, 'GrievanceIQ');
    content = content.replace(/ग्रीवांस आईक्यू • GrievanceIQ/g, 'GrievanceIQ');
    content = content.replace(/ग्रीवांस आईक्यू में आपका स्वागत है/g, 'Welcome to GrievanceIQ');
    content = content.replace(/ग्रीवांस आईक्यू/g, 'GrievanceIQ');
    
    // 5. Government Services -> Public Services
    content = content.replace(/सरकारी सेवाएं/g, 'Public Services');
    content = content.replace(/Government Services/g, 'Public Services');
    
    // 6. Generic icon replacement
    content = content.replace(/🏛️/g, '🏢');
    
    // 7. Remove religious symbols
    content = content.replace(/🕉️/g, '');
    content = content.replace(/🪔/g, '');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        modifiedFiles.push(filePath);
    }
});

console.log(modifiedFiles.join('\n'));
