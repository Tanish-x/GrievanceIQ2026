const fs = require('fs');
const path = require('path');

const replacements = [
    {
        file: 'server/routes/auth.js',
        changes: [
            { oldStr: 'Welcome to BharatChain!', newStr: 'Welcome to GrievanceIQ!' },
            { oldStr: 'authenticate with BharatChain', newStr: 'authenticate with GrievanceIQ' }
        ]
    },
    {
        file: 'server/services/notification.js',
        // Note: the file might be named notifications.js instead of notification.js based on previous ls.
        // Let's check both just in case.
        changes: [
            { oldStr: 'Welcome to BharatChain! 🎉', newStr: 'Welcome to GrievanceIQ! 🎉' },
            { oldStr: 'BharatChain will undergo scheduled maintenance', newStr: 'GrievanceIQ will undergo scheduled maintenance' }
        ]
    },
    {
        file: 'server/routes/health.js',
        changes: [
            { oldStr: 'BharatChain API Health Check', newStr: 'GrievanceIQ API Health Check' }
        ]
    }
];

const pathsToCheck = {
    'server/services/notification.js': 'server/services/notification.js',
    'server/services/notifications.js': 'server/services/notifications.js'
};

replacements.forEach((rep) => {
    let file = rep.file;
    let fullPath = path.join(__dirname, file);
    
    if (!fs.existsSync(fullPath)) {
        // Try alternate if it's notification.js
        if (file === 'server/services/notification.js') {
            file = 'server/services/notifications.js';
            fullPath = path.join(__dirname, file);
        }
        
        if (!fs.existsSync(fullPath)) {
            console.log(`File not found: ${file} (or alternates)`);
            return;
        }
    }

    let original = fs.readFileSync(fullPath, 'utf8');
    let content = original;
    let lines = content.split('\n');
    let modifiedLines = [];

    rep.changes.forEach(({ oldStr, newStr }) => {
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(oldStr)) {
                let oldLine = lines[i];
                lines[i] = lines[i].split(oldStr).join(newStr);
                modifiedLines.push(`[Line ${i+1}] - ${oldLine.trim()}\n[Line ${i+1}] + ${lines[i].trim()}`);
            }
        }
    });

    let newContent = lines.join('\n');
    if (newContent !== original) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`\n=== Changes in ${file} ===`);
        modifiedLines.forEach(l => console.log(l));
    }
});
