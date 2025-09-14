/**
 * Utility functions to fetch the latest versions of package managers
 */

interface NpmPackageInfo {
  'dist-tags': {
    latest: string;
  };
}

interface YarnReleaseInfo {
  tag_name: string;
  name: string;
  published_at: string;
}

/**
 * Fetches the latest version of npm from npm registry
 */
async function fetchNpmVersion(): Promise<string> {
  try {
    const response = await fetch('https://registry.npmjs.org/npm');

    if (!response.ok) {
      throw new Error(`Failed to fetch npm version: ${response.statusText}`);
    }

    const packageInfo: NpmPackageInfo = (await response.json()) as NpmPackageInfo;
    return packageInfo['dist-tags'].latest;
  } catch (error) {
    console.warn('Warning: Could not fetch npm version. Using fallback.');
    return '10.0.0';
  }
}

/**
 * Fetches the latest version of Yarn from GitHub releases
 */
async function fetchYarnVersion(): Promise<string> {
  try {
    const response = await fetch(
      'https://api.github.com/repos/yarnpkg/berry/releases/latest'
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch Yarn version: ${response.statusText}`);
    }

    const releaseInfo: YarnReleaseInfo = (await response.json()) as YarnReleaseInfo;
    // Remove 'v' prefix from tag_name (e.g., "v4.9.4" -> "4.9.4")
    return releaseInfo.name.replace(/^v/, '');
  } catch (error) {
    console.warn('Warning: Could not fetch Yarn version. Using fallback.');
    return '4.9.4';
  }
}

/**
 * Fetches the latest version of pnpm from npm registry
 */
async function fetchPnpmVersion(): Promise<string> {
  try {
    const response = await fetch('https://registry.npmjs.org/pnpm');

    if (!response.ok) {
      throw new Error(`Failed to fetch pnpm version: ${response.statusText}`);
    }

    const packageInfo: NpmPackageInfo = (await response.json()) as NpmPackageInfo;
    return packageInfo['dist-tags'].latest;
  } catch (error) {
    console.warn('Warning: Could not fetch pnpm version. Using fallback.');
    return '8.0.0';
  }
}

/**
 * Fetches the latest version for a specific package manager
 */
export async function getLatestVersionForPackageManager(
  packageManager: string
): Promise<string> {
  switch (packageManager.toLowerCase()) {
    case 'npm':
      return await fetchNpmVersion();
    case 'yarn':
      return await fetchYarnVersion();
    case 'pnpm':
      return await fetchPnpmVersion();
    default:
      console.warn(`Unknown package manager: ${packageManager}. Using fallback.`);
      return 'latest';
  }
}

/**
 * Fetches the latest versions for all supported package managers
 */
export async function fetchPackageManagerVersions(): Promise<Record<string, string>> {
  const [npmVersion, yarnVersion, pnpmVersion] = await Promise.all([
    fetchNpmVersion(),
    fetchYarnVersion(),
    fetchPnpmVersion(),
  ]);

  return {
    npm: npmVersion,
    yarn: yarnVersion,
    pnpm: pnpmVersion,
  };
}
