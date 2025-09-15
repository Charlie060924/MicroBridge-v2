interface GitHubRepository {
  name: string;
  description: string;
  language: string;
  topics: string[];
  html_url: string;
  clone_url: string;
  created_at: string;
  updated_at: string;
  homepage?: string;
  stargazers_count: number;
  forks_count: number;
  size: number;
  default_branch: string;
}

interface GitHubError {
  message: string;
  documentation_url?: string;
}

export class GitHubService {
  private static readonly GITHUB_API_BASE = 'https://api.github.com';
  
  /**
   * Extract owner and repository name from GitHub URL
   */
  static parseRepositoryUrl(url: string): { owner: string; repo: string } | null {
    const patterns = [
      /github\.com\/([^\/]+)\/([^\/]+?)(?:\.git)?(?:\/.*)?$/,
      /^([^\/]+)\/([^\/]+)$/ // For direct owner/repo format
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return {
          owner: match[1],
          repo: match[2]
        };
      }
    }
    
    return null;
  }

  /**
   * Fetch repository data from GitHub API
   */
  static async fetchRepository(owner: string, repo: string): Promise<GitHubRepository> {
    try {
      const response = await fetch(`${this.GITHUB_API_BASE}/repos/${owner}/${repo}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          // Note: In production, you'd want to use a GitHub token for higher rate limits
          // 'Authorization': `token ${process.env.GITHUB_TOKEN}`
        }
      });

      if (!response.ok) {
        const error: GitHubError = await response.json();
        throw new Error(error.message || `GitHub API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch GitHub repository:', error);
      throw error;
    }
  }

  /**
   * Fetch repository README content
   */
  static async fetchReadme(owner: string, repo: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.GITHUB_API_BASE}/repos/${owner}/${repo}/readme`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        return null; // README not found or not accessible
      }

      const data = await response.json();
      // Decode base64 content
      return atob(data.content.replace(/\s/g, ''));
    } catch (error) {
      console.error('Failed to fetch README:', error);
      return null;
    }
  }

  /**
   * Fetch package.json to extract dependencies (for JS/TS projects)
   */
  static async fetchPackageJson(owner: string, repo: string): Promise<any | null> {
    try {
      const response = await fetch(`${this.GITHUB_API_BASE}/repos/${owner}/${repo}/contents/package.json`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        return null; // package.json not found
      }

      const data = await response.json();
      const content = atob(data.content.replace(/\s/g, ''));
      return JSON.parse(content);
    } catch (error) {
      console.error('Failed to fetch package.json:', error);
      return null;
    }
  }

  /**
   * Extract technologies from repository data
   */
  static extractTechnologies(repo: GitHubRepository, packageJson?: any): string[] {
    const technologies = new Set<string>();

    // Add primary language
    if (repo.language) {
      technologies.add(repo.language);
    }

    // Add topics (GitHub repository topics)
    repo.topics?.forEach(topic => {
      technologies.add(topic);
    });

    // Extract from package.json dependencies
    if (packageJson) {
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      Object.keys(deps || {}).forEach(dep => {
        // Map common dependencies to technology names
        const techMap: Record<string, string> = {
          'react': 'React',
          'vue': 'Vue.js',
          'angular': 'Angular',
          'next': 'Next.js',
          'nuxt': 'Nuxt.js',
          'express': 'Express.js',
          'fastify': 'Fastify',
          'typescript': 'TypeScript',
          'tailwindcss': 'Tailwind CSS',
          'styled-components': 'Styled Components',
          'sass': 'SASS',
          'less': 'Less',
          'webpack': 'Webpack',
          'vite': 'Vite',
          'jest': 'Jest',
          'cypress': 'Cypress',
          'playwright': 'Playwright'
        };

        const techName = techMap[dep.toLowerCase()] || (dep.startsWith('@') ? null : dep);
        if (techName) {
          technologies.add(techName);
        }
      });
    }

    return Array.from(technologies);
  }

  /**
   * Determine project category based on repository data
   */
  static determineCategory(repo: GitHubRepository, packageJson?: any): string {
    const description = repo.description?.toLowerCase() || '';
    const topics = repo.topics?.map(t => t.toLowerCase()) || [];
    const language = repo.language?.toLowerCase() || '';

    // Check for mobile development
    if (topics.includes('android') || topics.includes('ios') || 
        topics.includes('react-native') || topics.includes('flutter')) {
      return 'mobile-development';
    }

    // Check for desktop applications
    if (topics.includes('desktop') || topics.includes('electron') ||
        language === 'c++' || language === 'c#' || language === 'java') {
      return 'desktop-application';
    }

    // Check for data science/AI
    if (topics.includes('machine-learning') || topics.includes('data-science') ||
        topics.includes('artificial-intelligence') || language === 'python') {
      return 'data-science';
    }

    // Check for game development
    if (topics.includes('game') || topics.includes('unity') || topics.includes('gamedev')) {
      return 'game-development';
    }

    // Check for DevOps/Infrastructure
    if (topics.includes('devops') || topics.includes('docker') || 
        topics.includes('kubernetes') || topics.includes('terraform')) {
      return 'devops';
    }

    // Default to web development
    return 'web-development';
  }

  /**
   * Create a mock repository for development/demo purposes
   */
  static createMockRepository(url: string): GitHubRepository {
    const repoInfo = this.parseRepositoryUrl(url);
    if (!repoInfo) {
      throw new Error('Invalid repository URL');
    }

    return {
      name: repoInfo.repo,
      description: `A ${repoInfo.repo.replace(/-/g, ' ')} project showcasing modern development practices`,
      language: 'JavaScript',
      topics: ['react', 'typescript', 'tailwindcss', 'web-development'],
      html_url: url,
      clone_url: `${url}.git`,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-03-01T00:00:00Z',
      homepage: `https://${repoInfo.owner}.github.io/${repoInfo.repo}`,
      stargazers_count: 42,
      forks_count: 8,
      size: 1024,
      default_branch: 'main'
    };
  }
}