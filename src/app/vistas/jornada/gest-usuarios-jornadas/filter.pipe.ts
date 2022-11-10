import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resultPosts = [];
    for (const employee of value) {
      if (employee.username != null)
        if (employee.username.indexOf(arg) > -1) {
          resultPosts.push(employee);
        }
      ;
    }
    return resultPosts;
  }

}
