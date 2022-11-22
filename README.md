# Theme 3way Switch Web Component

I created this theme switch as I couldn't find what I was looking for. So I built this 3way switch which defaults to "auto" (for browser prefers-color-scheme) and allows "light" or "dark" for overriding prefers-color-scheme. 

Super small! 3.80 KiB / gzip: 1.47 KiB

When switched is triggered it:

*   Adds current theme to data-theme attribute on the html element.
*   Stores the current theme in localStorage under "theme" — _component checks for this on reload to set current theme state_.
*   Triggers a "theme-switch" custom event with the current theme as detail.
*   Optionally, updates meta theme-color using the "meta" props.

If desired the theme names can be modified from their defaults via props. 

## Installation

Add the theme-3way-switch.js script to your project. Then add the component `<theme-switch></theme-switch>` to your html.

### CDN

```
<script src="https://unpkg.com/@colinaut/theme-3way-switch@1/dist/theme-3way-switch.js"></script>
```

For best results, add this to your `<head>` without defer so that it is render blocking. This avoids [Flash of inAccurate coloR Theme (FART)](https://css-tricks.com/flash-of-inaccurate-color-theme-fart/).

### NPM/PNPM/YARN

```
npm i @colinaut/theme-3way-switch

pnpm i @colinaut/theme-3way-switch

yarn add @colinaut/theme-3way-switch

```

### Eleventy static site

If you are using [Eleventy](https://www.11ty.dev), and want to install locally rather than rely on the CDN, you can install via NPM/PNPM/YARN and then pass through the js file so that it is included in the output. Then you would just need to add it to the head.

```
eleventyConfig.addPassthroughCopy({
    "node_modules/@colinaut/theme-3way-switch/dist/theme-3way-switch.js": "js/theme-3way-switch.js",
})
```
```
<script src="/js/theme-3way-switch.js"></script>
```

## Modifying

Sizing uses em so it can be resized by changing the css font-size. Base color for text, knob, and track border uses currentColor so it will update if you change the body text color.

Further restyling is possible via slots, parts, and css variables. Properties allows changing defaults and values for changing meta theme-color.

### Slots

*   left
*   mid
*   right

### Parts

*   left
*   mid
*   right
*   track
*   knob

### CSS Color Variables

*   \--theme-switch-knob `background: var(--theme-switch-knob, currentColor);`
*   \--theme-switch-track `background: var(--theme-switch-track, #88888822);`
*   \--theme-switch-track-border `border: 0.1em solid var(--theme-switch-border, currentColor);`
*   \--theme-switch-highlight `color: var(--theme-switch-highlight, inherit);`

### Properties

*   left = "light"
*   mid = "auto"
*   right = "dark"
*   theme = mid
*   meta-left = ""
*   meta-mid = ""
*   meta-right = ""

## Example Auto/Light/Dark CSS

```
/\* Values for light and dark \*/

:root {
    --header-light: rgb(95, 0, 0);
    --body-light: rgb(45, 45, 65);
    --bg-light: rgb(225, 225, 225);
    --track-light: rgb(205 195 165 /0.8);
    --highlight-light: rgb(155, 50, 0);

    --header-dark: rgb(250, 180, 120);
    --body-dark: rgb(225, 225, 225);
    --bg-dark: rgb(45, 45, 65);
    --track-dark: rgb(105 85 55 /0.6);
    --highlight-dark: rgb(225, 120, 100);
}

/\* Automatic Light Mode; Light Mode Override \*/

:root,
:root\[data-theme="light"\] {
    --header: var(--header-light);
    --body: var(--body-light);
    --bg: var(--bg-light);
    --track: var(--track-light);
    --highlight: var(--highlight-light);
}

/\* Dark Mode Override \*/

:root\[data-theme="dark"\] {
    --header: var(--header-dark);
    --body: var(--body-dark);
    --bg: var(--bg-dark);
    --track: var(--track-dark);
    --highlight: var(--highlight-dark);
}

/\* Automatic Dark Mode \*/

@media (prefers-color-scheme: dark) {
    :root {
        --header: var(--header-dark);
        --body: var(--body-dark);
        --bg: var(--bg-dark);
        --track: var(--track-dark);
        --highlight: var(--highlight-dark);
    }
}
```