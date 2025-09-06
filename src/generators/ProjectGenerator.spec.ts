import { beforeAll, describe, vi, it, expect, afterEach } from 'vitest';
import { readdir } from 'node:fs/promises';
import { ProjectGenerator } from './ProjectGenerator';
import type { ProjectConfig } from '../prompts';
import { join } from 'node:path';

describe('Project Generator Test Suite', () => {
  const mockProjectDir = 'Test';
  beforeAll(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
  });
  describe('Project Generator -> all options selected as yes', () => {
    let projectGenerator: ProjectGenerator;
    const projectConfig: ProjectConfig = {
      authorName: 'Kshitij',
      dbChoice: 'mysql',
      includeDocker: true,
      includeEslint: true,
      includePrettier: true,
      includeTesting: true,
      initializeGit: true,
      packageManager: 'npm',
      projectDescription: 'Dummy Description',
      projectName: 'Test',
    };
    beforeAll(() => {
      projectGenerator = new ProjectGenerator(projectConfig);
    });

    afterEach(async () => {
      try {
        await projectGenerator.cleanUp();
      } catch (error) {
        // Ignore cleanup errors - the directory might not exist
        console.warn('Cleanup warning:', error);
      }
    });

    it('should have Docker file inside the Project folder', async () => {
      await projectGenerator.generate();
      // Project named folder should be created in the root of the project.
      const workingDirectoryContents = await readdir(process.cwd());
      expect(workingDirectoryContents).toContain(mockProjectDir);
      const absoluteProjectDirctoryPath = join(process.cwd(), mockProjectDir);
      const projectDirectoryContents = await readdir(absoluteProjectDirctoryPath);
      expect(projectDirectoryContents).toContain('Dockerfile');
    });

    it('should have eslint config file', async () => {
      await projectGenerator.generate();
      // Project named folder should be created in the root of the project.
      const workingDirectoryContents = await readdir(process.cwd());
      expect(workingDirectoryContents).toContain(mockProjectDir);
      const absoluteProjectDirctoryPath = join(process.cwd(), mockProjectDir);
      const projectDirectoryContents = await readdir(absoluteProjectDirctoryPath);
      expect(projectDirectoryContents).toContain('eslint.config.mts');
    });

    it('should have initialized a git repository', async () => {
      await projectGenerator.generate();
      // Project named folder should be created in the root of the project.
      const workingDirectoryContents = await readdir(process.cwd());
      expect(workingDirectoryContents).toContain(mockProjectDir);
      const absoluteProjectDirctoryPath = join(process.cwd(), mockProjectDir);
      const projectDirectoryContents = await readdir(absoluteProjectDirctoryPath);
      expect(projectDirectoryContents).toContain('.git');
    });

    it('should have prettier configuration', async () => {
      await projectGenerator.generate();
      // Project named folder should be created in the root of the project.
      const workingDirectoryContents = await readdir(process.cwd());
      expect(workingDirectoryContents).toContain(mockProjectDir);
      const absoluteProjectDirctoryPath = join(process.cwd(), mockProjectDir);
      const projectDirectoryContents = await readdir(absoluteProjectDirctoryPath);
      expect(projectDirectoryContents).toContain('.prettierrc');
    });

    it('should have tsconfig', async () => {
      await projectGenerator.generate();
      // Project named folder should be created in the root of the project.
      const workingDirectoryContents = await readdir(process.cwd());
      expect(workingDirectoryContents).toContain(mockProjectDir);
      const absoluteProjectDirctoryPath = join(process.cwd(), mockProjectDir);
      const projectDirectoryContents = await readdir(absoluteProjectDirctoryPath);
      expect(projectDirectoryContents).toContain('tsconfig.json');
    });
  });
});
