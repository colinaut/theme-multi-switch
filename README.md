# Theme Multi Switch Web Component

I created this three way switch for setting theme as I couldn't find what I was looking for — most are two way switches and I wanted to allow for auto. So I built a three way switch which defaults to "auto" (for browser prefers-color-scheme) and allows "light" or "dark" for overriding prefers-color-scheme. I quickly realized that I could just as easily make it work with multiple themes!

Check out the [Demo Page](https://colinaut.github.io/theme-multi-switch/)

When switch is triggered it:

*   Adds current theme to data-theme attribute on the html element.
*   Stores the current theme in localStorage under "theme" — _component checks for this on reload to set current theme state_.
*   Triggers a "theme-switch" custom event with the current theme as detail. _This will automatically update any other theme-switch components on the page._
*   Optionally, updates meta theme-color using the "meta-color" prop. _This requires that the meta-colors prop is set and that the meta theme-color is included in your html._

You can also trigger the switch externally by either changing the "theme" prop or dispatching a "theme-switch" event with the theme in the detail.

If desired the theme names can be modified from their defaults via props.

## Installation

Add the theme-multi-switch.js script to your project. Then add the component `<theme-switch></theme-switch>` to your html.

### CDN

```
<script src="https://unpkg.com/@colinaut/theme-multi-switch/dist/theme-multi-switch.js"></script>
```

For best results, add this to your `<head>` without defer so that it is render blocking. This avoids [Flash of inAccurate coloR Theme (FART)](https://css-tricks.com/flash-of-inaccurate-color-theme-fart/).

### NPM/PNPM/YARN

```
npm i @colinaut/theme-multi-switch

pnpm i @colinaut/theme-multi-switch

yarn add @colinaut/theme-multi-switch

```

### Eleventy static site

If you are using [Eleventy](https://www.11ty.dev), and want to install locally rather than rely on the CDN, you can install via NPM/PNPM/YARN and then pass through the js file so that it is included in the output. Then you would just need to add it to the head.

```
eleventyConfig.addPassthroughCopy({
    "node_modules/@colinaut/theme-multi-switch/dist/theme-multi-switch.js": "js/theme-multi-switch.js",
})
```
```
<script src="/js/theme-multi-switch.js"></script>
```

## Modifying

Sizing uses em so it can be resized by changing the css font-size. Base color for text, knob, and track border uses currentColor so it will update if you change the body text color.

Further restyling is possible via slots, parts, and css variables. Properties allows changing defaults and values for changing meta theme-color.

### Default Slots

*   light
*   auto
*   dark

_Slots are dynamically named after the theme names._

### Default Parts

*   light
*   auto
*   dark
*   track
*   knob

_Label Parts are dynamically named after the theme names._

### CSS Variables

*   \--theme-switch-knob `background: var(--theme-switch-knob, currentColor);`
*   \--theme-switch-track `background: var(--theme-switch-track, #88888822);`
*   \--theme-switch-track-border `border: 0.1em solid var(--theme-switch-border, currentColor);`
*   \--theme-switch-highlight `color: var(--theme-switch-highlight, inherit);`
*   \--theme-switch-knob-width `width: calc(var(--theme-switch-knob-width, 1) * 1em);`

### Properties

*   themes = "light,auto,dark"
*   theme = defaults to themes[1]
*   meta-colors = ""
*   layout = "around top"

_themes and meta-colors accepts either a comma separated string or a stringified JSON array_

_layout can be either "around top", "around bottom", or just "top" or "bottom"_

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
[data-theme="light"] {
    --header: var(--header-light);
    --body: var(--body-light);
    --bg: var(--bg-light);
    --theme-switch-track: var(--track-light);
    --theme-switch-highlight: var(--highlight-light);
}

/\* Dark Mode Override \*/

[data-theme="dark"] {
    --header: var(--header-dark);
    --body: var(--body-dark);
    --bg: var(--bg-dark);
    --theme-switch-track: var(--track-dark);
    --theme-switch-highlight: var(--highlight-dark);
}

/\* Automatic Dark Mode \*/

@media (prefers-color-scheme: dark) {
    :root {
        --header: var(--header-dark);
        --body: var(--body-dark);
        --bg: var(--bg-dark);
        --theme-switch-track: var(--track-dark);
        --theme-switch-highlight: var(--highlight-dark);
    }
}
```