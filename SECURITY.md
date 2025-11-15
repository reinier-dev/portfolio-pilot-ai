# Security Policy

## Reporting Security Issues

If you discover a security vulnerability in Portfolio Pilot AI, please report it privately by emailing the maintainers. **Do not** open a public issue.

We take security seriously and will respond to reports within 48 hours.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Security Best Practices

### For Users

1. **Never commit `.env.local` or any file containing API keys**
   - The `.gitignore` file is configured to prevent this
   - Always double-check before committing

2. **Keep your API keys secure**
   - Never share your OpenAI or Supabase keys
   - Rotate keys if they are accidentally exposed
   - Use environment variables, never hardcode keys

3. **Use strong API key restrictions**
   - OpenAI: Set usage limits on your API key
   - Supabase: Use Row Level Security (RLS) policies
   - Monitor your API usage regularly

4. **Keep dependencies updated**
   ```bash
   npm audit
   npm update
   ```

### For Contributors

1. **Review all changes carefully**
   - Check that no sensitive data is included
   - Verify `.gitignore` rules are working
   - Use `git diff` before committing

2. **Use `.env.example` for documentation**
   - Never include real values
   - Document all required environment variables
   - Keep it updated with the codebase

3. **Follow secure coding practices**
   - Validate all user inputs
   - Use parameterized queries
   - Implement proper error handling
   - Don't expose sensitive error messages

## Environment Variable Security

### Required Variables

All sensitive configuration must be in `.env.local`:

```env
OPENAI_API_KEY=sk-...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=eyJ...
```

### What NOT to commit

❌ Never commit:
- `.env.local`
- `.env.production`
- `.env.development`
- Any file containing real API keys
- Database credentials
- Private keys or certificates

✅ Safe to commit:
- `.env.example` (template only)
- `.env` (if it contains no secrets)
- Configuration files with placeholder values

## Verifying Security

Before pushing to GitHub, run:

```bash
# Check for accidentally staged sensitive files
git status

# Verify .env.local is not tracked
git ls-files | grep .env.local

# Should return nothing
```

## API Key Rotation

If you suspect your keys have been compromised:

1. **Immediately rotate the keys**
   - OpenAI: https://platform.openai.com/api-keys
   - Supabase: Project Settings → API

2. **Update your `.env.local`** with new keys

3. **Check for unauthorized usage**
   - OpenAI: Check usage dashboard
   - Supabase: Review database logs

4. **Report the incident** if necessary

## Known Security Considerations

### Client-Side Storage

- The app uses `localStorage` for the gallery
- Data is stored locally in the user's browser
- No sensitive data is stored in localStorage
- Users can clear their data anytime

### API Keys

- OpenAI key is server-side only (never exposed to client)
- Supabase anon key is client-safe (designed for public use)
- All database access uses Supabase Row Level Security

### Third-Party Services

- OpenAI API: Rate-limited, monitored usage
- Supabase: Encrypted connections, RLS policies
- Builder.io: No sensitive data sent

## Security Updates

We monitor dependencies for security vulnerabilities using:

```bash
npm audit
```

Run this regularly and update packages as needed:

```bash
npm audit fix
```

## Questions?

For security-related questions or concerns, please contact the maintainers directly rather than opening a public issue.

---

Last updated: 2024-11-15
