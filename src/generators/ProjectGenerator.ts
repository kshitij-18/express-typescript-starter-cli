import { fileURLToPath } from 'node:url';
import { type ProjectConfig } from '../prompts/index.js';
import fs from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { injectVariables } from '../commands/injectVariables.js';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import assert from 'node:assert';

export class ProjectGenerator {
  private projectDirectoryPath: string | undefined;
  constructor(private projectConfig: ProjectConfig) {}

  private async generateFolder() {
    // Get the current working directory where the command is being run
    const currentWorkingDir = process.cwd();

    // create a folder with project name in the current working directory
    const projectDirectoryPath = join(currentWorkingDir, this.projectConfig.projectName);
    await fs.mkdir(projectDirectoryPath);
    this.projectDirectoryPath = projectDirectoryPath;
  }

  private get templateFolderPath() {
    // Get the directory where this module is located
    const __fileName = fileURLToPath(import.meta.url);
    const __dirname = dirname(__fileName);

    // Navigate to the templates folder relative to this module
    // This works in both Node.js and Vite environments
    const templateFolderPath = join(__dirname, '..', 'templates');
    return templateFolderPath;
  }

  private async injectValues(path: string) {
    // inject values in package.json.hbs
    return await injectVariables(this.projectConfig, path);
  }

  /**
   *
   * @param filePath : Takes in the path of the file to add to the project directory folder.
   * @param fileData Takes in the data which is associated with the file. it can be a Buffer or.
   */
  private async putFilesInFolder(filePath: string, fileData: Buffer | string) {
    if (!this.projectDirectoryPath) {
      throw new Error('The Project Directory Path could not be set successfully.');
    }

    if (!this.projectConfig.includeDocker && filePath.includes('Dockerfile')) {
      return;
    }

    if (!this.projectConfig.includeEslint && filePath.includes('eslint')) {
      return;
    }

    if (!this.projectConfig.includePrettier && filePath.includes('prettier')) {
      return;
    }

    if (!(this.projectConfig.packageManager === 'yarn') && filePath.includes('.yarnrc')) {
      return;
    }

    await fs.writeFile(filePath, fileData);
  }

  async createGitRepoSitory() {
    const promisifiedExec = promisify(exec);

    if (!this.projectDirectoryPath) {
      throw new Error('Project directory path not found.');
    }

    // Change to the project directory before initializing git
    const { stderr } = await promisifiedExec('git init', {
      cwd: this.projectDirectoryPath,
    });
    if (stderr) {
      throw new Error(`cannot create Git repository here Error: ${stderr}`);
    }
  }

  /**
   * this function takes files from the template folder and loads
   * them into the project folder according to how they are in the templates folder
   */
  async loadFilesAndInjectValues(folderToLoadFilesFrom: string, subFolderPath?: string) {
    // Step 1. Load files from the templates folder
    const contentsOfDirectory = await fs.readdir(folderToLoadFilesFrom);

    for (const content of contentsOfDirectory) {
      const stats = await fs.stat(join(folderToLoadFilesFrom, content));
      if (stats.isDirectory()) {
        // create the directory in the project directory
        // call the function again
        assert(this.projectDirectoryPath, 'project directory path not found.');
        await fs.mkdir(join(this.projectDirectoryPath, content));
        await this.loadFilesAndInjectValues(
          join(folderToLoadFilesFrom, content),
          content
        );
      } else if (stats.isFile()) {
        // remove hbs extension
        const fileExtension = content.split('.').pop();
        let fileName = content;
        let fileContent: string | undefined;
        if (fileExtension && fileExtension === 'hbs') {
          // remove the fileExtension.
          fileContent = await this.injectValues(join(folderToLoadFilesFrom, fileName));
          fileName = fileName.split('.').slice(0, -1).join('.');
        }

        assert(this.projectDirectoryPath, 'Project directory path not found.');
        assert(fileContent, 'file content not found.');
        const targetPath = subFolderPath
          ? join(this.projectDirectoryPath, subFolderPath, fileName)
          : join(this.projectDirectoryPath, fileName);
        await this.putFilesInFolder(targetPath, fileContent);
      }
    }
  }

  async cleanUp() {
    // remove the project folder.
    if (!this.projectDirectoryPath) {
      throw new Error('🔥: error no project directory path set.');
    }
    await fs.rm(this.projectDirectoryPath, { recursive: true, force: true });
  }

  async generate() {
    // create the project name folder
    await this.generateFolder();

    // initialize git if the user wants.
    if (this.projectConfig.initializeGit) {
      try {
        await this.createGitRepoSitory();
      } catch (error) {
        if (error instanceof Error) {
          console.log(
            `🔥: error there was an issue while initializing git. ${error.message}`
          );
        }
      }
    }

    // write a generic logic for loading files from the templates folder. and inject values into each one.
    await this.loadFilesAndInjectValues(this.templateFolderPath);
  }
}
