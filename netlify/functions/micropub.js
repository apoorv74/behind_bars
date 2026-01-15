/**
 * Micropub Endpoint for Hugo Static Site
 *
 * This serverless function handles Micropub requests and commits
 * posts directly to your GitHub repository.
 *
 * Supports: Notes, Articles, Photos, Bookmarks
 * Target: content/docs/micropub/
 */

const { Octokit } = require('@octokit/rest');

// Configuration
const CONFIG = {
  // GitHub settings
  github: {
    owner: 'apoorv74',
    repo: 'behind_bars',
    branch: 'main',
    contentPath: 'content/docs/notes',
    mediaPath: 'static/images/micropub'
  },
  // Site settings
  site: {
    url: 'https://behindbars.netlify.app',
    author: 'Apoorv Anand'
  }
};

/**
 * Verify IndieAuth token
 */
async function verifyToken(token) {
  const response = await fetch('https://tokens.indieauth.com/token', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': token
    }
  });

  if (!response.ok) {
    throw new Error('Invalid token');
  }

  const data = await response.json();

  // Verify the token is for our site
  if (!data.me || !data.me.includes('behindbars.netlify.app')) {
    throw new Error('Token not valid for this site');
  }

  return data;
}

/**
 * Generate a URL-friendly slug
 */
function generateSlug(text, maxLength = 50) {
  if (!text) {
    return Math.random().toString(36).substring(2, 10);
  }

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, maxLength)
    .replace(/^-|-$/g, '');
}

/**
 * Get current date in ISO format
 */
function getDateString() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get full ISO timestamp
 */
function getTimestamp() {
  return new Date().toISOString();
}

/**
 * Determine post type from Micropub properties
 */
function getPostType(properties) {
  if (properties['bookmark-of']) return 'bookmark';
  if (properties.photo) return 'photo';
  if (properties.name && properties.name[0]) return 'article';
  return 'note';
}

/**
 * Generate frontmatter based on post type
 */
function generateFrontmatter(type, properties) {
  const date = getTimestamp();
  const content = properties.content ? properties.content[0] : '';
  const contentText = typeof content === 'object' ? content.html || content.value : content;

  let frontmatter = {};
  let slug = '';

  switch (type) {
    case 'note':
      slug = properties.slug?.[0] || generateSlug(contentText.substring(0, 30));
      // Generate title from first few words for listing
      const noteTitle = contentText
        ? contentText.split(/\s+/).slice(0, 8).join(' ') + (contentText.split(/\s+/).length > 8 ? '...' : '')
        : 'Note';
      frontmatter = {
        title: noteTitle,
        date,
        author: CONFIG.site.author,
        categories: ['microblog', 'notes'],
        slug
      };
      break;

    case 'article':
      const title = properties.name[0];
      slug = properties.slug?.[0] || generateSlug(title);
      frontmatter = {
        title,
        date,
        author: CONFIG.site.author,
        categories: ['microblog', 'articles'],
        description: properties.summary?.[0] || '',
        slug
      };
      // Handle photos in articles
      if (properties.photo) {
        const photoData = properties.photo;
        let articlePhotos = [];
        if (Array.isArray(photoData)) {
          articlePhotos = photoData.map(p => {
            if (typeof p === 'string') return p;
            return p.value || p.url || String(p);
          });
        } else if (typeof photoData === 'string') {
          articlePhotos = [photoData];
        } else if (photoData && (photoData.value || photoData.url)) {
          articlePhotos = [photoData.value || photoData.url];
        }
        if (articlePhotos.length > 0) {
          frontmatter.images = articlePhotos;
        }
      }
      break;

    case 'photo':
      slug = properties.slug?.[0] || generateSlug(contentText?.substring(0, 20) || 'photo');
      // Handle different photo formats from various clients
      let photoUrls = [];
      const photoData = properties.photo;
      if (Array.isArray(photoData)) {
        photoUrls = photoData.map(p => {
          if (typeof p === 'string') return p;
          return p.value || p.url || String(p);
        });
      } else if (typeof photoData === 'string') {
        photoUrls = [photoData];
      } else if (photoData && (photoData.value || photoData.url)) {
        photoUrls = [photoData.value || photoData.url];
      }
      // Generate title for listing
      const photoTitle = contentText
        ? contentText.split(/\s+/).slice(0, 6).join(' ') + (contentText.split(/\s+/).length > 6 ? '...' : '')
        : 'Photo';
      frontmatter = {
        title: photoTitle,
        date,
        author: CONFIG.site.author,
        categories: ['microblog', 'photos'],
        images: photoUrls,
        slug
      };
      break;

    case 'bookmark':
      const bookmarkUrl = properties['bookmark-of'][0];
      slug = properties.slug?.[0] || generateSlug(properties.name?.[0] || 'bookmark');
      frontmatter = {
        title: properties.name?.[0] || bookmarkUrl,
        date,
        author: CONFIG.site.author,
        categories: ['microblog', 'bookmarks'],
        bookmark_of: bookmarkUrl,
        slug
      };
      break;
  }

  return { frontmatter, slug, type };
}

/**
 * Convert frontmatter object to YAML string
 */
function toYaml(obj) {
  let yaml = '---\n';

  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null || value === '') continue;

    if (Array.isArray(value)) {
      yaml += `${key}: [${value.map(v => `"${v}"`).join(', ')}]\n`;
    } else if (typeof value === 'string') {
      // Quote strings that might contain special characters
      if (value.includes(':') || value.includes('#') || value.includes('"')) {
        yaml += `${key}: "${value.replace(/"/g, '\\"')}"\n`;
      } else {
        yaml += `${key}: "${value}"\n`;
      }
    } else {
      yaml += `${key}: ${value}\n`;
    }
  }

  yaml += '---\n';
  return yaml;
}

/**
 * Create the full markdown content
 */
function createMarkdown(properties) {
  const type = getPostType(properties);
  const { frontmatter, slug } = generateFrontmatter(type, properties);

  // Get content
  let content = '';
  if (properties.content) {
    const rawContent = properties.content[0];
    content = typeof rawContent === 'object'
      ? (rawContent.html || rawContent.value || '')
      : rawContent;
  }

  const markdown = toYaml(frontmatter) + '\n' + content + '\n';

  // Generate filename
  const dateStr = getDateString();
  const filename = `${dateStr}-${type}-${slug}.md`;

  return { markdown, filename, type, slug };
}

/**
 * Commit file to GitHub
 */
async function commitToGitHub(octokit, path, content, message) {
  // Check if file already exists
  let sha;
  try {
    const { data } = await octokit.repos.getContent({
      owner: CONFIG.github.owner,
      repo: CONFIG.github.repo,
      path,
      ref: CONFIG.github.branch
    });
    sha = data.sha;
  } catch (e) {
    // File doesn't exist, that's fine
  }

  // Create or update file
  await octokit.repos.createOrUpdateFileContents({
    owner: CONFIG.github.owner,
    repo: CONFIG.github.repo,
    path,
    message,
    content: Buffer.from(content).toString('base64'),
    branch: CONFIG.github.branch,
    sha
  });
}

/**
 * Handle media upload
 */
async function handleMediaUpload(octokit, file, filename) {
  const path = `${CONFIG.github.mediaPath}/${filename}`;

  await commitToGitHub(
    octokit,
    path,
    file,
    `Micropub: Upload media - ${filename}`
  );

  return `${CONFIG.site.url}/images/micropub/${filename}`;
}

/**
 * Parse form data or JSON from request
 */
function parseRequest(event) {
  const contentType = event.headers['content-type'] || '';

  if (contentType.includes('application/json')) {
    return JSON.parse(event.body);
  }

  if (contentType.includes('application/x-www-form-urlencoded')) {
    const params = new URLSearchParams(event.body);
    const properties = {};

    for (const [key, value] of params.entries()) {
      // Handle array notation like content[] or category[]
      const cleanKey = key.replace('[]', '');
      if (key.endsWith('[]') || properties[cleanKey]) {
        if (!properties[cleanKey]) properties[cleanKey] = [];
        properties[cleanKey].push(value);
      } else {
        properties[cleanKey] = [value];
      }
    }

    return { type: 'h-entry', properties };
  }

  throw new Error('Unsupported content type');
}

/**
 * Main handler
 */
exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Handle GET request (configuration query)
  if (event.httpMethod === 'GET') {
    const params = new URLSearchParams(event.queryStringParameters || {});

    if (params.get('q') === 'config') {
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'media-endpoint': `${CONFIG.site.url}/.netlify/functions/micropub-media`,
          'post-types': [
            { type: 'note', name: 'Note' },
            { type: 'article', name: 'Article' },
            { type: 'photo', name: 'Photo' },
            { type: 'bookmark', name: 'Bookmark' }
          ]
        })
      };
    }

    if (params.get('q') === 'syndicate-to') {
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'syndicate-to': [] })
      };
    }

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    };
  }

  // Only POST allowed for creating content
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Verify authorization
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Authorization required' })
      };
    }

    await verifyToken(authHeader);

    // Parse request
    const data = parseRequest(event);

    // Handle action requests (update, delete)
    if (data.action) {
      return {
        statusCode: 501,
        headers,
        body: JSON.stringify({ error: 'Action not implemented' })
      };
    }

    // Create post
    const properties = data.properties || {};
    const { markdown, filename, type, slug } = createMarkdown(properties);

    // Commit to GitHub
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });

    const path = `${CONFIG.github.contentPath}/${filename}`;
    const commitMessage = `Micropub: New ${type}${properties.name?.[0] ? ` - ${properties.name[0]}` : ''}`;

    await commitToGitHub(octokit, path, markdown, commitMessage);

    // Return success with location
    const postUrl = `${CONFIG.site.url}/docs/notes/${slug}/`;

    return {
      statusCode: 201,
      headers: {
        ...headers,
        'Location': postUrl
      },
      body: JSON.stringify({ url: postUrl })
    };

  } catch (error) {
    console.error('Micropub error:', error);

    if (error.message === 'Invalid token' || error.message.includes('not valid')) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Forbidden', message: error.message })
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', message: error.message })
    };
  }
};
