const fs = require('fs');
const path = require('path');

// This script replaces placeholders in script.js with actual environment variables during build
const scriptPath = path.join(__dirname, 'script.js');
let content = fs.readFileSync(scriptPath, 'utf8');

const supabaseUrl = process.env.SUPABASE_URL || 'REPLACE_WITH_SUPABASE_URL';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'REPLACE_WITH_SUPABASE_ANON_KEY';

content = content.replace('__SUPABASE_URL__', supabaseUrl);
content = content.replace('__SUPABASE_ANON_KEY__', supabaseAnonKey);

fs.writeFileSync(scriptPath, content);
console.log('Build: Injected Supabase environment variables into script.js');
