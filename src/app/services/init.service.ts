import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  constructor() { }



  public static init() {
    // const baseUrl = environment.DATA_URL;
    return new Promise((resolve, reject) => {
      // const time = new Date().getTime();
      // forkJoin(
      //   {
      //     settings: ajax.getJSON(baseUrl + "settings.json?t=" + time),
      //   }
      // ).subscribe((res) => {
      //   this.settings = res.settings as Settings;
      //   resolve(true);
      // });
      resolve(true);
    });
  }
}
