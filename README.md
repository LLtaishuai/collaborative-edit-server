# collaborative-edit-server

HuashuiAI collaborative edit server

## Local env

- git clone repo code
- direct code root path and install `npm install`
- add a `.env` file and put in content ( reference content of `.env.example` )
- run server `npm run dev`

## Test deployment

Login test cloud server, and config firewall to ensure web-socket `port` open.

- git clone repo code
- direct code root path and install `npm install`
- add a `.env` file and put in content ( reference content of `.env.example` )
- run server `npm run prod` ( use pm2 )

Other pm2 command

- `npx pm2 list`
- `npx pm2 restart <id>`
- `npx pm2 stop <id>`
- `npx pm2 delete <id>`
- `npx pm2 log <id>`

## Prod deployment

todo...
