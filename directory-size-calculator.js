import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';

const sleep = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));

async function welcome() {
  const titleText = 'Directory Size Calculator';
  
  figlet(titleText, (err, data) => {
    console.log(gradient.pastel.multiline(data));
  });

  await sleep();
  console.log(`
    ${chalk.bgBlue('HOW TO USE')}
    I will calculate the size of a directory for you.
    Just input the path, and I'll do the rest.
    
    ${chalk.bgRed('NOTE:')} Make sure you have the necessary permissions!
  `);
}

async function calculateAndDisplaySize(directoryPath) {
  const spinner = createSpinner('Calculating directory size...').start();
  await sleep(1500);

  try {
    const size = getDirectorySize(directoryPath);
    spinner.success({ text: 'Calculation complete!' });

    console.log('\n');
    const rainbow = chalkAnimation.rainbow(`Total Size: ${formatSize(size)}`);
    await sleep(2000);
    rainbow.stop();

    console.log(`\n${chalk.green('Directory breakdown:')}`);
    displayDirectoryContents(directoryPath, 0);
  } catch (error) {
    spinner.error({ text: `Error: ${error.message}` });
  }
}

function displayDirectoryContents(directoryPath, depth = 0) {
  const items = fs.readdirSync(directoryPath);

  items.forEach(item => {
    const itemPath = path.join(directoryPath, item);
    const stats = fs.statSync(itemPath);
    const indent = '  '.repeat(depth);
    const itemSize = formatSize(stats.size);

    if (stats.isDirectory()) {
      console.log(`${indent}${chalk.blue(item)} (${chalk.yellow(itemSize)})`);
      displayDirectoryContents(itemPath, depth + 1);
    } else {
      console.log(`${indent}${chalk.cyan(item)} (${chalk.yellow(itemSize)})`);
    }
  });
}