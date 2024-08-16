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

async function getNotes() {
  try {
    const data = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveNotes(notes) {
  await fs.writeFile(dataFile, JSON.stringify(notes, null, 2));
}

async function addNote() {
  const { title, content } = await inquirer.prompt([
    { name: 'title', message: 'Enter note title:' },
    { name: 'content', message: 'Enter note content:' },
  ]);

  const spinner = createSpinner('Adding note...').start();
  await sleep(1000);

  const notes = await getNotes();
  notes.push({ title, content, createdAt: new Date().toISOString() });
  await saveNotes(notes);

  spinner.success({ text: 'Note added successfully!' });
}

async function viewNotes() {
  const notes = await getNotes();

  if (notes.length === 0) {
    console.log(chalk.yellow('No notes found.'));
    return;
  }

  const { noteIndex } = await inquirer.prompt([
    {
      type: 'list',
      name: 'noteIndex',
      message: 'Select a note to view:',
      choices: notes.map((note, index) => ({
        name: `${index + 1}. ${note.title}`,
        value: index,
      })),
    },
  ]);

  const selectedNote = notes[noteIndex];
  console.log(chalk.blue('\nTitle:'), selectedNote.title);
  console.log(chalk.blue('Content:'), selectedNote.content);
  console.log(chalk.blue('Created at:'), selectedNote.createdAt);
}

async function deleteNote() {
  const notes = await getNotes();

  if (notes.length === 0) {
    console.log(chalk.yellow('No notes to delete.'));
    return;
  }

  const { noteIndex } = await inquirer.prompt([
    {
      type: 'list',
      name: 'noteIndex',
      message: 'Select a note to delete:',
      choices: notes.map((note, index) => ({
        name: `${index + 1}. ${note.title}`,
        value: index,
      })),
    },
  ]);

  const spinner = createSpinner('Deleting note...').start();
  await sleep(1000);

  notes.splice(noteIndex, 1);
  await saveNotes(notes);

  spinner.success({ text: 'Note deleted successfully!' });
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