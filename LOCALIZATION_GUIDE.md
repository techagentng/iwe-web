# Localization Framework Guide

## 🌍 Overview

This application now supports multiple languages using `next-i18next` and `react-i18next`. The framework provides seamless translation support for all UI components.

## 📦 Dependencies Installed

- `next-i18next` - Next.js i18n integration
- `react-i18next` - React i18n hooks and components
- `i18next` - Core internationalization library
- `i18next-fs-backend` - File system backend for translations
- `i18next-browser-languagedetector` - Browser language detection

## 🗂️ File Structure

```
iwe-react/
├── lib/
│   └── i18n.js                    # i18n configuration
├── locales/
│   ├── en/
│   │   └── common.json           # English translations
│   ├── yo/
│   │   └── common.json           # Yorùbá translations
│   ├── ig/
│   │   └── common.json           # Igbo translations
│   ├── ha/
│   │   └── common.json           # Hausa translations
│   └── pcm/
│       └── common.json           # Nigerian Pidgin translations
├── hooks/
│   └── useTranslation.js         # Custom translation hook
├── components/
│   └── LanguageSwitcher.tsx      # Language switcher component
├── next-i18next.config.js        # Next.js i18n config
└── next.config.js                # Updated Next.js config
```

## 🌐 Supported Languages

| Code | Language | Flag |
|------|----------|------|
| `en` | English | 🇬🇧 |
| `yo` | Yorùbá | 🇳🇬 |
| `ig` | Igbo | 🇳🇬 |
| `ha` | Hausa | 🇳🇬 |
| `pcm` | Nigerian Pidgin | 🇳🇬 |

## 🚀 Usage

### 1. Using Translations in Components

```tsx
import { useTranslation } from '../hooks/useTranslation';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('landing.welcome')}</h1>
      <p>{t('landing.tagline')}</p>
    </div>
  );
}
```

### 2. Custom Translation Hook

The custom hook provides additional features:

```tsx
import { useTranslation } from '../hooks/useTranslation';

function MyComponent() {
  const { t, i18n, currentLanguage, changeLanguage, isRTL } = useTranslation();
  
  // Access current language
  console.log(currentLanguage); // 'en', 'es', etc.
  
  // Check if RTL language
  if (isRTL) {
    // Apply RTL styles
  }
  
  // Change language programmatically
  const handleLanguageChange = () => {
    changeLanguage('es');
  };
  
  return <div>{t('common.hello')}</div>;
}
```

### 3. Language Switcher Component

```tsx
import LanguageSwitcher from '../components/LanguageSwitcher';

function Navbar() {
  return (
    <nav>
      <LanguageSwitcher />
      {/* Other nav items */}
    </nav>
  );
}
```

## 📝 Translation Files

### Structure

```json
{
  "navigation": {
    "home": "Home",
    "products": "Products",
    "login": "Log in",
    "signup": "Sign up"
  },
  "landing": {
    "welcome": "Welcome to",
    "tagline": "The modern platform..."
  },
  "login": {
    "welcomeBack": "Welcome Back",
    "emailOrUsername": "Email or Username"
  }
}
```

### Adding New Translations

1. **Add to English file** (`locales/en/common.json`):
```json
{
  "newSection": {
    "newKey": "New English text"
  }
}
```

2. **Add to other language files**:
```json
// locales/es/common.json
{
  "newSection": {
    "newKey": "Nuevo texto en inglés"
  }
}
```

3. **Use in component**:
```tsx
const { t } = useTranslation();
const text = t('newSection.newKey');
```

## 🔧 Configuration

### Next.js Config (`next.config.js`)

```javascript
const { i18n } = require('./next-i18next.config');

module.exports = {
  reactStrictMode: true,
  i18n,
};
```

### i18n Config (`next-i18next.config.js`)

```javascript
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'yo', 'ig', 'ha', 'pcm'],
    localePath: './locales',
    localeDetection: true,
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
```

## 🌐 URL Structure

With i18n routing, URLs include the locale:

- English: `http://localhost:3000/en/login`
- Yorùbá: `http://localhost:3000/yo/login`
- Igbo: `http://localhost:3000/ig/login`
- Hausa: `http://localhost:3000/ha/login`
- Nigerian Pidgin: `http://localhost:3000/pcm/login`

The default locale (`en`) can also be accessed without the prefix:
- `http://localhost:3000/login` → English version

## 🎨 Language Switcher Features

- **Animated dropdown** with smooth transitions
- **Flag icons** for visual language identification
- **Current language indicator** with blue dot
- **Hover effects** and micro-interactions
- **Responsive design** for mobile and desktop
- **Automatic URL updates** when language changes

## 📱 RTL Support

The framework includes RTL detection for Arabic:

```tsx
const { isRTL } = useTranslation();

// Apply RTL styles
<div style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
  {t('content')}
</div>
```

## 🔄 Language Detection

The system detects language preference in this order:

1. **URL path** (`/es/login`)
2. **Cookie** (`next-i18next-cookie`)
3. **Local storage**
4. **Browser navigator language**
5. **HTML tag** (`lang="es"`)

## 🛠️ Advanced Features

### Dynamic Translation Loading

```tsx
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
```

### Pluralization

```json
// locales/en/common.json
{
  "items": {
    "zero": "No items",
    "one": "{{count}} item",
    "other": "{{count}} items"
  }
}
```

```tsx
const { t } = useTranslation();
t('items', { count: 0 }); // "No items"
t('items', { count: 1 }); // "1 item"
t('items', { count: 5 }); // "5 items"
```

### Interpolation

```json
{
  "welcome": "Welcome, {{name}}!",
  "itemsLeft": "{{count}} items remaining"
}
```

```tsx
t('welcome', { name: 'John' }); // "Welcome, John!"
t('itemsLeft', { count: 5 }); // "5 items remaining"
```

## 🚀 Getting Started

1. **Install dependencies** (already done)
2. **Configure files** (already done)
3. **Add translations** to locale files
4. **Use `useTranslation` hook** in components
5. **Add `LanguageSwitcher`** where needed
6. **Update pages** with `getServerSideProps` for SSR

## 📋 Best Practices

1. **Keep translation keys organized** by section
2. **Use descriptive keys** (e.g., `login.emailPlaceholder`)
3. **Maintain consistency** across all languages
4. **Test all languages** before deployment
5. **Handle missing translations** gracefully
6. **Use interpolation** for dynamic content
7. **Consider character limits** for different languages

## 🐛 Troubleshooting

### Common Issues

1. **Translations not loading**: Check file paths and server restart
2. **Language not switching**: Verify i18n configuration
3. **Missing translations**: Add keys to all locale files
4. **URL routing issues**: Check Next.js i18n config

### Debug Mode

Enable debug logging in development:

```javascript
// lib/i18n.js
i18n.init({
  debug: process.env.NODE_ENV === 'development',
  // ... other config
});
```

## 🎯 Next Steps

1. Add more language files as needed
2. Implement language-specific date/time formatting
3. Add currency formatting for different locales
4. Create language-specific content pages
5. Set up translation management workflow

---

The localization framework is now fully integrated and ready to use! Users can switch between 7 languages seamlessly, and all UI elements will be translated automatically.
