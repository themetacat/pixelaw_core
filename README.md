# PixeLAW Core(MUD Based)

[PixeLAW](https://pixelaw.xyz/) is a pixel-based [Autonomous World](https://aw.network/posts/the-case-for-autonomous-worlds). 

This repository includes **core components and systems**, which inspired by [PixeLAW Core(Dojo Based)](https://github.com/pixelaw/core), and built on top of [MUD](https://mud.dev/) for EVM compatible. For more details, please check [PixeLAW Book](https://pixelaw.github.io/book/index.html).

## Concepts
- World : A Cartesian plane (2d grid), where every position represents a "Pixel"
- Pixel : One x/y Position, that has 6 primitive properties and one behavior template (App)
- App : A Pixel can have **only one** App that defines its behavior
- App2App : Interactions between Apps, where allowed
- Action : A specific behavior in the context of an App
- Queued Action : Action to be executed in the future, can be scheduled during an Action

## App Core Behavior (for owner)
- register : Register the App in the World
- unregister : Remove the App from the World
- allow_app
- disallow_app

## App Properties
- name
- permissions (bool hashmap of appname+property)

## Core Pixel Behavior
- update_all
- update_app
- update_color
- update_owner
- update_text
- update_alert
- update_timestamp

## Pixel Properties (every Pixel has these)
- position (cannot be changed)
- app
- color
- owner
- text
- alert
- timestamp

## Default App
- paint(put\_color, remove\_color)
- snake(spawn, move)

## Prerequisites
- [Node.js v18](https://nodejs.org/en/download/package-manager)
- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- [pnpm](https://pnpm.io/)
`
sudo npm install -g pnpm
`

## Quickstart(Deploy Locally)
### Step 1: Clone repo
`git clone https://github.com/themetacat/pixelaw_core.git`

### Step 2: Deploy and Start
`cd pixelaw_core && chmod u+x ./start.sh && ./start.sh`

## License
PixeLAW Core(MUD Based) is open-source software [under the MIT license](https://github.com/themetacat/pixelaw_core/blob/main/LICENSE).
