# npm

npx create-react-app . --template typescript **установить - react и typescript (. - папка в которой находимся)**

npm install react-redux **react-redux**
npm install @reduxjs/toolkit **установить - reduxjs/toolkit**

npm i three **установить - three**
npm i --save-dev @types/three **установить - @types чтобы VS понимал ts и three**

npm install sass --save-dev **установить - чтобы работал scss**

### package.json

"homepage": "." **прописать в package.json, чтобы при сборке build - пути файлов были относительные**

### tsconfig.json

{
"compilerOptions": {
"baseUrl": "src"
},
"include": ["src"]
}

**чтобы был абслотный импорт нужно прописать в tsconfig.json -> "baseUrl": "src"**
**после этого можно не писать '../../plan/index' , а заменить на абсолютный путь к файлу 'three-scene/plan/index'**
**https://stackoverflow.com/questions/63067555/how-to-make-an-import-shortcut-alias-in-create-react-app**

### ------

[http://localhost:3000](http://localhost:3000)
