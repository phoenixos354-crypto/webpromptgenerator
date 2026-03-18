const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
  const correctPassword = process.env.SITE_PASSWORD;

  // Cek cookie auth
  const cookies = parseCookies(req.headers.cookie || '');
  const isAuthed = cookies['auth'] === correctPassword;

  if (!isAuthed) {
    // Serve login page
    const loginPath = path.join(process.cwd(), 'public', 'login.html');
    const html = fs.readFileSync(loginPath, 'utf-8');
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
  }

  // Serve main app
  const indexPath = path.join(process.cwd(), 'public', 'index.html');
  const html = fs.readFileSync(indexPath, 'utf-8');
  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(html);
}

function parseCookies(cookieStr) {
  return cookieStr.split(';').reduce((acc, part) => {
    const [key, ...val] = part.trim().split('=');
    if (key) acc[key.trim()] = val.join('=').trim();
    return acc;
  }, {});
}
