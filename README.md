# svelte-components"

## How to start a svelte(kit) project

```sh
nvm use 18
npm create svelte svelte-components
echo Choices will come up on the terminal, choose skeleton, jsdoc or typescript (i prefer jsdoc) choose eslint and prettier, i ignore playwright
cd svelte-components
npm i
npx svelte-add tailwindcss
pnpm install
npm install --save axios
echo "I have the impression there are smart reasons svelte uses fetch but it's just so weird and difficult to debug so I use axios"
git add . && git commit -m "initial commit"
```
Additionally this project uses a (seemingly "old") convention that allows us to import components from the $lib folder (src/lib, this folder needs to be created when following these instructions instead of cloning the repo), thus avoiding the figuring out of paths. This is enabled by going into .svelte-kit/.tsconfig and adding the paths item

```json
"paths": {
    "$lib": [
        "src/lib"
    ],
    "$lib/*": [
        "src/lib/*"
    ]
},
```

## How to use the components
Some components you can just copy as they come. Others may rely on global styles (defined in src/routes/app.css) or stores (generally defined under $lib/stores)

## $lib
Under $lib I generally add the utils, stores, components and typedefs folders.

### utils
Utils are general utilities, for example requests.js is a file containing generic functions to make get and post requests using an authorization header if the code is running on the client and a jwt token is found under local storage. These checks (browser, local storage) are tedious, thus we define generic functions that perform them for any request we need.

### typedefs
I use typedefs to provide type definitions for stores or for response data coming from the API I might use
To import a type one can use the syntax /** @typedef {import('$lib/typedefs/items-store').LineItem} LineItem */
Because all the type definitions are written in jsdoc syntax, I've found sometimes one needs to export an actual variable, so I declare export let placeholder = ""; and now the type definitions can be found by other files.

### stores
I create a generic file in stores called index.js, there I declare the smaller stores that don't need their own functions.
For more complex stores, or derived ones I create dedicated files with their names.

## COMPONENTS

### LoginRegisterCard
It's a card with tabs login and register, an absolute div acts as an interactive toggle when one switches from one to the other and svelte updates the form respectively