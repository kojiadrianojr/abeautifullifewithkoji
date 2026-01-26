# Contributing to Wedding Website Template

Thank you for your interest in improving this wedding website template! 

## How You Can Contribute

### 1. Report Bugs
If you find a bug:
- Check if it's already reported in Issues
- If not, create a new issue with:
  - Clear title
  - Steps to reproduce
  - Expected behavior
  - Actual behavior
  - Screenshots if applicable
  - Your environment (OS, Node version, browser)

### 2. Suggest Features
Have an idea? We'd love to hear it!
- Check existing feature requests first
- Create a new issue with label "feature request"
- Describe the problem it solves
- Provide examples or mockups if possible

### 3. Submit Code
Want to contribute code? Great!

#### Setup for Development

1. **Fork the repository**
   ```bash
   # Click "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/wedding-website.git
   cd wedding-website
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

5. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments where helpful
   - Test your changes thoroughly

6. **Test locally**
   ```bash
   npm run dev
   npm run build
   npm run lint
   ```

7. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: brief description of changes"
   ```

8. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

9. **Create Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Describe your changes
   - Link any related issues

## Code Style Guidelines

### TypeScript
- Use TypeScript for all new files
- Define types/interfaces for props
- Avoid `any` type
- Use meaningful variable names

```typescript
// Good
interface WeddingConfig {
  couple: CoupleInfo;
  date: string;
}

// Avoid
const data: any = {...}
```

### React Components
- Use functional components
- Use descriptive component names
- Keep components focused (single responsibility)
- Extract reusable logic

```tsx
// Good
export default function Hero() {
  const config = getWeddingConfig();
  return <section>...</section>;
}

// Avoid
export default function Comp1() {
  // 500 lines of code
}
```

### CSS/Tailwind
- Use Tailwind utility classes
- Follow mobile-first approach
- Group related classes
- Use custom classes for repeated patterns

```tsx
// Good
<div className="py-16 md:py-24 px-4">

// Avoid
<div style={{paddingTop: '64px'}}>
```

### File Naming
- Components: PascalCase (`Hero.tsx`)
- Utilities: camelCase (`config.ts`)
- Config files: kebab-case (`wedding-config.json`)

### Comments
- Write self-documenting code
- Add comments for complex logic
- Document component props
- Explain "why" not "what"

```typescript
// Good
// Calculate days until wedding for countdown
const daysUntil = calculateDays(weddingDate);

// Avoid
// This sets x to 5
const x = 5;
```

## Project Structure Rules

### Adding New Sections
1. Create component in `src/components/sections/`
2. Add configuration schema to `config/wedding.json`
3. Import in `src/app/page.tsx`
4. Update documentation in `CUSTOMIZATION.md`
5. Add to README features list

### Adding New Utilities
1. Create in `src/lib/`
2. Export clearly
3. Add TypeScript types
4. Write JSDoc comments

### Adding Documentation
- Keep existing structure
- Use markdown formatting
- Add examples
- Update table of contents

## Testing Checklist

Before submitting a PR, ensure:

- [ ] Code runs without errors (`npm run dev`)
- [ ] Build completes successfully (`npm run build`)
- [ ] No linting errors (`npm run lint`)
- [ ] Tested on desktop browsers (Chrome, Firefox, Safari)
- [ ] Tested on mobile devices
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Config changes documented
- [ ] Works with different color schemes
- [ ] Accessible (keyboard navigation, screen readers)

## Commit Message Format

Use clear, descriptive commit messages:

```
Add: New feature
Fix: Bug description
Update: What was updated
Remove: What was removed
Docs: Documentation changes
Style: Code style changes (no functionality change)
Refactor: Code restructure (no functionality change)
Test: Test additions or changes
```

Examples:
```
Add: Guest book section
Fix: Mobile menu not closing on link click
Update: Hero section responsiveness
Docs: Add color customization guide
Refactor: Extract date formatting utility
```

## Pull Request Guidelines

A good PR includes:

1. **Clear Title**
   - Summarize the change
   - Use commit message format

2. **Description**
   - What does this PR do?
   - Why is it needed?
   - How was it tested?

3. **Screenshots**
   - Before/after for UI changes
   - Mobile and desktop views

4. **Checklist**
   - Mark completed items
   - Explain any skipped items

5. **Related Issues**
   - Link to issues it solves
   - Use "Fixes #123" to auto-close

## Code Review Process

1. Maintainer reviews your PR
2. May request changes
3. You address feedback
4. Maintainer approves
5. PR is merged

## Documentation Standards

When updating docs:

- Use clear, simple language
- Include code examples
- Add screenshots for visual features
- Keep formatting consistent
- Update table of contents
- Check for typos

## Need Help?

- **Questions**: Create a GitHub issue with "question" label
- **Discussions**: Use GitHub Discussions
- **Chat**: Join our Discord/Slack (if available)
- **Email**: wedding@example.com

## Recognition

Contributors will be:
- Listed in CHANGELOG.md
- Credited in documentation
- Thanked publicly (if desired)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for making this template better! 💝
