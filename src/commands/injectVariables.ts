import * as path from 'node:path';
import { type ProjectConfig } from '../prompts/index.js';
import * as fs from 'node:fs/promises';
import HandleBars from 'handlebars';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

export const injectVariables = async (projectConfig: ProjectConfig, fileName: string) => {
  // Get the directory where this file is located (package installation directory)
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const packageJsonTemplateFilePath = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'src',
    'templates',
    fileName
  );

  const packageJsonTemplateContents = await fs.readFile(
    packageJsonTemplateFilePath,
    'utf-8'
  );
  HandleBars.registerHelper('eq', function (a, b) {
    return a === b;
  });
  const compiler = HandleBars.compile(packageJsonTemplateContents);
  const basicResult = compiler(projectConfig);
  return basicResult;
};
