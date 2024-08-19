import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import fs from 'fs/promises';
import path from 'path';

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
const DATA_FILE = path.join(process.cwd(), 'calendar_events.json');

async function loadEvents() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {};
    }
    throw error;
  }
}

async function saveEvents(events) {
  await fs.writeFile(DATA_FILE, JSON.stringify(events, null, 2));
}

async function welcome() {
  const title = 'Calendar CLI';
  figlet(title, (err, data) => {
    console.log(gradient.pastel.multiline(data));
  });

  await sleep();
  console.log(
    chalk.green(
      `Welcome to the Calendar CLI!
      Let's manage your schedule efficiently.`
    )
  );
}

async function askDate() {
  const answers = await inquirer.prompt({
    name: 'date',
    type: 'input',
    message: 'Enter a date (YYYY-MM-DD):',
    default() {
      return new Date().toISOString().split('T')[0];
    },
  });

  return answers.date;
}

async function askEvent() {
  const answers = await inquirer.prompt([
    {
      name: 'title',
      type: 'input',
      message: 'Enter event title:',
    },
    {
      name: 'description',
      type: 'input',
      message: 'Enter event description:',
    },
    {
      name: 'time',
      type: 'input',
      message: 'Enter event time (HH:MM):',
    },
  ]);

  return answers;
}

async function addEvent(date, event) {
  const spinner = createSpinner('Adding event...').start();
  await sleep(1000);

  try {
    const events = await loadEvents();
    if (!events[date]) {
      events[date] = [];
    }
    events[date].push(event);
    await saveEvents(events);

    spinner.success({ text: 'Event added successfully!' });
    console.log(
      chalk.yellow(`Event: ${event.title}
      Date: ${date}
      Time: ${event.time}
      Description: ${event.description}`)
    );
  } catch (error) {
    spinner.error({ text: 'Failed to add event.' });
    console.error(chalk.red('Error:', error.message));
  }
}

async function viewEvents(date) {
  const spinner = createSpinner('Fetching events...').start();
  await sleep(1000);

  try {
    const events = await loadEvents();
    const dateEvents = events[date] || [];

    spinner.success({ text: 'Events fetched successfully!' });
    console.log(chalk.cyan(`Events for ${date}:`));

    if (dateEvents.length === 0) {
      console.log(chalk.yellow('No events scheduled for this date.'));
    } else {
      dateEvents.forEach((event, index) => {
        console.log(
          chalk.yellow(`${index + 1}. ${event.title}
          Time: ${event.time}
          Description: ${event.description}`)
        );
      });
    }
  } catch (error) {
    spinner.error({ text: 'Failed to fetch events.' });
    console.error(chalk.red('Error:', error.message));
  }
}

async function main() {
  await welcome();

  while (true) {
    const action = await inquirer.prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: ['Add Event', 'View Events', 'Exit'],
    });

    if (action.action === 'Exit') {
      console.log(chalk.green('Thank you for using Calendar CLI!'));
      break;
    }

    const date = await askDate();

    if (action.action === 'Add Event') {
      const event = await askEvent();
      await addEvent(date, event);
    } else if (action.action === 'View Events') {
      await viewEvents(date);
    }

    await sleep(1000);
  }
}

main().catch((error) => {
  console.error(chalk.red('An error occurred:', error));
});