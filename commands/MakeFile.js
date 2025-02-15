const fs = require('fs');
const path = require('path');

function generateFile(templatePath, outputPath, replacements) {
    let template = fs.readFileSync(templatePath, 'utf8');

    Object.keys(replacements).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        template = template.replace(regex, replacements[key]);
    });

    fs.writeFileSync(outputPath, template);
    console.log(`File generated: ${outputPath}`);
}

const args = process.argv.slice(2);
const command = args[0];
const className = args[1];

if (!className) {
    console.log('Usage: node MakeFile.js [model|migration|seeder] [ClassName]');
    process.exit(1);
}

const tableName = className.toLowerCase() + 's';
const modelName = className;
let outputDir;

switch (command) {
    case 'model':
        outputDir = path.join('src/app/models');
        generateFile(
            path.join(__dirname, 'templates/model.txt'),
            path.join(outputDir, `${className}.ts`),
            { className, fields: '', relationImports: '', relations: '' }
        );
        break;

    case 'migration':
        outputDir = path.join('src/database/migrations');
        generateFile(
            path.join(__dirname, 'templates/migration.txt'),
            path.join(outputDir, `${className}Table.ts`),
            { className: className + 'Table', tableName, columns: '// Define columns here' }
        );
        break;

    case 'seeder':
        outputDir = path.join('src/database/seeders');
        generateFile(
            path.join(__dirname, 'templates/model_seeder.txt'),
            path.join(outputDir, `${className}Seeder.ts`),
            { className: className + 'Seeder', modelName, records: '[/* Define records here */]' }
        );
        break;

    default:
        console.log('Usage: node MakeFile.js [model|migration|seeder] [ClassName]');
}
