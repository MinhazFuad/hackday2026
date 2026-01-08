console.log("Script started");
try {
    const fs = require('fs');
    const path = require('path');

    // Check .env.local
    const envPath = path.resolve('.env.local');
    if (fs.existsSync(envPath)) {
        console.log(".env.local found");
        const content = fs.readFileSync(envPath, 'utf8');
        const hasKey = content.includes('GOOGLE_API_KEY');
        console.log("Has key?", hasKey);
    } else {
        console.log(".env.local NOT found");
    }

    // Check package
    try {
        const pkg = require('@google/genai/package.json');
        console.log("Package version:", pkg.version);
    } catch (e) {
        console.log("Could not find @google/genai package.json");
    }

} catch (e) {
    console.error("Error in script:", e);
}
