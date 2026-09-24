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

const globalReplacements = [
    { regex: /#FF6B35/gi, newStr: '#7C3AED' },
    { regex: /#F7931E/gi, newStr: '#A855F7' },
    { regex: /#FFA500/gi, newStr: '#0EA5E9' },
    { regex: /#E49B0F/gi, newStr: '#0891B2' },
    { regex: /#ffcc02/gi, newStr: '#22D3EE' }
];

walk(path.join(__dirname, 'client/src'), function(filePath) {
    if (!filePath.match(/\.(js|jsx|css)$/)) return;
    
    let original = fs.readFileSync(filePath, 'utf8');
    let content = original;
    let fileReplacements = 0;
    
    globalReplacements.forEach(r => {
        content = content.replace(r.regex, () => {
            fileReplacements++;
            return r.newStr;
        });
    });

    // Specific replacements for CitizenDashboard.jsx
    if (filePath.endsWith('CitizenDashboard.jsx') || filePath.endsWith('CitizenDashboard.jsx')) {
        let lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('#FF6347') || lines[i].includes('#ff6347')) {
                // Check if it's the Income certificate card
                let isIncome = false;
                for (let j = Math.max(0, i - 5); j <= Math.min(lines.length - 1, i + 5); j++) {
                    if (lines[j].includes('Income certificate')) {
                        isIncome = true;
                        break;
                    }
                }
                if (isIncome) {
                    lines[i] = lines[i].replace(/#FF6347/gi, '#06B6D4');
                    fileReplacements++;
                }
            }
        }
        content = lines.join('\n');
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        modifiedFiles.push({ file: filePath, count: fileReplacements });
    }
});

modifiedFiles.forEach(m => {
    console.log(`Modified ${m.file} - Replacements: ${m.count}`);
});
if (modifiedFiles.length === 0) {
    console.log("No files modified.");
}
