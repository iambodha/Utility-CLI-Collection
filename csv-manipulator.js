#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import figlet from 'figlet';

function displayWelcome() {
    console.clear();
    const msg = 'CSV Manipulator';
    console.log(gradient.pastel.multiline(figlet.textSync(msg)));
}

async function queryCSV(data) {
    const { column } = await inquirer.prompt([
        {
            type: 'list',
            name: 'column',
            message: 'Which column would you like to query?',
            choices: Object.keys(data[0])
        }
    ]);

    const { value } = await inquirer.prompt([
        {
            type: 'input',
            name: 'value',
            message: `Enter the value to filter by for column "${column}":`
        }
    ]);

    const results = data.filter(row => row[column] === value);
    displayCSV(results);
}

async function editCSV(data) {
    const { rowIndex } = await inquirer.prompt([
        {
            type: 'input',
            name: 'rowIndex',
            message: 'Enter the row number to edit:',
            validate: input => input >= 0 && input < data.length ? true : 'Invalid row number'
        }
    ]);

    const row = data[rowIndex];
    const columns = Object.keys(row);

    for (const column of columns) {
        const { newValue } = await inquirer.prompt([
            {
                type: 'input',
                name: 'newValue',
                message: `Enter new value for ${column} (leave empty to keep current value: "${row[column]}"):`
            }
        ]);

        if (newValue) {
            row[column] = newValue;
        }
    }

    console.log(chalk.green(`Row ${rowIndex} has been updated.`));
}
