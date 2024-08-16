#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

function showTitle() {
  console.log(
    gradient.pastel.multiline(
      figlet.textSync('Image Resizer', {
        font: 'Big',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      })
    )
  );
}

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function main() {
  showTitle();


  const rainbow = chalkAnimation.rainbow('Welcome to the Image Resizer CLI!\n');
  await sleep();
  rainbow.stop();


  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'filePath',
      message: 'Enter the path to the image you want to resize:',
      validate(input) {
        if (fs.existsSync(input)) return true;
        return 'File does not exist!';
      },
    },
    {
      type: 'number',
      name: 'width',
      message: 'Enter the new width of the image:',
      validate(input) {
        return input > 0 ? true : 'Width must be a positive number!';
      },
    },
    {
      type: 'number',
      name: 'height',
      message: 'Enter the new height of the image:',
      validate(input) {
        return input > 0 ? true : 'Height must be a positive number!';
      },
    },
    {
      type: 'input',
      name: 'outputPath',
      message: 'Enter the output path for the resized image:',
      default(answers) {
        const ext = path.extname(answers.filePath);
        const baseName = path.basename(answers.filePath, ext);
        return path.join(path.dirname(answers.filePath), `${baseName}-resized${ext}`);
      },
    },
  ]);

  const spinner = createSpinner('Resizing image...').start();

  try {

    await sharp(answers.filePath)
      .resize(answers.width, answers.height)
      .toFile(answers.outputPath);

    spinner.success({ text: `Image resized successfully! Saved to ${answers.outputPath}` });
  } catch (error) {
    spinner.error({ text: `Failed to resize image: ${error.message}` });
  }
}


main();
