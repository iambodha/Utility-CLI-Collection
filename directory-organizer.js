#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import fs from 'fs';
import path from 'path';

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
    const rainbowTitle = chalkAnimation.rainbow(
        'Welcome to Directory Organizer CLI \n'
    );

    await sleep();
    rainbowTitle.stop();

    console.log(`
    ${chalk.bgBlue('HOW TO USE')}
    Organize your files in your directory effortlessly.
    `);
}

async function organizeFiles(method) {
    const spinner = createSpinner('Organizing files...').start();
    await sleep();

    const currentDir = process.cwd();
    const files = fs.readdirSync(currentDir);

    files.forEach(file => {
        const filePath = path.join(currentDir, file);
        if (fs.lstatSync(filePath).isFile()) {
            let folderName = '';
            if (method === 'extension') {
                folderName = path.extname(file).substring(1);
            } else if (method === 'type') {
                folderName = getFileType(file);
            }

            if (folderName) {
                const destinationDir = path.join(currentDir, folderName);
                if (!fs.existsSync(destinationDir)) {
                    fs.mkdirSync(destinationDir);
                }

                fs.renameSync(filePath, path.join(destinationDir, file));
            }
        }
    });

    spinner.success({ text: 'Files have been organized successfully!' });
}
