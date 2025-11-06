# Navbar Component Guide

## Overview

A modern, responsive navigation bar inspired by Wave's design with smooth animations and theme support.

## Features

✅ **Responsive Design** - Works on all screen sizes
✅ **Dropdown Menus** - Smooth hover animations with staggered items
✅ **Theme Toggle** - Integrated theme switcher
✅ **Mobile Menu** - Full-featured mobile navigation
✅ **Scroll Effect** - Shadow appears on scroll
✅ **Framer Motion** - Smooth animations throughout

## Usage

### Basic Implementation

```tsx
import Navbar from '@/components/Navbar';

export default function MyPage() {
  return (
    <div>
      <Navbar />
      {/* Your page content */}
    </div>
  );
}
```

## Customizing Menu Items

Edit the `navItems` array in `/components/Navbar.tsx`:

```tsx
const navItems: NavItem[] = [
  {
    label: 'Products',
    dropdown: [
      {
        label: 'Dashboard',
        href: '/dashboard',
        description: 'Overview of your business',
        icon: <BarChart3 className="w-5 h-5" />,
      },
      // Add more items...
    ],
  },
  {
    label: 'Pricing',
    href: '/pricing', // Simple link without dropdown
  },
];
```

## Menu Item Types

### 1. Simple Link
```tsx
{
  label: 'Pricing',
  href: '/pricing',
}
```

### 2. Dropdown Menu
```tsx
{
  label: 'Products',
  dropdown: [
    {
      label: 'Item Name',
      href: '/path',
      description: 'Optional description',
      icon: <IconComponent className="w-5 h-5" />,
    },
  ],
}
```

## Customization Options

### Change Logo

In `Navbar.tsx`, find the logo section:

```tsx
<Link href="/" className="flex items-center gap-2 group">
  <motion.div
    whileHover={{ rotate: 180 }}
    className="p-2 rounded-lg"
    style={{ backgroundColor: 'var(--accent-primary)' }}
  >
    <Zap className="w-5 h-5 text-white" />
  </motion.div>
  <span className="text-xl font-bold">MyApp</span>
</Link>
```

Replace `<Zap />` with your logo and change "MyApp" to your brand name.

### Change Colors

The navbar uses CSS variables, so it automatically adapts to your theme:
- Background: `var(--bg-primary)`
- Text: `var(--text-primary)`
- Accent: `var(--accent-primary)`
- Border: `var(--border-color)`

### Adjust Dropdown Width

In the dropdown section, change the width:

```tsx
className="absolute top-full left-0 mt-2 w-80" // Change w-80 to your desired width
```

### Modify Animation Speed

Change transition durations:

```tsx
transition={{ duration: 0.2 }} // Adjust duration value
```

## Animation Details

### Dropdown Animation
- **Initial**: Opacity 0, Y -10px
- **Animate**: Opacity 1, Y 0
- **Duration**: 0.2s
- **Easing**: easeOut

### Dropdown Items (Staggered)
- Each item animates with a 0.05s delay
- Hover effect: Slides 4px to the right

### Mobile Menu
- **Initial**: Opacity 0, Height 0
- **Animate**: Opacity 1, Height auto
- **Duration**: 0.3s

### Chevron Rotation
- Rotates 180° when dropdown is open
- Duration: 0.2s

## Responsive Breakpoints

- **Mobile**: < 768px (md breakpoint)
  - Shows hamburger menu
  - Full-screen mobile menu
  - Stacked buttons

- **Desktop**: ≥ 768px
  - Horizontal menu
  - Hover dropdowns
  - Inline buttons

## Icons Used

From `lucide-react`:
- `Menu` - Mobile menu button
- `X` - Close mobile menu
- `ChevronDown` - Dropdown indicator
- `Zap` - Logo icon
- Various icons for menu items

## Adding New Icons

1. Import from lucide-react:
```tsx
import { YourIcon } from 'lucide-react';
```

2. Add to menu item:
```tsx
{
  label: 'New Item',
  href: '/new',
  icon: <YourIcon className="w-5 h-5" />,
}
```

## Scroll Effect

The navbar adds a shadow when scrolled:

```tsx
const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 10); // Triggers at 10px scroll
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

Adjust the `10` value to change when the shadow appears.

## Mobile Menu Behavior

- Clicking a link automatically closes the menu
- Clicking outside doesn't close (add if needed)
- Smooth height animation
- Maintains scroll position

## Best Practices

1. **Keep dropdown items to 4-6** for best UX
2. **Use descriptive labels** for menu items
3. **Add icons** to dropdown items for visual clarity
4. **Test on mobile** - ensure touch targets are large enough
5. **Keep descriptions short** - 1 line maximum

## Common Modifications

### Remove Theme Toggle

Remove this line:
```tsx
<ThemeToggle />
```

### Change Button Text

```tsx
<Link href="/login">
  <motion.button>
    Log in // Change this text
  </motion.button>
</Link>
```

### Add More Buttons

Add after the existing buttons:
```tsx
<Link href="/contact">
  <motion.button
    className="btn-secondary"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    Contact
  </motion.button>
</Link>
```

### Disable Dropdown on Mobile

In the mobile menu section, replace dropdown rendering with a simple link.

## Troubleshooting

**Dropdown not showing?**
- Check z-index (navbar has z-50)
- Ensure parent doesn't have overflow-hidden

**Mobile menu not closing?**
- Verify onClick handlers on links
- Check setMobileMenuOpen(false) is called

**Theme toggle not working?**
- Ensure ThemeProvider wraps your app
- Check ThemeToggle component is imported

**Animations choppy?**
- Reduce animation duration
- Check for performance issues
- Ensure Framer Motion is installed

## Example: Adding a New Dropdown

```tsx
{
  label: 'Company',
  dropdown: [
    {
      label: 'About Us',
      href: '/about',
      description: 'Learn about our story',
      icon: <Info className="w-5 h-5" />,
    },
    {
      label: 'Careers',
      href: '/careers',
      description: 'Join our team',
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: 'Contact',
      href: '/contact',
      description: 'Get in touch',
      icon: <Mail className="w-5 h-5" />,
    },
  ],
}
```

## Performance Tips

1. Use `React.memo` for dropdown items if you have many
2. Lazy load icons if bundle size is a concern
3. Debounce scroll events if needed
4. Use CSS transforms for animations (already implemented)

## Accessibility

- Keyboard navigation supported
- ARIA labels on buttons
- Semantic HTML structure
- Focus states visible
- Mobile-friendly touch targets

---

For more examples, visit `/theme-showcase` in your app!
