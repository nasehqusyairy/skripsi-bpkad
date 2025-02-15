const fs = require('fs');
const crypto = require('crypto');

const ENV_PATH = '.env';
const SECRETS = ['SESSION_SECRET', 'CSRF_SECRET', 'COOKIE_SECRET'];

function generateSecret() {
    return crypto.randomBytes(32).toString('base64');
}

function updateEnvFile() {
    if (!fs.existsSync(ENV_PATH)) {
        console.error(`File ${ENV_PATH} tidak ditemukan.`);
        process.exit(1);
    }

    let envContent = fs.readFileSync(ENV_PATH, 'utf8');

    SECRETS.forEach(secret => {
        const newSecret = generateSecret();
        const regex = new RegExp(`^(${secret}=).*`, 'm');
        envContent = envContent.replace(regex, `$1${newSecret}`);
    });

    fs.writeFileSync(ENV_PATH, envContent, 'utf8');
    console.log('Secret keys telah diperbarui!');
}

updateEnvFile();
