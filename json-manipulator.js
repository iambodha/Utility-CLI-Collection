#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import fs from 'fs';


function displayTitle() {
    console.clear();
    const title = gradient.rainbow(figlet.textSync('JSON Manipulator CLI', {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default',
    }));
    console.log(title);
}


async function loadJsonFile() {
    const answers = await inquirer.prompt([
        {
            name: 'filePath',
            type: 'input',
            message: 'Enter the path to the JSON file:',
            default() {
                return './sample.json';
            },
        },
    ]);

    try {
        const data = fs.readFileSync(answers.filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(chalk.red('Error reading the file.'));
        process.exit(1);
    }
}


async function queryJson(data) {
    const { key } = await inquirer.prompt([
        {
            name: 'key',
            type: 'input',
            message: 'Enter the key to query:',
        },
    ]);

    if (data.hasOwnProperty(key)) {
        console.log(chalk.green(`Value: ${JSON.stringify(data[key], null, 2)}`));
    } else {
        console.log(chalk.red('Key not found.'));
    }
}


async function editJson(data) {
    const { key, value } = await inquirer.prompt([
        {
            name: 'key',
            type: 'input',
            message: 'Enter the key to edit/add:',
        },
        {
            name: 'value',
            type: 'input',
            message: 'Enter the new value (as a string):',
        },
    ]);

    try {
        data[key] = JSON.parse(value);
        console.log(chalk.green('Data updated successfully!'));
    } catch (err) {
        console.log(chalk.red('Invalid JSON value.'));
    }
}


async function saveJsonFile(data) {
    const { filePath } = await inquirer.prompt([
        {
            name: 'filePath',
            type: 'input',
            message: 'Enter the path to save the JSON file:',
            default() {
                return './output.json';
            },
        },
    ]);

    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(chalk.green(`File saved successfully to ${filePath}`));
    } catch (err) {
        console.error(chalk.red('Error saving the file.'));
    }
}


async function mainMenu(data) {
    const { action } = await inquirer.prompt([
        {
            name: 'action',
            type: 'list',
            message: 'What do you want to do?',
            choices: ['Query JSON', 'Edit JSON', 'Save JSON', 'Exit'],
        },
    ]);

    switch (action) {
        case 'Query JSON':
            await queryJson(data);
            break;
        case 'Edit JSON':
            await editJson(data);
            break;
        case 'Save JSON':
            await saveJsonFile(data);
            break;
        case 'Exit':
            process.exit(0);
    }

    await mainMenu(data);
}

async function init() {
    displayTitle();
    const spinner = createSpinner('Loading...').start();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    spinner.success({ text: chalk.green('Ready!') });

    const jsonData = await loadJsonFile();
    await mainMenu(jsonData);
}

init();
