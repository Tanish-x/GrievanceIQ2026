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

const replacements = [
    { regex: /#FF9933/gi, newStr: '#4F46E5' },
    { regex: /#138808/gi, newStr: '#06B6D4' },
    { regex: /#50C878/gi, newStr: '#0EA5E9' },
    { regex: /#FFD700/gi, newStr: '#22D3EE' }
];

walk(path.join(__dirname, 'client/src'), function(filePath) {
    if (!filePath.match(/\.(js|jsx)$/)) return;
    
    let original = fs.readFileSync(filePath, 'utf8');
    let content = original;
    let fileReplacements = 0;
    
    replacements.forEach(r => {
        content = content.replace(r.regex, () => {
            fileReplacements++;
            return r.newStr;
        });
    });

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
