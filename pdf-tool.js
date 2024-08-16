#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import fs from 'fs/promises';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

const sleep = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));

const mergePDFs = async (files) => {
  const mergedPdf = await PDFDocument.create();
  
  for (const file of files) {
    const pdfBytes = await fs.readFile(file);
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const pdfBytes = await mergedPdf.save();
  const outputPath = 'merged.pdf';
  await fs.writeFile(outputPath, pdfBytes);
  return outputPath;
};

const splitPDF = async (file, pages) => {
  const pdfBytes = await fs.readFile(file);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const totalPages = pdfDoc.getPageCount();

  pages.sort((a, b) => a - b);
  pages.push(totalPages + 1);

  const outputs = [];
  let startPage = 0;

  for (let i = 0; i < pages.length; i++) {
    const endPage = pages[i] - 1;
    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(pdfDoc, Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i));
    copiedPages.forEach((page) => newPdf.addPage(page));

    const outputPath = `split_${startPage + 1}-${endPage + 1}.pdf`;
    const pdfBytes = await newPdf.save();
    await fs.writeFile(outputPath, pdfBytes);
    outputs.push(outputPath);

    startPage = endPage + 1;
  }

  return outputs;
};

const compressPDF = async (file) => {
  const pdfBytes = await fs.readFile(file);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  pdfDoc.setTitle('');
  pdfDoc.setAuthor('');
  pdfDoc.setSubject('');
  pdfDoc.setKeywords([]);
  pdfDoc.setProducer('');
  pdfDoc.setCreator('');

  const compressedBytes = await pdfDoc.save({ 
    useObjectStreams: true,
    addDefaultPage: false,
  });

  const outputPath = 'compressed.pdf';
  await fs.writeFile(outputPath, compressedBytes);
  return outputPath;
};

const welcome = async () => {
  const title = 'PDF Tool CLI';
  figlet(title, (err, data) => {
    console.log(gradient.pastel.multiline(data));
  });

  await sleep();
  console.log(
    chalk.green(
      `Welcome to the ${chalk.bold('PDF Tool CLI')}! Let's manipulate some PDFs!\n`
    )
  );
};

const askForOperation = async () => {
  const answers = await inquirer.prompt({
    name: 'operation',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'Merge PDFs',
      'Split PDF',
      'Compress PDF',
      'Exit',
    ],
  });

  return answers.operation;
};

const askForFiles = async (message) => {
  const answers = await inquirer.prompt({
    name: 'files',
    type: 'input',
    message: message,
    validate: (input) => input.length > 0 || 'Please enter at least one file',
  });

  return answers.files.split(',').map(f => f.trim());
};

const askForPages = async () => {
  const answers = await inquirer.prompt({
    name: 'pages',
    type: 'input',
    message: 'Enter the page numbers to split at (comma-separated):',
    validate: (input) => input.length > 0 || 'Please enter at least one page number',
  });

  return answers.pages.split(',').map(p => parseInt(p.trim()));
};

const handleMergePDFs = async () => {
  const files = await askForFiles('Enter the PDF files to merge (comma-separated):');
  const spinner = createSpinner('Merging PDFs...').start();
  try {
    const result = await mergePDFs(files);
    spinner.success({ text: `PDFs merged successfully! Output: ${result}` });
  } catch (error) {
    spinner.error({ text: `Failed to merge PDFs: ${error.message}` });
  }
};

const handleSplitPDF = async () => {
  const [file] = await askForFiles('Enter the PDF file to split:');
  const pages = await askForPages();
  const spinner = createSpinner('Splitting PDF...').start();
  try {
    const result = await splitPDF(file, pages);
    spinner.success({ text: `PDF split successfully! Outputs: ${result.join(', ')}` });
  } catch (error) {
    spinner.error({ text: `Failed to split PDF: ${error.message}` });
  }
};

const handleCompressPDF = async () => {
  const [file] = await askForFiles('Enter the PDF file to compress:');
  const spinner = createSpinner('Compressing PDF...').start();
  try {
    const result = await compressPDF(file);
    spinner.success({ text: `PDF compressed successfully! Output: ${result}` });
  } catch (error) {
    spinner.error({ text: `Failed to compress PDF: ${error.message}` });
  }
};

const main = async () => {
  await welcome();

  while (true) {
    const operation = await askForOperation();

    switch (operation) {
      case 'Merge PDFs':
        await handleMergePDFs();
        break;
      case 'Split PDF':
        await handleSplitPDF();
        break;
      case 'Compress PDF':
        await handleCompressPDF();
        break;
      case 'Exit':
        console.log(chalk.yellow('Thank you for using PDF Tool CLI. Goodbye!'));
        return;
    }

    console.log('\n');
  }
};

main().catch(console.error);