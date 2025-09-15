import { GitHubService } from '../githubService';

// Mock fetch globally
global.fetch = jest.fn();

describe('GitHubService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('parseRepositoryUrl', () => {
    test('parses standard GitHub URL', () => {
      const result = GitHubService.parseRepositoryUrl('https://github.com/owner/repo');
      expect(result).toEqual({ owner: 'owner', repo: 'repo' });
    });

    test('parses GitHub URL with .git suffix', () => {
      const result = GitHubService.parseRepositoryUrl('https://github.com/owner/repo.git');
      expect(result).toEqual({ owner: 'owner', repo: 'repo' });
    });

    test('parses GitHub URL with path segments', () => {
      const result = GitHubService.parseRepositoryUrl('https://github.com/owner/repo/tree/main');
      expect(result).toEqual({ owner: 'owner', repo: 'repo' });
    });

    test('parses direct owner/repo format', () => {
      const result = GitHubService.parseRepositoryUrl('owner/repo');
      expect(result).toEqual({ owner: 'owner', repo: 'repo' });
    });

    test('returns null for invalid URL', () => {
      expect(GitHubService.parseRepositoryUrl('invalid-url')).toBeNull();
      expect(GitHubService.parseRepositoryUrl('https://gitlab.com/owner/repo')).toBeNull();
      expect(GitHubService.parseRepositoryUrl('')).toBeNull();
    });

    test('handles special characters in owner/repo names', () => {
      const result = GitHubService.parseRepositoryUrl('https://github.com/my-org/my-repo_v2');
      expect(result).toEqual({ owner: 'my-org', repo: 'my-repo_v2' });
    });
  });

  describe('fetchRepository', () => {
    const mockRepoData = {
      name: 'test-repo',
      description: 'A test repository',
      language: 'JavaScript',
      topics: ['react', 'typescript'],
      html_url: 'https://github.com/owner/test-repo',
      clone_url: 'https://github.com/owner/test-repo.git',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-03-01T00:00:00Z',
      homepage: 'https://owner.github.io/test-repo',
      stargazers_count: 42,
      forks_count: 8,
      size: 1024,
      default_branch: 'main'
    };

    test('fetches repository data successfully', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockRepoData)
      });

      const result = await GitHubService.fetchRepository('owner', 'test-repo');
      
      expect(fetch).toHaveBeenCalledWith('https://api.github.com/repos/owner/test-repo', {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      expect(result).toEqual(mockRepoData);
    });

    test('handles 404 error gracefully', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'Not Found' })
      });

      await expect(GitHubService.fetchRepository('owner', 'nonexistent'))
        .rejects.toThrow('Not Found');
    });

    test('handles network errors', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(GitHubService.fetchRepository('owner', 'repo'))
        .rejects.toThrow('Network error');
    });

    test('handles API rate limit errors', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 403,
        json: () => Promise.resolve({ 
          message: 'API rate limit exceeded',
          documentation_url: 'https://docs.github.com/rest'
        })
      });

      await expect(GitHubService.fetchRepository('owner', 'repo'))
        .rejects.toThrow('API rate limit exceeded');
    });
  });

  describe('fetchReadme', () => {
    test('fetches and decodes README content', async () => {
      const readmeContent = btoa('# Test Repository\nThis is a test readme.');
      
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ content: readmeContent })
      });

      const result = await GitHubService.fetchReadme('owner', 'repo');
      
      expect(result).toBe('# Test Repository\nThis is a test readme.');
      expect(fetch).toHaveBeenCalledWith('https://api.github.com/repos/owner/repo/readme', {
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      });
    });

    test('returns null when README not found', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404
      });

      const result = await GitHubService.fetchReadme('owner', 'repo');
      expect(result).toBeNull();
    });

    test('handles fetch errors gracefully', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

      const result = await GitHubService.fetchReadme('owner', 'repo');
      expect(result).toBeNull();
    });
  });

  describe('fetchPackageJson', () => {
    test('fetches and parses package.json', async () => {
      const packageJsonContent = btoa(JSON.stringify({
        name: 'test-package',
        version: '1.0.0',
        dependencies: {
          'react': '^18.0.0',
          'typescript': '^4.9.0'
        },
        devDependencies: {
          'jest': '^29.0.0'
        }
      }));

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ content: packageJsonContent })
      });

      const result = await GitHubService.fetchPackageJson('owner', 'repo');
      
      expect(result).toEqual({
        name: 'test-package',
        version: '1.0.0',
        dependencies: {
          'react': '^18.0.0',
          'typescript': '^4.9.0'
        },
        devDependencies: {
          'jest': '^29.0.0'
        }
      });
    });

    test('returns null when package.json not found', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404
      });

      const result = await GitHubService.fetchPackageJson('owner', 'repo');
      expect(result).toBeNull();
    });

    test('handles invalid JSON gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      const invalidJsonContent = btoa('{ invalid json }');

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ content: invalidJsonContent })
      });

      const result = await GitHubService.fetchPackageJson('owner', 'repo');
      expect(result).toBeNull();
      
      consoleError.mockRestore();
    });
  });

  describe('extractTechnologies', () => {
    const mockRepo = {
      name: 'test-repo',
      description: 'Test repository',
      language: 'JavaScript',
      topics: ['react', 'typescript', 'web-development'],
      html_url: 'https://github.com/owner/repo',
      clone_url: 'https://github.com/owner/repo.git',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-03-01T00:00:00Z',
      stargazers_count: 0,
      forks_count: 0,
      size: 0,
      default_branch: 'main'
    };

    test('extracts technologies from language and topics', () => {
      const result = GitHubService.extractTechnologies(mockRepo);
      
      expect(result).toContain('JavaScript');
      expect(result).toContain('react');
      expect(result).toContain('typescript');
      expect(result).toContain('web-development');
    });

    test('extracts technologies from package.json dependencies', () => {
      const packageJson = {
        dependencies: {
          'react': '^18.0.0',
          'next': '^13.0.0',
          'tailwindcss': '^3.0.0'
        },
        devDependencies: {
          'typescript': '^4.9.0',
          '@types/react': '^18.0.0',
          'jest': '^29.0.0'
        }
      };

      const result = GitHubService.extractTechnologies(mockRepo, packageJson);
      
      expect(result).toContain('React');
      expect(result).toContain('Next.js');
      expect(result).toContain('Tailwind CSS');
      expect(result).toContain('TypeScript');
      expect(result).toContain('Jest');
      expect(result).not.toContain('@types/react'); // Should be filtered out
    });

    test('handles repository without language or topics', () => {
      const repoWithoutLanguage = { ...mockRepo, language: '', topics: [] };
      const result = GitHubService.extractTechnologies(repoWithoutLanguage);
      
      expect(result).toEqual([]);
    });

    test('deduplicates technologies', () => {
      const packageJson = {
        dependencies: { 'react': '^18.0.0' },
        devDependencies: { 'react': '^18.0.0' }
      };

      const repoWithReactTopic = { ...mockRepo, topics: ['react'] };
      const result = GitHubService.extractTechnologies(repoWithReactTopic, packageJson);
      
      // Should only contain 'react' once despite being in topics, dependencies, and devDependencies
      const reactCount = result.filter(tech => tech.toLowerCase() === 'react').length;
      expect(reactCount).toBe(1);
    });
  });

  describe('determineCategory', () => {
    const baseRepo = {
      name: 'test-repo',
      description: '',
      language: 'JavaScript',
      topics: [],
      html_url: 'https://github.com/owner/repo',
      clone_url: 'https://github.com/owner/repo.git',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-03-01T00:00:00Z',
      stargazers_count: 0,
      forks_count: 0,
      size: 0,
      default_branch: 'main'
    };

    test('detects mobile development', () => {
      const mobileRepo = { ...baseRepo, topics: ['react-native', 'mobile'] };
      expect(GitHubService.determineCategory(mobileRepo)).toBe('mobile-development');

      const flutterRepo = { ...baseRepo, topics: ['flutter'] };
      expect(GitHubService.determineCategory(flutterRepo)).toBe('mobile-development');
    });

    test('detects desktop applications', () => {
      const electronRepo = { ...baseRepo, topics: ['electron', 'desktop'] };
      expect(GitHubService.determineCategory(electronRepo)).toBe('desktop-application');

      const cppRepo = { ...baseRepo, language: 'C++' };
      expect(GitHubService.determineCategory(cppRepo)).toBe('desktop-application');
    });

    test('detects data science projects', () => {
      const mlRepo = { ...baseRepo, topics: ['machine-learning', 'data-science'] };
      expect(GitHubService.determineCategory(mlRepo)).toBe('data-science');

      const pythonRepo = { ...baseRepo, language: 'Python' };
      expect(GitHubService.determineCategory(pythonRepo)).toBe('data-science');
    });

    test('detects game development', () => {
      const gameRepo = { ...baseRepo, topics: ['game', 'unity'] };
      expect(GitHubService.determineCategory(gameRepo)).toBe('game-development');
    });

    test('detects DevOps projects', () => {
      const devopsRepo = { ...baseRepo, topics: ['devops', 'docker', 'kubernetes'] };
      expect(GitHubService.determineCategory(devopsRepo)).toBe('devops');
    });

    test('defaults to web development', () => {
      const webRepo = { ...baseRepo };
      expect(GitHubService.determineCategory(webRepo)).toBe('web-development');

      const reactRepo = { ...baseRepo, topics: ['react'] };
      expect(GitHubService.determineCategory(reactRepo)).toBe('web-development');
    });

    test('is case insensitive', () => {
      const upperCaseRepo = { ...baseRepo, topics: ['REACT-NATIVE'] };
      expect(GitHubService.determineCategory(upperCaseRepo)).toBe('mobile-development');
    });
  });

  describe('createMockRepository', () => {
    test('creates mock repository data from URL', () => {
      const url = 'https://github.com/testuser/awesome-project';
      const result = GitHubService.createMockRepository(url);

      expect(result).toMatchObject({
        name: 'awesome-project',
        html_url: url,
        clone_url: `${url}.git`,
        language: 'JavaScript',
        topics: ['react', 'typescript', 'tailwindcss', 'web-development']
      });

      expect(result.description).toContain('awesome project');
      expect(result.homepage).toBe('https://testuser.github.io/awesome-project');
    });

    test('throws error for invalid URL', () => {
      expect(() => GitHubService.createMockRepository('invalid-url'))
        .toThrow('Invalid repository URL');
    });

    test('handles repository names with hyphens', () => {
      const url = 'https://github.com/user/my-awesome-app';
      const result = GitHubService.createMockRepository(url);

      expect(result.name).toBe('my-awesome-app');
      expect(result.description).toContain('my awesome app');
    });
  });

  describe('Edge Cases', () => {
    test('handles empty repository data', () => {
      const emptyRepo = {
        name: '',
        description: '',
        language: '',
        topics: [],
        html_url: '',
        clone_url: '',
        created_at: '',
        updated_at: '',
        stargazers_count: 0,
        forks_count: 0,
        size: 0,
        default_branch: ''
      };

      expect(GitHubService.extractTechnologies(emptyRepo)).toEqual([]);
      expect(GitHubService.determineCategory(emptyRepo)).toBe('web-development');
    });

    test('handles null values gracefully', () => {
      const repoWithNulls = {
        name: 'test',
        description: null as any,
        language: null as any,
        topics: null as any,
        html_url: 'https://github.com/test/test',
        clone_url: 'https://github.com/test/test.git',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        stargazers_count: 0,
        forks_count: 0,
        size: 0,
        default_branch: 'main'
      };

      expect(() => GitHubService.extractTechnologies(repoWithNulls)).not.toThrow();
      expect(() => GitHubService.determineCategory(repoWithNulls)).not.toThrow();
    });
  });
});