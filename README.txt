BOOGSH WEBSITE V2
==================

This revision adds:
- Realistic sticker objects based on the uploaded sticker reference image.
- 36 floating stickers using individual transparent PNG crops.
- Draggable stickers.
- Floating/moving sticker animations.
- Clickable sticker sparkle effects.
- 3 old-Windows-style draggable message/pop-up windows.
- A draggable message modal.
- 30 photo slots.
- Group blog layout, guestbook, playlist, search and old desktop UI.

FILES
-----
index.html
style.css
script.js

images/
  photo-01.svg ... photo-30.svg

stickers/
  reference-sticker-sheet.png
  cd.png
  guitar.png
  vinyl.png
  camera.png
  phone.png
  star.png
  player.png
  boombox.png
  question.png
  parental.png
  note.png
  sunglasses.png
  bigstar.png

PHOTO SLOTS
-----------
Replace the SVG placeholders by adding your own JPG/PNG files using:
photo-01.jpg
photo-02.jpg
...
photo-30.jpg

The HTML/JS already points to these JPG names.

OPEN IN VS CODE
---------------
1. Extract the ZIP.
2. Open boogsh_website_v2 in VS Code.
3. Install/use Live Server.
4. Right-click index.html > Open with Live Server.

CUSTOMIZE
---------
- Colors, layout and sticker sizes: style.css
- Text, sections and popup positions: index.html
- Sticker types, positions and interactions: script.js
- Replace sticker artwork in stickers/ if you want to use your own assets.

The guestbook is browser-only and uses localStorage. It does not send messages to an online server.
![Alternative text description](path-to-your-image.jpg)
