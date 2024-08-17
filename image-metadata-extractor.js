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
}