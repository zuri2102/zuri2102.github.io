# Personal Website

A retro, static personal website built with plain HTML, CSS, and Vanilla JavaScript. No build steps or frameworks required. Perfect for hosting on GitHub Pages.

## How to Edit This Site

### 1. Changing Colors and Fonts
All colors, font families, and interaction timings are centralized in **`css/variables.css`**. 
- To change the green nav bar color, edit `--color-green`.
- To change the body text font, edit `--font-body`. 
- No need to hunt through CSS files to change a hex code; update the root variables.

### 2. Moving the Home Page Pokémon Sprites
Open **`js/config.js`**. You will see a `sprites` object with settings for `purrloin`, `meowth`, and `skitty`. 
Adjust the `top`, `left`, `bottom`, and `right` properties (using px or %) to easily move them around the splash graphic.

### 3. Adding a New Project Cartridge
Open **`data/projects.json`**. Add a new object to the array following the existing format:
```json
{
  "id": "my-new-project",
  "title": "Project Title",
  "summary": "A short summary for the cartridge.",
  "tags": ["HTML", "CSS"],
  "content": "<p>This is the full rich text content for the individual project page. You can include paragraphs and <img src='path/to/img.png'> tags here.</p>"
}
```
The Projects grid will automatically expand, and the individual project page will automatically populate.

### 4. Adding a New About Page Block
Open **`data/about.json`**. Add a new object to the array. There are two supported types: `text` and `code`.
```json
{
  "type": "text",
  "title": "Optional Heading",
  "content": "Your body text here. You can insert inline sprites using <img class='sprite-inline sprite-bw' src='...'>"
}
```
Or for a YAML-style code block (line numbers are auto-generated):
```json
{
  "type": "code",
  "content": "key: value\nskill: 99\nexample: true"
}
```

## Deployment
Simply push this entire directory to a GitHub repository, and enable GitHub Pages on the `main` branch (from the root folder). Everything will work out of the box.
