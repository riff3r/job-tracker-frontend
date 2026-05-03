---
name: Job Tracker Design System
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#464555'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e5e2e1'
  on-secondary-container: '#656464'
  tertiary: '#7e3000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c9c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  title:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.02em
  subheading:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: -0.01em
  body:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  label:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  sidebar_width: 240px
  container_max_width: 1200px
  gutter: 16px
  page_padding: 32px
  stack_gap: 8px
---

## Brand & Style

This design system is rooted in **Minimalism** and **Modern Corporate** aesthetics, heavily inspired by the utilitarian elegance of Linear and Notion. The brand personality is efficient, focused, and high-utility, designed to reduce the cognitive load of the job search process.

The interface prioritizes information density without sacrificing clarity, using ample whitespace and a disciplined color palette to create a "workspace" feel rather than a "social" feel. The emotional response is one of organized productivity and calm control.

## Colors

The palette is anchored by a neutral off-white background to minimize screen glare during long sessions. The primary indigo accent is used sparingly for primary actions and focus states.

Status indicators use a semantic "Soft Pill" approach. Each status color should be implemented as a high-chroma text color on a 10% opacity background of the same hue to ensure readability while maintaining the minimalist vibe.

## Typography

This design system utilizes **Inter** for its neutral, systematic qualities that excel in data-heavy SaaS environments. 

Typography follows a strict hierarchy: Titles are bold and slightly condensed in letter-spacing for a modern look. The 14px body size ensures high information density, while the 12px labels are reserved for secondary metadata and pill text. All text should use `#0A0A0A` for primary content and a 60% opacity variant for secondary descriptions.

## Layout & Spacing

The layout employs a **fixed-fluid hybrid model**. A static **240px sidebar** sits on the left, housing navigation and workspace filters. The main content area uses a fluid grid with a maximum width of 1200px to prevent line lengths from becoming unreadable on ultra-wide monitors.

Spacing follows an 8px rhythmic scale. Components are separated by 16px or 24px margins, while internal element padding (like within a card) stays consistently at 16px.

## Elevation & Depth

In alignment with the "Linear vibe," this design system avoids heavy shadows. Depth is communicated through **low-contrast outlines** and **tonal layers**:

1.  **Level 0 (Base):** The off-white `#FAFAFA` background.
2.  **Level 1 (Surface):** White `#FFFFFF` cards and surfaces, defined by a 1px solid `#E5E5E5` border.
3.  **Level 2 (Interaction):** On hover, surfaces may receive a very soft, diffused shadow (0px 4px 12px rgba(0,0,0,0.03)) or a subtle grey background shift to `#F4F4F5`.

Modal overlays use a subtle backdrop blur (8px) to maintain context without visual noise.

## Shapes

The shape language is defined by a consistent **12px radius** for all container elements, including cards, input fields, and modals. This "Rounded" approach softens the technical nature of the grid. 

Smaller elements like buttons use the same 12px radius, while status badges use a "Full Pill" (999px) radius to distinguish them as non-interactive or decorative metadata.

## Components

### Buttons
- **Primary:** Deep indigo background, white text, 12px corners.
- **Secondary:** White background, 1px `#E5E5E5` border, dark text.
- **Ghost:** No background or border; text only. Used for sidebar items.

### Status Badges (Pills)
Soft-filled pills with a 999px radius. They must use the specific color tokens defined in the Colors section. Text is semi-bold and 12px.

### Inputs & Selects
1px `#E5E5E5` border with 12px rounded corners. Focus state triggers a 1px indigo border with a 2px soft indigo outer glow (30% opacity).

### Cards
White background, 1px `#E5E5E5` border, 12px corners. No shadow in the default state. Used for individual job applications in the Kanban or List view.

### Sidebar
The sidebar should have a slight background contrast (use a very light grey or stick to `#FAFAFA` with a right-hand border). Navigation items should have a 12px hover state highlight.
