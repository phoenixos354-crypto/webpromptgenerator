export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;
  const correctPassword = process.env.SITE_PASSWORD;

  if (!correctPassword) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  if (password === correctPassword) {
    // Set auth cookie — httpOnly supaya tidak bisa diakses JS client
    res.setHeader('Set-Cookie', [
      `auth=${process.env.SITE_PASSWORD}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`,
    ]);
    return res.status(200).json({ success: true });
  }

  // Sedikit delay untuk mencegah brute force
  setTimeout(() => {
    res.status(401).json({ success: false, error: 'Wrong password' });
  }, 800);
}
