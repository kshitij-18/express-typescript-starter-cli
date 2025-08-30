import { fileURLToPath } from 'node:url';
import { type ProjectConfig } from '../prompts/index.js';
import fs from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { injectVariables } from '../commands/injectVariables.js';

export class ProjectGenerator {
  private projectDirectoryPath: string | undefined;
  constructor(private projectConfig: ProjectConfig) {}

  private async generateFolder() {
    const __fileName = fileURLToPath(import.meta.url);
    const __dirname = dirname(__fileName);

    // create a folder with project name
    const projectDirectoryPath = join(
      __dirname,
      '..',
      '..',
      '..',
      this.projectConfig.projectName
    );
    await fs.mkdir(projectDirectoryPath);
    this.projectDirectoryPath = projectDirectoryPath;
  }

  private async injectValues() {
    // inject values in package.json.hbs
    return await injectVariables(this.projectConfig, 'package.json.hbs');
  }

  /**
   *
   * @param fileName : Takes in the name of the file to add to the project directory folder or subfolder.
   * @param fileData Takes in the data which is associated with the file. it can be a Buffer or
   * @param subFolderName : Takes the name of subFolder in which the file will go in.
   */
  private async putFilesInFolder(
    fileName: string,
    fileData: Buffer | string,
    subFolderName?: string
  ) {
    if (!this.projectDirectoryPath) {
      throw new Error('The Project Directory Path could not be set successfully.');
    }
    let path: string;
    if (subFolderName) {
      path = join(this.projectDirectoryPath, subFolderName);
    } else {
      path = this.projectDirectoryPath;
    }
    // check if path exists
    try {
      await fs.stat(path);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        await fs.mkdir(path);
      } else {
        throw error;
      }
    }

    await fs.writeFile(join(path, fileName), fileData);
  }

  async generate() {
    // create the project name folder
    await this.generateFolder();

    // inject values in the template files.
    const packageJsonContents = await this.injectValues();

    // put the injected files in to the new project folder.
    await this.putFilesInFolder('package.json', packageJsonContents);
  }
}
