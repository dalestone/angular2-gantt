import { Pipe, PipeTransform } from '@angular/core';
/*
 * Group the array by given function
 * Takes an array argument that defaults to 1.
 * Usage:
 *   array | groupBy:func()
 * Example:
 *   {{ [ { id: '1'}] |  groupBy: }}
 *   formats to: []
*/
@Pipe({name: 'groupBy'})
export class GroupByPipe implements PipeTransform {
  transform(array: any[], f: any): any[] {
      var groups = {};
      array.forEach((o:any) => {
        var group = JSON.stringify(f(o));
        
        groups[group] = groups[group] || [];
        groups[group].push(o);
      });
      return Object.keys(groups).map((group:any) => {
          return groups[group];
      });
  }
}