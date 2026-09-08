This technical specification outlines the complete architecture, state strategy, and zero-runtime build pipeline for a cross-platform LTR/RTL layout engine targeting Web and React Native.

## 1. Core Architecture & Guiding Principles

* **Zero Context-Switching:** Consumers and maintainers author styles using standard CSS properties (physical or logical) and standard `CSSProperties` objects across both platforms.
* **Zero Runtime Tax:** All property translation and AST normalization occur ahead-of-time (AOT) via build-time plugins, eliminating runtime performance overhead.
* **Declarative Direction Control:** Layout direction is managed strictly via top-level React Context, isolating platform-specific execution mechanics (DOM attributes vs. Yoga engine configs).

---

## 2. Direction & State Layer (`SafeAreaProvider`)

A single, unified `<SafeAreaProvider>` acts as the root context provider for direction management across both platforms.

### Web Execution (SSR-Safe & Portal-Friendly)

* Accepts an `initialDirection` prop derived from SSR request headers or cookies.
* During SSR and client mounting, applies the `dir="rtl" | "ltr"` attribute directly to `document.body`.
* Placing `dir` on `document.body` guarantees that all Web Portals (modals, tooltips, overlays) inherit direction automatically without manual context propagation or hydration mismatches.

### Native Execution (React Native / Yoga)

* Wraps React Native's `I18nManager` inside the same declarative React Context.
* Syncs direction changes to `I18nManager.allowRTL()` and `I18nManager.forceRTL()`, isolating process-level native behaviors behind the declarative React interface.

---

## 3. Zero-Runtime Build Engine Pipeline

The compilation engine (SWC/Babel plugin for JS/TSX, PostCSS for CSS Modules) normalizes authoring syntax into target-native layout primitives at build time.

### Web Target Compilation

* Intercepts `sx` props, inline `style` objects, and CSS Modules.
* Converts physical physical declarations (`left`, `marginRight`) into CSS logical properties (`inset-inline-start`, `margin-inline-end`).
* **Runtime Behavior:** Zero JavaScript calculations. The browser layout engine handles dynamic LTR/RTL reflows automatically when `dir` on `document.body` changes.

### Native Target Compilation

* Intercepts JavaScript style objects, `CSSProperties`, and compiled CSS Modules.
* Normalizes both physical and CSS logical inputs into React Native Yoga engine properties (`start`, `end`, `marginStart`, `marginEnd`).

---

## 4. Property Mapping Matrix

| Authoring Input (Physical or Logical) | Web Target Output (CSS Logical) | React Native Target Output (Yoga Primitives) |
| --- | --- | --- |
| `left` / `insetInlineStart` | `inset-inline-start` | `start` |
| `right` / `insetInlineEnd` | `inset-inline-end` | `end` |
| `marginLeft` / `marginInlineStart` | `margin-inline-start` | `marginStart` |
| `marginRight` / `marginInlineEnd` | `margin-inline-end` | `marginEnd` |
| `paddingLeft` / `paddingInlineStart` | `padding-inline-start` | `paddingStart` |
| `paddingRight` / `paddingInlineEnd` | `padding-inline-end` | `paddingEnd` |
| `borderLeft` / `borderStartWidth` | `border-inline-start` | `borderStartWidth` |
| `borderRight` / `borderEndWidth` | `border-inline-end` | `borderEndWidth` |

---

## 5. Consumer Experience & Authoring Workflow

1. **Root Setup:** The consumer wraps their application in `<SafeAreaProvider initialDirection="ltr">`.
2. **Authoring Rules:** Consumers author components using standard CSS properties or `CSSProperties` objects without restriction or enforced lint rules.
3. **Build Processing:** The build tool transforms code into browser-native CSS logical properties for Web or Yoga-native layout keys for React Native.
4. **Execution:** Toggling the direction prop on `<SafeAreaProvider>` updates `document.body` on Web or `I18nManager` on Native, triggering immediate layout flips across all components and portals.
