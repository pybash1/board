function parseGitHubUrl(repoUrl: string): { owner: string; repo: string } | null {
  try {
    const url = new URL(repoUrl);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    if (pathParts.length >= 2) {
      return {
        owner: pathParts[0],
        repo: pathParts[1]
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function getLatestReleaseUrl(repoUrl: string): Promise<string | null> {
  const parsed = parseGitHubUrl(repoUrl);
  
  if (!parsed) {
    console.error('Invalid GitHub repository URL');
    return null;
  }

  const { owner, repo } = parsed;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;

  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      console.error(`Failed to fetch release: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data.html_url || null;
  } catch (error) {
    console.error('Error fetching latest release:', error);
    return null;
  }
}
