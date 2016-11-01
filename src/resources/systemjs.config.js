System.config({
  //use typescript for compilation
  transpiler: 'typescript',
  //typescript compiler options
  typescriptOptions: {
    emitDecoratorMetadata: true
  },
  //map tells the System loader where to look for things
  map: {
    app: './app/',
    '@angular': './libs/@angular',
    'rxjs': './libs/rxjs'
  },
  //packages defines our app package
  packages: {
    app: { main: './main.js', defaultExtension: 'js' },
    '@angular/core': { main: 'index.js', defaultExtension: 'js' }, 
    '@angular/compiler': { main: 'index.js', defaultExtension: 'js' }, 
    '@angular/common': { main: 'index.js', defaultExtension: 'js' },
    '@angular/router': { main: 'index.js', defaultExtension: 'js' },
    '@angular/platform-browser-dynamic': { main: 'index.js', defaultExtension: 'js' },
    '@angular/platform-browser': { main: 'index.js', defaultExtension: 'js' },
    rxjs: { defaultExtension: 'js' }
  }
});

//core.umd.js