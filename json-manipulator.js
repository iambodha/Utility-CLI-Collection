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
