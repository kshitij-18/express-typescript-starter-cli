#!/usr/bin/env node

import chalk from 'chalk';
import { Command } from 'commander';
import { injectvariables } from '../src/commands/injectVariables.js';
import { askQuestionsAndGetConfig } from '../src/prompts/inquirerPrompt.js';

const program = new Command();

program
  .name('express-typescript-starter')

  .description('CLI tool to create boilerplate express and typescript')

  .version('1.0.0', '-v, --version', 'Output the current version');

program
  .command('create')
  .description('Create a new Express TypeScript project')
  .action(async () => {
    console.log(
      chalk.blueBright(`🚀 Welcome to the express typescript boilerplate creator`)
    );
    const projectConfig = await askQuestionsAndGetConfig();

    if (!projectConfig) {
      console.log(
        '🔥: error there seems to be some issue with the CLI tool will be back soon'
      );
      return;
    }
    await injectvariables(projectConfig);
    console.log(chalk.bgMagentaBright('✅ Successfully created your project'));
  });

program.parse();
