#!/usr/bin/env node

console.log('🔍 Boutique Site Setup Verification');
console.log('=====================================\n');

import fs from 'fs';
import path from 'path';

// Configuration checklist
const checks = [];
let passed = 0;
let failed = 0;

function addCheck(name, condition, message) {
    const result = {
        name,
        passed: condition,
        message
    };
    checks.push(result);
    
    if (condition) {
        console.log(`✅ ${name}`);
        passed++;
    } else {
        console.log(`❌ ${name} - ${message}`);
        failed++;
    }
}

// Check if required files exist
console.log('📁 File Structure Checks:\n');

addCheck(
    'Environment file exists',
    fs.existsSync('.env.local'),
    'Create .env.local file with your configuration'
);

addCheck(
    'Package.json exists',
    fs.existsSync('package.json'),
    'Make sure you\'re in the correct project directory'
);

addCheck(
    'Source directory exists',
    fs.existsSync('src'),
    'Source directory is missing'
);

addCheck(
    'Node modules installed',
    fs.existsSync('node_modules'),
    'Run "npm install" to install dependencies'
);

console.log('\n📝 Configuration Checks:\n');

// Check environment variables
if (fs.existsSync('.env.local')) {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    
    const requiredVars = [
        'VITE_SITE_NAME',
        'VITE_SUPABASE_URL', 
        'VITE_SUPABASE_ANON_KEY'
    ];
    
    requiredVars.forEach(varName => {
        const hasVar = envContent.includes(varName);
        const hasValue = hasVar && envContent.match(new RegExp(`${varName}=.+`));
        
        addCheck(
            `${varName} configured`,
            hasVar && hasValue,
            `Add ${varName} to your .env.local file`
        );
    });
    
    // Check for placeholder values
    addCheck(
        'Supabase URL is not placeholder',
        !envContent.includes('your-project.supabase.co'),
        'Replace placeholder Supabase URL with your actual project URL'
    );
    
    addCheck(
        'Site name is customized',
        !envContent.includes('My Boutique Store') || envContent.includes('VITE_SITE_NAME=') && !envContent.includes('"My Boutique Store"'),
        'Customize your site name in .env.local'
    );
}

console.log('\n🏗️ Project Structure Checks:\n');

const expectedDirs = [
    'src/components',
    'src/pages', 
    'src/lib',
    'public'
];

expectedDirs.forEach(dir => {
    addCheck(
        `${dir} directory exists`,
        fs.existsSync(dir),
        `Missing ${dir} directory`
    );
});

// Check key files
const keyFiles = [
    'src/main.tsx',
    'src/App.tsx',
    'index.html',
    'tailwind.config.ts',
    'vite.config.ts'
];

keyFiles.forEach(file => {
    addCheck(
        `${file} exists`,
        fs.existsSync(file),
        `Missing ${file} - make sure you're in the correct directory`
    );
});

console.log('\n🔧 Configuration Files:\n');

// Check if site config was created
addCheck(
    'Site configuration created',
    fs.existsSync('src/config/site.ts'),
    'Site configuration file should be created by setup script'
);

// Check if redirects file exists for Netlify
addCheck(
    'Netlify redirects configured',
    fs.existsSync('public/_redirects'),
    'Copy cloning-system/templates/_redirects to public/_redirects'
);

console.log('\n📊 Summary:\n');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%\n`);

if (failed === 0) {
    console.log('🎉 All checks passed! Your setup looks good.');
    console.log('\n🚀 Next steps:');
    console.log('1. Set up your Supabase database');
    console.log('2. Run "npm run dev" to start development');
    console.log('3. Access admin panel to configure Noest Express');
    process.exit(0);
} else if (failed <= 2) {
    console.log('⚠️  Minor issues detected. Your setup should still work, but consider fixing the issues above.');
    process.exit(0);
} else {
    console.log('❌ Multiple issues detected. Please fix the issues above before proceeding.');
    console.log('\n🆘 Need help? Check the documentation:');
    console.log('- cloning-system/COMPLETE_GUIDE.md');
    console.log('- cloning-system/TROUBLESHOOTING.md');
    process.exit(1);
}
