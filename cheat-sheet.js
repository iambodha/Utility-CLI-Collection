#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import fs from 'fs';

const CHEATSHEET_FILE = './cheatsheets.json';

const loadCheatsheets = () => {
    if (fs.existsSync(CHEATSHEET_FILE)) {
        const data = fs.readFileSync(CHEATSHEET_FILE, 'utf-8');
        return JSON.parse(data);
    } else {
        return {};
    }
};

const saveCheatsheets = (data) => {
    fs.writeFileSync(CHEATSHEET_FILE, JSON.stringify(data, null, 2));
};

const showWelcome = () => {
    const title = chalkAnimation.rainbow(figlet.textSync('CheatSheet CLI', {
        horizontalLayout: 'default',
        verticalLayout: 'default',
    }));
    return new Promise((resolve) => {
        setTimeout(() => {
            title.stop(); 
            console.log(chalk.green.bold('\nManage your personal cheatsheets with ease!\n'));
            resolve();
        }, 2000);
    });
};

const mainMenu = async () => {
    const choices = [
        'View all cheatsheets',
        'Add a new cheatsheet',
        'Remove a cheatsheet',
        'Search cheatsheets',
        'Exit'
    ];
    const { action } = await inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: choices.map(choice => gradient.pastel(choice))
    });

    return action;
};

const searchCheatsheet = async () => {
    const { query } = await inquirer.prompt({
        name: 'query',
        type: 'input',
        message: 'Enter search term:'
    });

    const cheatsheets = loadCheatsheets();

    const results = Object.entries(cheatsheets).filter(([name, content]) =>
        name.includes(query) || content.includes(query)
    );

    if (results.length > 0) {
        console.log(chalk.yellow('Search results:'));
        results.forEach(([name, content]) => {
            console.log(chalk.blue(`\n${name}:`));
            console.log(chalk.gray(content));
        });
    } else {
        console.log(chalk.red('No matching cheatsheets found!'));
    }
};

const run = async () => {
    await showWelcome();

    let exit = false;
    while (!exit) {
        const action = await mainMenu();

        switch (action) {
            case gradient.pastel('View all cheatsheets'):
                await viewCheatsheets();
                break;
            case gradient.pastel('Add a new cheatsheet'):
                await addCheatsheet();
                break;
            case gradient.pastel('Remove a cheatsheet'):
                await removeCheatsheet();
                break;
            case gradient.pastel('Search cheatsheets'):
                await searchCheatsheet();
                break;
            case gradient.pastel('Exit'):
                exit = true;
                break;
        }

        if (!exit) {
            await inquirer.prompt({
                name: 'continue',
                type: 'input',
                message: 'Press Enter to return to the main menu.'
            });
        }
    }

    console.log(chalk.green.bold('Goodbye!'));
};

run();
