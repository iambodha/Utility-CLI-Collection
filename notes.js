#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import fs from 'fs/promises';
import path from 'path';

const sleep = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));
const dataFile = path.join(process.cwd(), 'notes.json');

async function welcome() {
  const title = 'Notes CLI';
  figlet(title, (err, data) => {
    console.log(gradient.pastel.multiline(data));
  });

  await sleep();
  console.log(
    chalk.green(
      `Welcome to the Notes CLI! 
      This tool allows you to manage your notes effortlessly.`
    )
  );
}

async function main() {
  await welcome();

  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: ['Add a note', 'View notes', 'Delete a note', 'Exit'],
      },
    ]);

    switch (action) {
      case 'Add a note':
        await addNote();
        break;
      case 'View notes':
        await viewNotes();
        break;
      case 'Delete a note':
        await deleteNote();
        break;
      case 'Exit':
        console.log(chalk.green('Thank you for using Notes CLI. Goodbye!'));
        process.exit(0);
    }

    await sleep(1000);
  }
}

main().catch((error) => {
  console.error(chalk.red('An error occurred:'), error);
  process.exit(1);
});