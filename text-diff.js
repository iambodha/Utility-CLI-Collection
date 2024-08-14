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
