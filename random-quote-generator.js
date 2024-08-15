import chalk from 'chalk';
import fs from 'fs';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import fetch from 'node-fetch';

async function displayQuote(quote) {
  console.log('\n');
  console.log(chalk.cyan('Here\'s your quote:'));
  
  const rainbowQuote = chalkAnimation.rainbow(quote.text);
  await sleep(2000);
  rainbowQuote.stop();

  console.log(chalk.yellow(`\n- ${quote.author}`));
  console.log('\n');
}

async function askToSave(quote) {
  const answer = await inquirer.prompt({
    name: 'save',
    type: 'confirm',
    message: 'Do you want to save this quote?',
    default: false,
  });

  if (answer.save) {
    const spinner = createSpinner('Saving quote...').start();
    await sleep(1500);
    const quoteText = `${quote.text} - ${quote.author}\n`;
    fs.appendFileSync('quotes.txt', quoteText);
    spinner.success({ text: 'Quote saved successfully!' });
    console.log(chalk.green(`Quote by ${quote.author} has been saved.`));
  }
}
async function main() {
  await welcome();

  let continueFetching = true;
  while (continueFetching) {
    const spinner = createSpinner('Fetching a random quote...').start();
    try {
      const quote = await getRandomQuote();
      await sleep(1000);
      spinner.success({ text: 'Got it!' });

      await displayQuote(quote);

      await askToSave(quote);
      continueFetching = await askToContinue();
    } catch (error) {
      spinner.error({ text: 'Failed to fetch quote. Please check your internet connection.' });
      console.error(chalk.red('Error details:'), error);
      continueFetching = await askToContinue();
    }
  }

  console.log(gradient.cristal('Thank you for using the Random Quote Generator!'));
}

main().catch(console.error);
