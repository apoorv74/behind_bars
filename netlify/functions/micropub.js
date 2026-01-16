/**
 * Micropub Endpoint for Hugo Static Site
 *
 * Handles notes and bookmarks, commits directly to GitHub.
 * Notes can include photo URLs. No file uploads.
 */

const { Octokit } = require('@octokit/rest');

const CONFIG = {
  github: {
    owner: 'apoorv74',
    repo: 'behind_bars',
    branch: 'main',
    contentPath: 'content/docs/notes'
  },
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
 * Get current date string (YYYY-MM-DD)
 */
function getDateString() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Determine post type from properties
 */
function getPostType(properties) {
  if (properties['bookmark-of']) return 'bookmark';
  return 'note';
}

/**
 * Build categories array from base type + user tags
 */
function buildCategories(baseType, properties) {
  const categories = ['microblog', baseType];

  // Add user-provided categories/tags
  if (properties.category) {
    const userTags = Array.isArray(properties.category)
      ? properties.category
      : [properties.category];

    for (const tag of userTags) {
      if (tag && !categories.includes(tag)) {
        categories.push(tag);
      }
    }
  }

  return categories;
}

/**
 * Generate frontmatter based on post type
 */
function generateFrontmatter(type, properties) {
  const date = new Date().toISOString();
  const content = properties.content?.[0] || '';
  const contentText = typeof content === 'object' ? (content.html || content.value) : content;

  let frontmatter = {};
  let slug = '';

  if (type === 'note') {
    const title = properties.name?.[0]
      || (contentText
        ? contentText.split(/\s+/).slice(0, 8).join(' ') + (contentText.split(/\s+/).length > 8 ? '...' : '')
        : 'Note');
    slug = properties.slug?.[0] || generateSlug(properties.name?.[0] || contentText?.substring(0, 30) || 'note');

    frontmatter = {
      title,
      date,
      author: CONFIG.site.author,
      categories: buildCategories('notes', properties),
      slug
    };

    // Handle photo URLs
    if (properties.photo) {
      const photos = Array.isArray(properties.photo) ? properties.photo : [properties.photo];
      const photoUrls = photos.map(p => typeof p === 'string' ? p : (p.value || p.url || String(p)));
      if (photoUrls.length > 0) {
        frontmatter.images = photoUrls;
      }
    }
  } else if (type === 'bookmark') {
    const bookmarkUrl = properties['bookmark-of'][0];
    slug = properties.slug?.[0] || generateSlug(properties.name?.[0] || 'bookmark');

    frontmatter = {
      title: properties.name?.[0] || bookmarkUrl,
      date,
      author: CONFIG.site.author,
      categories: buildCategories('bookmarks', properties),
      bookmark_of: bookmarkUrl,
      slug
    };
  }

  return { frontmatter, slug, type };
}

/**
 * Convert frontmatter object to YAML
 */
function toYaml(obj) {
  let yaml = '---\n';

  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null || value === '') continue;

    if (Array.isArray(value)) {
      yaml += `${key}: [${value.map(v => `"${v}"`).join(', ')}]\n`;
    } else if (typeof value === 'string') {
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
 * Create markdown content from properties
 */
function createMarkdown(properties) {
  const type = getPostType(properties);
  const { frontmatter, slug } = generateFrontmatter(type, properties);

  let content = '';
  if (properties.content) {
    const rawContent = properties.content[0];
    content = typeof rawContent === 'object'
      ? (rawContent.html || rawContent.value || '')
      : rawContent;
  }

  const markdown = toYaml(frontmatter) + '\n' + content + '\n';
  const filename = `${getDateString()}-${type}-${slug}.md`;

  return { markdown, filename, type, slug };
}

/**
 * Commit file to GitHub
 */
async function commitToGitHub(octokit, path, content, message) {
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
    // File doesn't exist
  }

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
 * Parse request body (JSON or form-urlencoded)
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
exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Config queries
  if (event.httpMethod === 'GET') {
    const q = event.queryStringParameters?.q;

    if (q === 'config') {
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'post-types': [
            { type: 'note', name: 'Note' },
            { type: 'bookmark', name: 'Bookmark' }
          ]
        })
      };
    }

    if (q === 'syndicate-to') {
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

  // Only POST for creating
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Auth
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Authorization required' })
      };
    }

    await verifyToken(authHeader);

    // Parse and create post
    const data = parseRequest(event);

    if (data.action) {
      return {
        statusCode: 501,
        headers,
        body: JSON.stringify({ error: 'Action not implemented' })
      };
    }

    const properties = data.properties || {};
    const { markdown, filename, type, slug } = createMarkdown(properties);

    // Commit to GitHub
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const path = `${CONFIG.github.contentPath}/${filename}`;
    const commitMessage = `Micropub: New ${type}${properties.name?.[0] ? ` - ${properties.name[0]}` : ''}`;

    await commitToGitHub(octokit, path, markdown, commitMessage);

    const postUrl = `${CONFIG.site.url}/docs/notes/${slug}/`;

    return {
      statusCode: 201,
      headers: { ...headers, 'Location': postUrl },
      body: JSON.stringify({ url: postUrl })
    };

  } catch (error) {
    console.error('Micropub error:', error.message);

    if (error.message.includes('token') || error.message.includes('Token')) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Forbidden', message: error.message })
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server error', message: error.message })
    };
  }
};
