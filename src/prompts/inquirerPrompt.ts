import { input, select, confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import { PROJECT_NAME_FORMAT } from '../utils/index.js';

export type DbChoice = 'mongodb' | 'mysql' | 'postgresql' | 'none';

export interface ProjectConfig {
  projectName: string;
  projectDescription: string;
  authorName: string;
  dbChoice: DbChoice;
  packageManager: string;
  includeTesting: boolean;
  includeDocker: boolean;
  includeEslint: boolean;
  includePrettier: boolean;
  initializeGit: boolean;
}

export const askQuestionsAndGetConfig = async (): Promise<ProjectConfig | void> => {
  try {
    const projectName = await input({
      message: 'what is the name of your project',
      default: 'Project-Name',
      validate: (val) => {
        // validate no extra spaces in between names
        return PROJECT_NAME_FORMAT.test(val);
      },
    });

    const projectDescription = await input({
      message: 'what is the description of your project',
      default: 'A new project',
    });

    const authorName = await input({
      message: 'what is your name',
      default: 'Your Name',
    });

    const dbChoice = await select<DbChoice>({
      message: 'Which db do you want to use?',
      default: 'none',
      choices: [
        {
          name: 'MongoDB',
          value: 'mongodb',
        },
        {
          name: 'MySQL',
          value: 'mysql',
        },
        {
          name: 'PostgreSQL',
          value: 'postgresql',
        },
      ],
    });

    const packageManager = await select({
      message: 'Which package manager do you prefer?',
      choices: [
        {
          name: 'npm',
          value: 'npm',
        },
        {
          name: 'yarn',
          value: 'yarn',
        },
        {
          name: 'pnpm',
          value: 'pnpm',
        },
      ],
    });

    const includeTesting = await confirm({
      message: 'Do you want to include testing?',
      default: true,
    });

    const includeDocker = await confirm({
      message: 'Do you want to have Docker configured.',
      default: true,
    });

    const includeEslint = await confirm({
      message: 'Do you want to include eslint?',
      default: true,
    });

    const includePrettier = await confirm({
      message: 'Do you want to include prettier?',
      default: true,
    });

    const initializeGit = await confirm({
      message: 'Do you want to initialize git?',
      default: true,
    });

    return {
      projectName,
      projectDescription,
      authorName,
      dbChoice,
      packageManager,
      includeTesting,
      includeDocker,
      includeEslint,
      includePrettier,
      initializeGit,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'ExitPromptError') {
      console.log(chalk.whiteBright(`👋 until next time.`));
    } else {
      throw error;
    }
  }
};
