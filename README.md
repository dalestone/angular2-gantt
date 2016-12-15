# Angular 2 Gantt 
[![npm version](https://badge.fury.io/js/angular2-gantt.svg)](https://www.npmjs.com/package/angular2-gantt)
[![Build Status](https://travis-ci.org/dalestone/angular2-gantt.svg?branch=master)](https://travis-ci.org/dalestone/angular2-gantt)

This is the home for the Angular 2 gantt component. This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.18.

The aim of this project is to make a material design angular 2 gantt component.

### Project status
Angular 2 gantt is currently in alpha and under active development.
During alpha, breaking API and behaviour changes will be occuring regularly.

### Getting Started
If you want to view the and modify the source directly do the following:

1. git clone https://github.com/dalestone/angular2-gantt.git
2. npm install -g angular-cli
2. npm install
3. npm start

### Install Angular 2 Gantt (Webpack only)
`npm install ng2-gantt --save`

Import the `ng2-gantt` NgModule into your app module

```
import { GanttModule } from 'ng2-gantt';
// other imports
@NgModule({
    imports: [ GanttModule ]
})
export class AppModule { }
```

## Demo
![Demo](./docs/images/demo.gif)

## Browser support
Angular 2 Gantt supports the most recent versions of major browsers: Chrome (including Android), Firefox, Safari (including iOS), and IE11 / Edge.
