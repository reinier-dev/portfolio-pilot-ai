# Contributing to Portfolio Pilot AI

Thank you for your interest in contributing to Portfolio Pilot AI! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (OS, browser, Node version)

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- **Clear title and description** of the enhancement
- **Use case** - why would this be useful?
- **Possible implementation** if you have ideas

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Follow the existing code style**
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Write clear commit messages**

## Development Setup

1. Clone your fork
   ```bash
   git clone https://github.com/YOUR_USERNAME/portfolio-pilot-ai.git
   cd portfolio-pilot-ai
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   # Add your API keys to .env.local
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper interfaces for data structures
- Avoid `any` types when possible
- Use meaningful variable and function names

### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper TypeScript typing for props

### Commit Messages

Follow this format:
```
type: brief description

Detailed explanation if needed
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat: add export to PDF functionality

fix: resolve infinite loop in Gallery component

docs: update installation instructions
```

## Testing

- Test your changes in both development and production builds
- Test with different prompts (English and Spanish)
- Verify that the Builder.io export works correctly
- Check responsive design on mobile and desktop

## Security

**IMPORTANT**: Never commit sensitive data!

- Never commit `.env.local` or any file with API keys
- Always use `.env.example` for documentation
- Double-check `.gitignore` before committing
- Report security vulnerabilities privately

## Questions?

Feel free to open an issue for questions or reach out to the maintainers.

Thank you for contributing! 🚀
