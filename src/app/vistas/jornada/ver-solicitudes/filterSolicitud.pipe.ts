import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'filter'
})
export class FilterSolicitudPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resultPosts = [];
    for (const solicitud of value) {
      if (solicitud.username != null)
        if (solicitud.username.indexOf(arg[0]) > -1) {
          resultPosts.push(solicitud);
        }
      ;
    }
    ;
    return resultPosts;
  }
}
