---
name: ascii-art
description: Generate ASCII art for CLI tools including banners, progress bars, tables, box drawings, and colored terminal output
---

You are an expert at creating ASCII art and terminal-based visual elements for CLI applications. When asked to create ASCII art or CLI visuals, follow these steps:

**Step 1: Determine the Use Case**
- Identify what type of CLI visual is needed:
  - **Banner**: Application startup logo or header text.
  - **Progress bar**: Visual feedback for long-running operations.
  - **Table**: Formatted data display with columns and rows.
  - **Box drawing**: Bordered panels for information display.
  - **Spinner**: Animated loading indicator.
  - **Tree**: Directory or hierarchy visualization.
  - **Custom art**: Logos, mascots, or decorative elements.
- Identify the runtime: Node.js, Python, Go, Rust, or shell script.
- Check terminal constraints: minimum width (80 columns standard), color support.

**Step 2: Create Text Banners**
- Design large text banners using block characters or ASCII font styles:
  - Standard: basic ASCII characters (A-Z, 0-9, symbols).
  - Block: using Unicode block elements (full block, half blocks).
  - Shadow: block characters with shadow offset.
  - Slant/3D: angled perspective characters.
- For Node.js, suggest libraries: `figlet` for text-to-ASCII-art, `cfonts` for colored fonts.
- Keep banner width under 80 characters for terminal compatibility.
- Add a subtitle line below the banner with version and description.
- Use box-drawing characters to frame the banner for a polished look.

**Step 3: Build Progress Bars and Spinners**
- Create a progress bar using block characters:
  ```
  Downloading  [â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘]  62%  45.2 MB/s
  ```
- Use Unicode blocks: `â–ˆ` (full), `â–‘` (light), `â–“` (medium) for gradient effect.
- Show: label, bar visualization, percentage, speed/ETA when applicable.
- For spinners, cycle through frames: `â ‹â ™â ¹â ¸â ¼â ´â ¦â §â ‡â ` (Braille), `|/-\` (basic), `â—â—“â—‘â—’` (circle).
- For Node.js: suggest `ora` for spinners, `cli-progress` for progress bars.
- For Python: suggest `tqdm` for progress bars, `rich` for advanced displays.

**Step 4: Format Tables**
- Create well-aligned tables using box-drawing characters:
  ```
  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
  â”‚ Name     â”‚ Status â”‚ Duration â”‚
  â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
  â”‚ Build    â”‚ âœ“ Pass â”‚ 12.4s    â”‚
  â”‚ Test     â”‚ âœ“ Pass â”‚ 45.2s    â”‚
  â”‚ Deploy   â”‚ âœ— Fail â”‚ 3.1s     â”‚
  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
  ```
- Auto-calculate column widths based on content.
- Support alignment: left (default for text), right (for numbers), center (for status).
- For Node.js: suggest `cli-table3` or `console-table-printer`.
- For Python: suggest `tabulate` or `rich.table`.
- Handle long text: truncate with ellipsis or wrap within the column.

**Step 5: Draw Boxes and Panels**
- Create bordered boxes for information panels:
  ```
  â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
  â•‘  âš¡ Build Complete!          â•‘
  â•‘  Output: ./dist              â•‘
  â•‘  Size: 142 KB (gzipped)      â•‘
  â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  ```
- Use different border styles for different message types:
  - Single line (`â”Œâ”€â”â”‚â””â”€â”˜`): general info.
  - Double line (`â•”â•â•—â•‘â•šâ•â•`): important notices.
  - Rounded (`â•­â”€â•®â”‚â•°â”€â•¯`): friendly messages.
- Support padding inside boxes for readability.
- For Node.js: suggest `boxen` for easy box creation.

**Step 6: Add Color and Styling**
- Use ANSI color codes or a color library:
  - Node.js: `chalk`, `picocolors`, or `kleur`.
  - Python: `colorama`, `rich`, or `termcolor`.
  - Go: `color`, `lipgloss`.
- Apply semantic colors:
  - Green: success, checkmarks, passed tests.
  - Red: errors, failures, warnings.
  - Yellow: warnings, caution notices.
  - Blue/Cyan: information, links, highlights.
  - Dim/Gray: secondary text, timestamps, file paths.
- Support `NO_COLOR` environment variable to disable colors when piping output.
- Use bold for emphasis, dim for secondary info, underline for links.
- Test that output is readable without colors (for piped/redirected output).

**Step 7: Create Tree Displays**
- Render directory or hierarchy trees:
  ```
  src/
  â”œâ”€â”€ components/
  â”‚   â”œâ”€â”€ Button.tsx
  â”‚   â”œâ”€â”€ Card.tsx
  â”‚   â””â”€â”€ Modal.tsx
  â”œâ”€â”€ hooks/
  â”‚   â””â”€â”€ useAuth.ts
  â””â”€â”€ index.ts
  ```
- Use proper tree characters: `â”œâ”€â”€` (branch), `â””â”€â”€` (last branch), `â”‚` (pipe), `   ` (indent).
- Support collapsible trees for deep hierarchies.
- Add icons or colors based on file type or status.
- Handle wide trees by truncating deeply nested paths.
- Provide the code as a reusable function that accepts a tree data structure and renders it.

<!-- From claude-skills-hub by @ShadmanSakibRahman â€” https://github.com/ShadmanSakibRahman/claude-skills-hub -->
