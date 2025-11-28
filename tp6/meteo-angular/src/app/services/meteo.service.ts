// src/app/services/meteo.service.ts
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class MeteoService {
  constructor() {}

  getMeteo(name: string): Promise<any> {
    console.log("from service", name);

    return fetch(
      "https://api.openweathermap.org/data/2.5/weather/?q=" +
        name +
        "&units=metric&lang=fr&appid=9d9b8f54e284b89821fd4a4f5e904485"
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        if (json.cod == 200) {
          return Promise.resolve(json);
        } else {
          console.error(
            "Météo introuvable pour " + name + " (" + json.message + ")"
          );
          return Promise.reject(
            "Météo introuvable pour " + name + " (" + json.message + ")"
          );
        }
      });
  }
}