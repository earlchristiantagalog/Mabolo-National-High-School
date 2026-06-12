# Quick Reference: Responsive Design Patterns

## Common Responsive Patterns Used

### 1. Responsive Header (Copy-Paste Template)
```jsx
<header className="sticky top-0 z-50 border-b-4 border-[#8B1010]">
  <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
    <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
      {/* Logo */}
      <Image
        src="/logo.png"
        alt="Logo"
        width={48}
        height={48}
        className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16"
      />
      
      {/* Desktop Nav */}
      <nav className="hidden lg:flex gap-0.5">
        {/* nav items */}
      </nav>
      
      {/* Mobile Menu Button */}
      <button className="lg:hidden p-2">
        {/* icon */}
      </button>
    </div>
  </div>
</header>
```

### 2. Responsive Section (Copy-Paste Template)
```jsx
<section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-white">
  <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
    {/* Section content */}
  </div>
</section>
```

### 3. Responsive Grid - 4 Columns to 1
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
  {items.map(item => (
    <div key={item.id} className="bg-white p-4 sm:p-5 lg:p-6 rounded border">
      {/* Card content */}
    </div>
  ))}
</div>
```

### 4. Responsive Grid - 3 Columns to 1
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
  {items.map(item => (
    <div key={item.id}>{/* content */}</div>
  ))}
</div>
```

### 5. Responsive Typography
```jsx
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
  Heading
</h1>

<p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600">
  Paragraph
</p>

<span className="text-[10px] sm:text-xs lg:text-sm">
  Small text
</span>
```

### 6. Responsive Spacing
```jsx
{/* Padding */}
<div className="p-4 sm:p-5 lg:p-8">padding</div>
<div className="px-3 sm:px-4 lg:px-8">horizontal padding</div>
<div className="py-8 sm:py-12 lg:py-16">vertical padding</div>

{/* Margins */}
<div className="m-4 sm:m-6 lg:m-8">margin</div>

{/* Gaps */}
<div className="flex gap-3 sm:gap-4 lg:gap-6">items with gap</div>
```

### 7. Responsive Button
```jsx
<button className="px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 
                   text-xs sm:text-sm lg:text-base
                   rounded transition-colors">
  Button Text
</button>
```

### 8. Responsive Icon Container
```jsx
<div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12
                flex items-center justify-center
                bg-[color]/10 rounded-full">
  <span className="text-sm sm:text-base">{icon}</span>
</div>
```

### 9. Responsive Hero Section
```jsx
<section className="relative 
                   min-h-[300px] sm:min-h-[400px] lg:min-h-[520px]
                   bg-cover bg-center flex items-center
                   py-8 sm:py-12 lg:py-0">
  <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
    {/* content */}
  </div>
</section>
```

### 10. Responsive Footer
```jsx
<footer className="bg-[#2d2d2d]">
  <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-10 lg:py-12">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
      {/* footer sections */}
    </div>
  </div>
</footer>
```

---

## Breakpoint Cheat Sheet

```
Mobile First Approach:
┌─────────────────────────────────────────────────────────┐
│ Base Style (Mobile < 640px)                             │
├─────────────────────────────────────────────────────────┤
│ sm:  → 640px (Small tablets)                            │
├─────────────────────────────────────────────────────────┤
│ md:  → 768px (Medium tablets)                           │
├─────────────────────────────────────────────────────────┤
│ lg:  → 1024px (Large tablets, desktops)                 │
├─────────────────────────────────────────────────────────┤
│ xl:  → 1280px (Large desktops)                          │
└─────────────────────────────────────────────────────────┘
```

---

## Common Values Reference

### Padding/Margin Scale:
- `p-1` = 4px
- `p-2` = 8px
- `p-3` = 12px
- `p-4` = 16px
- `p-5` = 20px
- `p-6` = 24px
- `p-8` = 32px

### Gap Scale:
- `gap-3` = 12px
- `gap-4` = 16px
- `gap-5` = 20px
- `gap-6` = 24px

### Font Sizes:
- `text-[10px]` = 10px
- `text-xs` = 12px
- `text-sm` = 14px
- `text-base` = 16px
- `text-lg` = 18px
- `text-2xl` = 24px
- `text-3xl` = 30px
- `text-4xl` = 36px
- `text-5xl` = 48px

### Heights:
- `h-8` = 32px
- `h-10` = 40px
- `h-12` = 48px
- `h-16` = 64px
- `h-20` = 80px
- `h-24` = 96px

---

## Don't Forget!

✅ **Always include:**
- `max-w-7xl mx-auto` for container
- Responsive padding: `px-3 sm:px-4 lg:px-8`
- Responsive gap/spacing at each breakpoint
- Proper text sizing scale

❌ **Never use:**
- Fixed widths (use flex/grid instead)
- Single breakpoint classes (e.g., only `lg:`)
- Hardcoded font sizes (scale them)
- Inconsistent spacing patterns

---

## Testing with DevTools

1. Open Chrome DevTools
2. Click device toolbar icon (Ctrl+Shift+M)
3. Test at these widths:
   - **Mobile:** 375px
   - **Tablet:** 768px
   - **Desktop:** 1440px

4. Check:
   - ✓ Text is readable
   - ✓ No horizontal scroll
   - ✓ Images scale
   - ✓ Buttons are touchable (44px+)
   - ✓ Spacing looks balanced

---

## Real Device Sizes

| Device | Width | Breakpoint |
|--------|-------|-----------|
| iPhone SE | 375px | Mobile |
| iPhone 12 | 390px | Mobile |
| iPhone 14 | 430px | Mobile |
| iPad Mini | 768px | sm:/md: |
| iPad Air | 820px | md:/lg: |
| MacBook Air | 1440px | lg: |

---

## Quick Wins

Apply these to fix most responsive issues:

```jsx
// ✓ DO THIS:
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

// ✗ NOT THIS:
<div className="grid md:grid-cols-4 gap-6">


// ✓ DO THIS:
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Title</h1>

// ✗ NOT THIS:
<h1 className="text-3xl font-bold">Title</h1>


// ✓ DO THIS:
<button className="px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm">
  Click
</button>

// ✗ NOT THIS:
<button className="px-6 py-3 text-sm">Click</button>
```

---

Created: June 11, 2026 | Version: 1.0
