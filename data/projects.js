const siteProjects = [
{
  "id": "huawei-ipod",
  "title": "Candybar iPod",
  "subheading": "Personal Project",
  "summary": "Huawei u2800a <br>+ custom PCB <br> -> MP3-player! <br>Tune along... <br>(ba dum tss) <br><a href=\"https://pokemondb.net/pokedex/chatot\"><img src=\"https://img.pokemondb.net/sprites/black-white/anim/normal/chatot.gif\" alt=\"Chatot\" style=\"filter: grayscale(100%);\"></a>",
  "tags": ["KiCAD", "ESP32", "IN PROGRESS"],
  "content": [
    "<p>A friend found this Huawei U2800A in an e-waste recycling spot and gave it to me!</p>",
    "<p>I like the look and the clicky buttons, and it would be nice to have an offline music player for long plane rides but with specific features I find important. But maybe the real goal is to look cool listening to music&hellip;</p>",
    "<img src='assets/projects/mp3/seal.jpeg' alt='Huawei U2800A donor phone' style='display:block;margin:0 auto;'>",

    "<br>",
    "<h1 style=\"color:#ff4c00;\">CONSTRAINTS</h1>",
    "<ul>",
    "  <li>Space is limited by the existing phone's footprint and hardware</li>",
    "  <li>Button placement is predetermined by the keypad</li>",
    "</ul>",

    "<br>",
    "<h1 style=\"color:#ff4c00;\">OVERALL DESIGN PLAN</h1>",
    "<ul>",
    "  <li>microSD card storage for offline MP3 playback</li>",
    "  <li>WiFi syncs what's stored on the phone with my Spotify playlists — no need to open the phone and remove the microSD card!</li>",
    "  <li>Probably will eventually make a partner app, as Spotify's API is not very generous&hellip; thinking of scanning the titles in a playlist and downloading those separately, either from YouTube (yt-dlp) or other online sources</li>",
    "  <li>3.5mm headphone jack — I like having the wired earbuds option. I guess I could use USB-C earbuds, but I already have some that are barrel jacks</li>",
    "  <li>Bluetooth support for wireless earbuds</li>",
    "  <li>Small TFT screen for UI</li>",
    "  <li>Reusing the phone's keypad for inputs with a button matrix</li>",
    "  <li>Swapping to USB-C charging + software-controlled powering</li>",
    "</ul>",

    "<br>",
    "<h1 style=\"color:#ff4c00;\">MCU</h1>",
    "<p>Originally, this project was planned around the ESP32-S3, mostly for its native USB and smaller SiP packaging options. However, it turns out that the S3 only has BLE &mdash; no Classic Bluetooth &mdash; and Classic BT is what A2DP (actual audio streaming to earbuds) needs.</p>",
    "<p>I switched to an ESP32-WROOM-32E, which has Classic BT, BLE, and WiFi all in one chip. The tradeoff is that this ESP32 doesn't come with native USB. However, I decided to bridge that using a CH340C USB to UART bridge IC, which I believe is a fair tradeoff for built-in BT Classic.</p>",
    "<p>There was also the option of using the ESP32-S3 with an external Bluetooth module that enables Classic BT, but I didn't see enough benefit in doing that and dealing with its complexities over using a USB to UART bridge.</p>",

    "<br>",
    "<h1 style=\"color:#ff4c00;\">OVERALL PCB ARCHITECTURE</h1>",
    "<ol>",
    "  <li>Power</li>",
    "  <li>MCU</li>",
    "  <li>Storage</li>",
    "  <li>TFT Screen</li>",
    "  <li>Audio Out</li>",
    "  <li>Keypad</li>",
    "</ol>",

    "<br>",
    "<h1 style=\"color:#c3ded6;text-decoration:underline;\">1. POWER</h1>",
    "<img src='assets/projects/mp3/power.png' alt='Power management schematic' style='display:block;margin:0 auto;'>",

    "<br>",
    "<h2 style=\"color:#ff4c00;\">GETTING POWER IN</h2>",
    "<ul>",
    "  <li>USB-C input, with 5.1k pull-downs on CC1/CC2 &mdash; needed or most chargers won't supply current at all</li>",
    "</ul>",

    "<br>",
    "<h2 style=\"color:#ff4c00;\">CHARGING</h2>",
    "<ul>",
    "  <li>MCP73831-2-OT, regulating to 4.2V</li>",
    "  <li>Went with the SOT-23-5 package (not the DFN version) so I can actually hand-solder it</li>",
    "  <li>Fast-charge current set via a single PROG resistor, sized around 0.5C</li>",
    "</ul>",

        "<br><img src='assets/projects/mp3/charging.png' alt='charging' style='display:block;margin:0 auto;'>",

    "<br>",
    "<h2 style=\"color:#ff4c00;\">3.3V RAIL</h2>",
    "<ul>",
    "  <li>AP2112K-3.3 LDO, chosen over the AMS1117 for its lower dropout &mdash; keeps the board running further into a discharged battery instead of browning out early</li>",
    "</ul>",
    "<br><img src='assets/projects/mp3/rail.png' alt='rail' style='display:block;margin:0 auto;'>",

    "<br>",
    "<h2 style=\"color:#ff4c00;\">SOFTWARE POWER SWITCH</h2>",
    "<ul>",
    "  <li>P-MOSFET between battery and everything downstream, held on by either a physical button or an ESP32 GPIO (through a diode so they don't fight each other)</li>",
    "  <li>Lets firmware hold the board on after boot and cut power cleanly on shutdown</li>",
    "</ul>",
    "<br><img src='assets/projects/mp3/reset.png' alt='reset' style='display:block;margin:0 auto;'>",


    "<br>",
    "<h2 style=\"color:#ff4c00;\">EXTRAS</h2>",
    "<ul>",
    "  <li>Charge-status LED also feeds a firmware-readable GPIO off the same node</li>",
    "  <li>Test points on the regulator's in/out for easier debugging later</li>",
    "</ul>",
    "<br><p><em>Thoughts:</em> I considered reusing the original Huawei battery, but its unknown health and odd connector pushed me toward a fresh JST-PH LiPo instead.</p>",

    "<br>",
    "<h1 style=\"color:#c3ded6;text-decoration:underline;\">2. MCU</h1>",

    "<br>",
    "<h2 style=\"color:#ff4c00;\">CHIP</h2>",
    "<ul>",
    "  <li>Started with the ESP32-S3, but it's BLE-only &mdash; no Classic Bluetooth, which A2DP audio streaming actually needs</li>",
    "  <li>Switched to a plain ESP32-WROOM-32E for native Classic BT + BLE + WiFi</li>",
    "  <li>Trade-off: no native USB anymore, so a CH340C handles flashing/serial</li>",
    "</ul>",

        "<br><img src='assets/projects/mp3/uart.png' alt='uart' style='display:block;margin:0 auto;'>",


    "<br>",
    "<h2 style=\"color:#ff4c00;\">FLASHING</h2>",
    "<ul>",
    "  <li>Auto-program circuit (two BC817s off the CH340's DTR/RTS) so no manual boot-button dance</li>",
    "</ul>",

    "<br>",
    "<h2 style=\"color:#ff4c00;\">PIN BUDGET</h2>",
    "<ul>",
    "  <li>Mapped every peripheral against usable GPIOs before wiring anything</li>",
    "  <li>Avoided the strapping pins (0/2/4/5/12/15)</li>",
    "  <li>Moved all 23 buttons onto I2C expanders, which freed up enough room for everything else to get its own dedicated pin, with one spare left</li>",
    "</ul>",
    "<br><p><em>Thoughts:</em> the S3-era plan included a separate Bluetooth audio module, since the S3 couldn't do A2DP alone. Not needed anymore now that the MCU handles Classic BT natively &mdash; planning to just use the ESP32's own radio.</p>",
        "<br><img src='assets/projects/mp3/esp32.png' alt='esp32' style='display:block;margin:0 auto;'>",

    "<br>",
    "<h1 style=\"color:#c3ded6;text-decoration:underline;\">3. STORAGE</h1>",
    "<ul>",
    "  <li>Running the SD card in SPI mode, not native 4-bit mode &mdash; less speed, but reuses hardware the chip already has</li>",
    "  <li>10k pull-ups on CMD and all four DAT lines per the SD Association spec, CLK excluded since it's always actively driven</li>",
    "  <li>The unused DAT1/DAT2 lines get a pull-up each and nothing else</li>",
    "</ul>",

            "<br><img src='assets/projects/mp3/sd.png' alt='sd' style='display:block;margin:0 auto;'>",

    "<br>",
    "<h1 style=\"color:#c3ded6;text-decoration:underline;\">4. TFT SCREEN &mdash; IN PROGRESS</h1>",
    "<ul>",
    "  <li>Shares the SPI bus with the SD card, separate chip-select</li>",
    "  <li>Backlight on a PWM pin for dimming</li>",
    "  <li>Reset line moved to an I2C expander pin &mdash; barely toggled, didn't need a dedicated GPIO</li>",
    "  <li>TBD: haven't picked the exact driver IC yet</li>",
    "</ul>",

    "<br>",
    "<h1 style=\"color:#c3ded6;text-decoration:underline;\">5. AUDIO OUT &mdash; NOT STARTED</h1>",
    "<ul>",
    "  <li>Plan: PCM5102A I2S DAC &rarr; headphone amp &rarr; 3.5mm jack, with a parallel tap for Bluetooth audio</li>",
    "</ul>",

    "<br>",
    "<h1 style=\"color:#c3ded6;text-decoration:underline;\">6. KEYPAD &mdash; NOT STARTED</h1>",
    "<ul>",
    "  <li>Plan: two MCP23017 I2C expanders, all 23 buttons wired directly with internal pull-ups &mdash; no matrix scanning needed once the expanders solved the pin budget</li>",
    "</ul>",
    "<br>",
    "<img src='assets/projects/mp3/wocover.png' alt='Huawei U2800A donor phone' style='display:block;margin:0 auto;'>",

  ].join("\n")
},
  {
    "id": "rislab",
    "title": "Research",
    "subheading": "Undergraduate Researcher",
    "summary": "Exploring Gaussian Splatting & SLAM optimization in UAVs <a href=\"https://pokemondb.net/pokedex/yanmega\"><img src=\"https://img.pokemondb.net/sprites/black-white/anim/normal/yanmega.gif\" alt=\"Yanmega\" style=\"filter: grayscale(100%);\"></a>",
    "tags": ["SLAM", "PyTorch", "CUDA", "CURRENT"],
    content: [
      "<p>Details coming soon..</p>",
      "<a href='https://github.com/zuri2102/vings_zy.git' target='_blank' rel='noopener noreferrer' style='color: #ff4c00;'>- GitHub</a>",
      "<img src='ref/404splash.png' alt='404 Splash Demo'>",
      "<br>",
      "<i style=\"color: #ff4c00;\">November 2025 - Present</i>",
      "<ul>",
      "  <li>TBD</li>",
      "</ul>"
    ].join("\n")
  },
  {
    "id": "tartan-auv",
    "title": "TartanAUV",
    "subheading": "Electrical Subteam Member",
    "summary": "Making boards and other odd jobs <a href=\"https://pokemondb.net/pokedex/wailord\"><img src=\"https://img.pokemondb.net/sprites/black-white/anim/normal/wailord.gif\" alt=\"Wailord\" style=\"filter: grayscale(100%);\"></a>",
    "tags": ["Altium", "PCBs", "CURRENT"],
    content: [
      "<p>Details coming soon..</p>",
      "<img src='assets/projects/tartan-auv/updog.jpeg' alt='updog PCB'>",
      "<br>",
      "<i style=\"color: #ff4c00;\">September 2025 - Present</i>",
      "<ul>",
      "  <li>TBD</li>",
      "</ul>",
      "<img src='assets/projects/tartan-auv/servopower.png' alt='TartanAUV PCB'>"
    ].join("\n")
  },


{
    "id": "honey-haven",
    "title": "HONEY HAVEN",
    "subheading": "Co-Lead & Programming Lead",
    "summary": "Psychological visual novel game...what's happening in Honey Haven? On Itch.io! <a href=\"https://pokemondb.net/pokedex/rattata\"><img src=\"https://img.pokemondb.net/sprites/black-white/anim/normal/rattata.gif\" alt=\"Rattata\" style=\"filter: grayscale(100%);\"></a>",
    "tags": ["Godot", "Game Dev", "2026"],
    content: [
      "<p>Details coming soon..</p>",
      "<a href='https://honeyhaven.itch.io/honey-haven' target='_blank' rel='noopener noreferrer' style='color: #ff4c00;'>- Play 'HONEY HAVEN'</a>",
      "<br>",
      "<a href='https://github.com/Honey-Haven/Honey_Haven' target='_blank' rel='noopener noreferrer' style='color: #ff4c00;'>- GitHub</a>",
      "<img src='assets/projects/honey-haven/mirror(1).PNG' alt='mirror'>",
      "<br>",
      "<i style=\"color: #ff4c00;\">January 2026 - May 2026</i>",
      "<ul>",
      "  <li>TBD</li>",
      "</ul>",
      "<img src='assets/projects/honey-haven/cover.png' alt='Honey Haven Cover'>"
    ].join("\n")
  },
  {
    "id": "sir-jester",
    "title": "Sir Jester",
    "subheading": "Game Dev",
    "summary": "14kB retro-style web game. Entertain the princess...or else? <a href=\"https://pokemondb.net/pokedex/mr-mime\"><img src=\"https://img.pokemondb.net/sprites/black-white/anim/normal/mr-mime.gif\" alt=\"Mr. Mime\" style=\"filter: grayscale(100%);\"></a>",
    "tags": ["HTML/JS", "Hackathon", "2026"],
    content: [
      "<p>Details coming soon..</p>",
      "<a href='https://avnithvijayram.com/projects/sirjester/game.html' target='_blank' rel='noopener noreferrer' style='color: #ff4c00;'>- Play 'Sir Jester'</a>",
      "<br>",
      "<a href='https://github.com/avnithv/jester.git' target='_blank' rel='noopener noreferrer' style='color: #ff4c00;'>- GitHub</a>",
      "<img src='assets/projects/sir-jester/jester.png' alt='jester'>",
      "<br>",
      "<ul>",
      "  <li>TBD</li>",
      "</ul>"
    ].join("\n")
  },
  {
    "id": "bellsprout-lamp",
    "title": "Bellsprout Lamp",
    "subheading": "Project & Gift",
    "summary": "A touch lamp, or Bellsprout? Birthday gift for friend!  <a href=\"https://pokemondb.net/pokedex/bellsprout\"><img src=\"https://img.pokemondb.net/sprites/black-white/anim/normal/bellsprout.gif\" alt=\"Bellsprout\" style=\"filter: grayscale(100%);\"></a>",
    "tags": ["OnShape", "Arduino", "2026"],
    content: [
      "<p>Details coming soon..</p>",
      "<img src='assets/projects/bellsprout-lamp/warm.jpeg' alt='Bellsprout Lamp'>",
      "<br>",
      "<ul>",
      "  <li>TBD</li>",
      "</ul>"
    ].join("\n")
  },
  {
    "id": "beaver-works",
    "title": "IMMANUEL",
    "subheading": "Software Communications Lead",
    "summary": "Autonomous quadcopter IMMANUEL, created during <br>MIT LL Beaver Works <a href=\"https://pokemondb.net/pokedex/dunsparce\"><img src=\"https://img.pokemondb.net/sprites/black-white/anim/normal/dunsparce.gif\" alt=\"Dunsparce\" style=\"filter: grayscale(100%);\"></a>",
    "tags": ["ROS2", "Python", "OpenCV", "2024"],
    content: [
      "<p>Details coming soon..</p>",
      "<a href='https://github.com/zuri2102/flying_squirrels_architecture.git' target='_blank' rel='noopener noreferrer' style='color: #ff4c00;'>- GitHub</a>",
      "<img src='assets/projects/bwsi/drone.jpeg' alt='IMMANUEL'>",
      "<br>",
      "<i style=\"color: #ff4c00;\">July 2024 - August 2024</i>",
      "<ul>",
      "  <li>TBD</li>",
      "</ul>"
    ].join("\n")
  },
  {
    "id": "rotary-piece",
    "title": "Binary Rotary Game Piece",
    "subheading": "Project/Product",
    "summary": "A rotary encoder-inspired mechanism for gameplay and identification on tabletop game app. <a href=\"https://pokemondb.net/pokedex/klink\"><img src=\"https://img.pokemondb.net/sprites/black-white/anim/normal/klink.gif\" alt=\"Klink\" style=\"filter: grayscale(100%);\"></a>",
    "tags": ["OnShape", "EARLY STAGES"],
    content: [
      "<p>Details coming soon..</p>",
      "<img src='ref/404splash.png' alt='404 Splash Demo'>",
      "<br>",
      "<ul>",
      "  <li>TBD</li>",
      "</ul>"
    ].join("\n")
  },
  {
    "id": "clean-bot",
    "title": "Desk Cleaner Bot",
    "subheading": "Personal Project",
    "summary": "A small octopus-inspired robot that organizes using a rotating tool-wheel and computer vision. <a href=\"https://pokemondb.net/pokedex/octillery\"><img src=\"https://img.pokemondb.net/sprites/black-white/anim/normal/octillery.gif\" alt=\"Octillery\" style=\"filter: grayscale(100%);\"></a>",
    "tags": ["OnShape", "EARLY STAGES"],
    content: [
      "<p>Details coming soon..</p>",
      "<img src='ref/404splash.png' alt='404 Splash Demo'>",
      "<br>",
      "<ul>",
      "  <li>TBD</li>",
      "</ul>"
    ].join("\n")
  }
];