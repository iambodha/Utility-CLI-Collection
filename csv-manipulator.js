#!/usr/bin/env node

import fs from 'fs';
import readline from 'readline';
import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import { parse, stringify } from 'csv';

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

async function saveCSVFile(data) {
    const { filePath } = await inquirer.prompt([
        {
            type: 'input',
            name: 'filePath',
            message: 'Enter the file path to save the CSV:',
            default: 'output.csv'
        }
    ]);

    const spinner = createSpinner('Saving CSV...').start();
    try {
        await saveCSV(filePath, data);
        spinner.success({ text: `CSV saved successfully to ${filePath}.` });
    } catch (error) {
        spinner.error({ text: `Failed to save CSV: ${error.message}` });
    }
}

async function main() {
    displayWelcome();

    const { filePath } = await inquirer.prompt([
        {
            type: 'input',
            name: 'filePath',
            message: 'Enter the path to the CSV file:',
            default: 'data.csv'
        }
    ]);

    const spinner = createSpinner('Loading CSV...').start();
    try {
        const data = await loadCSV(filePath);
        spinner.success({ text: 'CSV loaded successfully!' });
        await mainMenu(data);
    } catch (error) {
        spinner.error({ text: `Failed to load CSV: ${error.message}` });
        process.exit(1);
    }
}

main();
