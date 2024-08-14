import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import { diffLines, diffWords, diffChars } from 'diff';

const sleep = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));

async function welcome() {
  const title = 'Text File Diff Tool';
  figlet(title, (err, data) => {
    console.log(gradient.pastel.multiline(data));
  });

  await sleep();
  console.log(`
    ${chalk.bgBlue(' HOW TO USE ')}
    Compare two text files and see the differences.
    Choose your preferred diff algorithm and get colorful output!
  `);
}

async function getFilePaths() {
  const questions = [
    {
      name: 'file1',
      type: 'input',
      message: 'Enter the path to the first file:',
      validate: (value) => fs.existsSync(value) || 'Please enter a valid file path',
    },
    {
      name: 'file2',
      type: 'input',
      message: 'Enter the path to the second file:',
      validate: (value) => fs.existsSync(value) || 'Please enter a valid file path',
    },
  ];

  return inquirer.prompt(questions);
}

async function chooseDiffAlgorithm() {
  const question = {
    name: 'algorithm',
    type: 'list',
    message: 'Choose a diff algorithm:',
    choices: ['Line by Line', 'Word by Word', 'Character by Character'],
  };

  return inquirer.prompt(question);
}

function performDiff(file1Content, file2Content, algorithm) {
  switch (algorithm) {
    case 'Line by Line':
      return diffLines(file1Content, file2Content);
    case 'Word by Word':
      return diffWords(file1Content, file2Content);
    case 'Character by Character':
      return diffChars(file1Content, file2Content);
    default:
      throw new Error('Invalid algorithm choice');
  }
}

function displayDiff(diff) {
  diff.forEach((part) => {
    if (part.added) {
      process.stdout.write(chalk.green(part.value));
    } else if (part.removed) {
      process.stdout.write(chalk.red(part.value));
    } else {
      process.stdout.write(chalk.gray(part.value));
    }
  });
  console.log('\n');
}

async function run() {
  await welcome();

  const { file1, file2 } = await getFilePaths();
  const { algorithm } = await chooseDiffAlgorithm();

  const spinner = createSpinner('Comparing files...').start();
  await sleep(1000);

  try {
    const file1Content = fs.readFileSync(file1, 'utf8');
    const file2Content = fs.readFileSync(file2, 'utf8');

    const diff = performDiff(file1Content, file2Content, algorithm);

    spinner.success({ text: 'Comparison complete!' });
    await sleep(1000);

    console.log(chalk.yellow('\nDifferences:'));
    displayDiff(diff);

    const rainbow = chalkAnimation.rainbow('Diff analysis complete!');
    await sleep(2000);
    rainbow.stop();

  } catch (error) {
    spinner.error({ text: `Error: ${error.message}` });
    process.exit(1);
  }
}

run();
