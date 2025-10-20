# Global Navigation Menu System

The navigation menu has been standardized across all Tinkerium tools for a consistent user experience.

## 📁 Files

### For HTML-based tools:
- `/shared/nav-menu.css` - Navigation menu styles
- `/shared/nav-menu.js` - Navigation menu HTML injection and toggle logic

### For React-based tools:
- `/shared/ui-components/NavMenu.tsx` - React navigation component

## 🎨 Design

The nav menu features a **hamburger button** (☰) in the top-left corner that opens a dropdown with links to all tools:
- HOME
- CODE TO MP4
- ASCII-FY
- SHADER PLAYGROUND
- WAVE VISUALIZER

**Styling:**
- Green neon CRT aesthetic (#0f0)
- Fixed position (top-left)
- Glowing hover effects
- Smooth transitions
- Click outside to close

## 🔧 Implementation

### HTML-based Tools (Shader Playground, Wave Visualizer)

**Step 1:** Add CSS link in `<head>`:
```html
<link rel="stylesheet" href="/shared/nav-menu.css">
```

**Step 2:** Add comment where nav should appear (usually after `<body>`):
```html
<body>
    <!-- Navigation menu injected by /shared/nav-menu.js -->
```

**Step 3:** Add JavaScript at the end before `</body>`:
```html
    <script src="/shared/nav-menu.js"></script>
</body>
```

**That's it!** The nav menu will automatically inject and function.

### React-based Tools (ASCII Art, Code-to-MP4)

**Step 1:** Import the NavMenu component:
```tsx
import { NavMenu } from '../../../shared/ui-components/NavMenu';
```

**Step 2:** Add component to your JSX:
```tsx
return (
  <div className="app">
    <NavMenu />
    {/* rest of your app */}
  </div>
);
```

## ✏️ Updating Menu Links

To add/remove/change menu items, edit **ONE** file:

### For HTML tools:
Edit `/shared/nav-menu.js`:
```javascript
const navHTML = `
    <div class="nav-dropdown">
        <button class="nav-toggle" id="navToggle">☰</button>
        <nav class="nav-menu" id="navMenu">
            <a href="/" class="nav-link">HOME</a>
            <a href="/tools/your-new-tool/" class="nav-link">NEW TOOL</a>
            <!-- Add more links here -->
        </nav>
    </div>
`;
```

### For React tools:
Edit `/shared/ui-components/NavMenu.tsx`:
```tsx
const menuItems = [
    { href: '/', label: 'HOME' },
    { href: '/tools/your-new-tool/', label: 'NEW TOOL' },
    // Add more items here
];
```

**Changes will automatically apply to all tools!**

## 🎯 Benefits

1. **Consistency**: Same design and behavior across all tools
2. **DRY Principle**: Edit once, apply everywhere
3. **Easy Maintenance**: Single source of truth
4. **Accessibility**: Proper keyboard navigation and aria labels

## 🐛 Troubleshooting

### Menu not appearing in HTML tool
- Check that `/shared/nav-menu.css` link is in `<head>`
- Check that `/shared/nav-menu.js` script is before `</body>`
- Check browser console for errors

### Menu not appearing in React tool
- Check import path is correct: `'../../../shared/ui-components/NavMenu'`
- Ensure component is rendered: `<NavMenu />`
- Check React console for errors

### Styling conflicts
- The nav menu uses `z-index: 1001` and `1002`
- Ensure your content doesn't have higher z-index values
- The menu is fixed position, not absolute

### Click events not working
- Make sure you're not preventing event propagation elsewhere
- Check that no overlays are blocking clicks

## 📝 Example: Adding a New Tool

Let's say you want to add "Image Glitcher" to the menu:

**Step 1:** Edit `/shared/nav-menu.js` (for HTML tools):
```javascript
<a href="/tools/image-glitcher/" class="nav-link">IMAGE GLITCHER</a>
```

**Step 2:** Edit `/shared/ui-components/NavMenu.tsx` (for React tools):
```typescript
{ href: '/tools/image-glitcher/', label: 'IMAGE GLITCHER' },
```

**Done!** All 4 tools now have the new menu item.

## 🔄 Migration Status

✅ **Migrated to shared nav:**
- Shader Playground (HTML)
- Wave Visualizer (HTML)
- ASCII Art (React)
- Code-to-MP4 (React)

❌ **Old NavDropdown components (now unused):**
- `/tools/ascii-art/src/components/NavDropdown.tsx`
- `/tools/code-to-mp4/src/components/NavDropdown.tsx`

These can be safely deleted as they're no longer imported.

## 🎨 Customization

The nav menu inherits the VT323 font and green CRT aesthetic. To customize:

**Colors:** Edit `/shared/nav-menu.css`:
```css
.nav-toggle {
    border: 2px solid #0f0;  /* Change color here */
    color: #0f0;
}
```

**Size:** Edit button dimensions:
```css
.nav-toggle {
    width: 50px;   /* Change size */
    height: 50px;
}
```

**Position:** Edit fixed positioning:
```css
.nav-dropdown {
    top: 20px;    /* Change position */
    left: 20px;
}
```

## 🚀 Future Improvements

Potential enhancements:
- Add keyboard shortcuts (Escape to close, arrows to navigate)
- Add active page highlighting
- Add tool icons next to labels
- Add breadcrumb navigation
- Add search/filter for tools
- Add recently used tools section

---

**Last Updated:** October 2025  
**Maintained by:** Tinkerium Team
