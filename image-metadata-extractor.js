#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import exifr from 'exifr';

const sleep = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));

async function welcome() {
  const title = 'Image Metadata Extractor';
  figlet(title, (err, data) => {
    console.log(gradient.pastel.multiline(data));
  });

  await sleep();
  console.log(`
    ${chalk.bgBlue('HOW TO USE')}
    I will extract metadata from your images.
    Input the path to an image or a directory containing images.
    Then select the metadata you want to extract.
  `);
}

async function askImagePath() {
  const answers = await inquirer.prompt({
    name: 'image_path',
    type: 'input',
    message: 'Enter the path to an image or directory:',
    default() {
      return '.';
    },
  });

  return answers.image_path;
}

async function askMetadataOptions() {
  const answers = await inquirer.prompt({
    name: 'metadata_options',
    type: 'checkbox',
    message: 'Select the metadata you want to extract:',
    choices: [
      { name: 'Date Taken', value: 'DateTimeOriginal' },
      { name: 'Camera Model', value: 'Model' },
      { name: 'Lens', value: 'LensModel' },
      { name: 'GPS Location', value: 'GPSLatitude' },
      { name: 'Aperture', value: 'FNumber' },
      { name: 'Shutter Speed', value: 'ExposureTime' },
      { name: 'ISO', value: 'ISO' },
    ],
  });

  return answers.metadata_options;
}

async function extractMetadata(imagePath, options) {
  const spinner = createSpinner('Extracting metadata...').start();
  try {
    const metadata = await exifr.parse(imagePath, options);
    spinner.success({ text: 'Metadata extracted successfully!' });
    return metadata;
  } catch (error) {
    spinner.error({ text: `Failed to extract metadata: ${error.message}` });
    return null;
  }
}

function displayMetadata(metadata) {
  console.log('\n' + chalk.bgYellow.black(' Extracted Metadata '));
  for (const [key, value] of Object.entries(metadata)) {
    console.log(`${chalk.blue(key)}: ${chalk.green(value)}`);
  }
}

async function processImages(imagePath, options) {
  const stats = await fs.stat(imagePath);
  
  if (stats.isFile()) {
    const metadata = await extractMetadata(imagePath, options);
    if (metadata) {
      console.log(chalk.cyan(`\nMetadata for ${path.basename(imagePath)}:`));
      displayMetadata(metadata);
    }
  } else if (stats.isDirectory()) {
    const files = await fs.readdir(imagePath);
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
    
    for (const file of imageFiles) {
      const fullPath = path.join(imagePath, file);
      const metadata = await extractMetadata(fullPath, options);
      if (metadata) {
        console.log(chalk.cyan(`\nMetadata for ${file}:`));
        displayMetadata(metadata);
      }
    }
  }
}

async function main() {
  await welcome();
  
  const imagePath = await askImagePath();
  const metadataOptions = await askMetadataOptions();
  
  await processImages(imagePath, metadataOptions);
  
  console.log(gradient.rainbow('\nThank you for using Image Metadata Extractor!'));
}

main().catch((error) => {
  console.error(chalk.red('An error occurred:'), error);
});