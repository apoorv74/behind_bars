/**
 * Micropub Media Endpoint
 *
 * Handles file uploads (images) for the Micropub server.
 * Commits uploaded media to: static/images/micropub/
 */

const { Octokit } = require('@octokit/rest');
const Busboy = require('busboy');

// Configuration
const CONFIG = {
  github: {
    owner: 'apoorv74',
    repo: 'behind_bars',
    branch: 'main',
    mediaPath: 'static/images/micropub'
  },
  site: {
    url: 'https://behindbars.netlify.app'
  },
  // Allowed file types
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxFileSize: 10 * 1024 * 1024 // 10MB
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
 * Parse multipart form data
 */
function parseMultipart(event) {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({
      headers: {
        'content-type': event.headers['content-type'] || event.headers['Content-Type']
      }
    });

    const files = [];
    let fileCount = 0;

    busboy.on('file', (fieldname, file, info) => {
      const { filename, mimeType } = info;
      const chunks = [];

      file.on('data', (chunk) => {
        chunks.push(chunk);
      });

      file.on('end', () => {
        files.push({
          fieldname,
          filename,
          mimeType,
          data: Buffer.concat(chunks)
        });
      });

      fileCount++;
    });

    busboy.on('finish', () => {
      resolve(files);
    });

    busboy.on('error', (error) => {
      reject(error);
    });

    // Handle base64 encoded body from API Gateway
    const body = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64')
      : event.body;

    busboy.end(body);
  });
}

/**
 * Generate unique filename
 */
function generateFilename(originalName, mimeType) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);

  // Get extension from original name or mime type
  let ext = '';
  if (originalName && originalName.includes('.')) {
    ext = originalName.split('.').pop().toLowerCase();
  } else {
    const mimeToExt = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp'
    };
    ext = mimeToExt[mimeType] || 'jpg';
  }

  return `${timestamp}-${random}.${ext}`;
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
    content: content.toString('base64'),
    branch: CONFIG.github.branch,
    sha
  });
}

/**
 * Main handler
 */
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only POST allowed
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

    // Parse multipart form data
    const files = await parseMultipart(event);

    if (files.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No file uploaded' })
      };
    }

    const file = files[0];

    // Validate file type
    if (!CONFIG.allowedTypes.includes(file.mimeType)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Invalid file type',
          allowed: CONFIG.allowedTypes
        })
      };
    }

    // Validate file size
    if (file.data.length > CONFIG.maxFileSize) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'File too large',
          maxSize: `${CONFIG.maxFileSize / 1024 / 1024}MB`
        })
      };
    }

    // Generate filename and upload
    const filename = generateFilename(file.filename, file.mimeType);
    const path = `${CONFIG.github.mediaPath}/${filename}`;

    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });

    await commitToGitHub(
      octokit,
      path,
      file.data,
      `Micropub: Upload media - ${filename}`
    );

    // Return the URL to the uploaded file
    const mediaUrl = `${CONFIG.site.url}/images/micropub/${filename}`;

    return {
      statusCode: 201,
      headers: {
        ...headers,
        'Location': mediaUrl
      },
      body: JSON.stringify({ url: mediaUrl })
    };

  } catch (error) {
    console.error('Media upload error:', error);

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
