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
