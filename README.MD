# Dark Nova
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/b040cbf6d6b546e59616d312776b9426)](https://www.codacy.com/app/ScuroGuardiano/Dark-Nova?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ScuroGuardiano/Dark-Nova&amp;utm_campaign=Badge_Grade)  
Dark Nova is a OGame Private Server made in Node.js using express and ~~sequelize~~ TypeORM  
It's currently under development and it is ~~doing nothing~~ creating and showing planet ^^  
It can even update planet now! You can watch as you gather more and more metal and crystal &lt;3  
EDIT!!! New feature!! You can build buildings now! They are doing ~~nothing~~ something, so BUILD THIS SH*T!
  
The UI looks like a sh*t, I will make it better after finishing core features :)
## Run
> Note: To install all dependencies you must have all node-pre-gyp dependencies, like python 2.7
```bash
    git clone https://github.com/ScuroGuardiano/Dark-Nova.git dark-nova
    cd dark-nova
    npm install
    npm run dev
```
### Watch-mode
```bash
    npm run watch
```
<hr>

## Finished-ish
* Home planet creation  
* Buildings  
* Reseeearch  
* Economy  
* Resource and building tasks updater  
* Research tasks updater  
* Shipyard. Ships, defense, this kind of stuff, ya know. Well almost finished...

## Some c00l scr33n
![C00l Scr33n](screens/scr1.png)

## API
I added some API to create frontend client in javascript framework. It is in src/api folder.  
To enable this API you must set EXPOSE_API enviroment variable to true or set in config file ``` "exposeAPI": true ```  
### Generate API dosc
I use apidoc for API documentation, to generate documentation in HTML head here for instructions: https://github.com/apidoc/apidoc

## Legal
This Project is in no way affiliated with, authorized, maintained, sponsored or endorsed by Gameforge or any of its affiliates or subsidiaries. Using the Project might be against the TOS.

## License
MIT