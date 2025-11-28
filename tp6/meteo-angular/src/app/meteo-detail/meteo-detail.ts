import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';  

@Component({
  selector: 'app-meteo-detail',
  templateUrl: './meteo-detail.html',
  standalone: true
})
export class MeteoDetail implements OnInit {

  meteo: any = null;
  latlon: string = '';
  cityName: string = '';

  constructor(
    private route: ActivatedRoute,
    private location: Location       
  ) {}

  ngOnInit() {
    this.cityName = this.route.snapshot.paramMap.get('name') || '';
    console.log("Ville reçue :", this.cityName);
    this.loadMeteo();
  }

  loadMeteo() {
    if (!this.cityName) return;

    const API_KEY = "b1168d00f0f04eb0dd99e2970e6df428";

    console.log("Chargement météo pour :", this.cityName);

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${this.cityName}&appid=${API_KEY}&units=metric&lang=fr`
    )
    .then(res => res.json())
    .then(data => {
      console.log("Données météo reçues :", data);
      this.meteo = data;

      if (data && data.coord) {
        this.latlon = `${data.coord.lat},${data.coord.lon}`;
      }
    })
    .catch(err => {
      console.error("Erreur API météo :", err);
      this.meteo = { cod: 500, message: "Erreur interne" };
    });
  }
  back(): void {
    this.location.back();
  }

}
