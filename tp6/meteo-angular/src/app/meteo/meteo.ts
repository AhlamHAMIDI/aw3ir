import { Component, OnInit } from '@angular/core';
import { MeteoItem } from './meteoItem';

@Component({
  selector: 'app-meteo',
  templateUrl: './meteo.html',
  standalone: true,
  styleUrls: ['./meteo.css']   
})
export class Meteo implements OnInit {

  city: MeteoItem = { name: '', id: 0, weather: null };
  cityList: MeteoItem[] = [];

  constructor() { } 

  ngOnInit() {
   
    if (localStorage.cityList !== undefined) {
      this.cityList = JSON.parse(localStorage.cityList);
    } else {
      const stored = localStorage.getItem('cityList');
      this.cityList = stored ? JSON.parse(stored) : [];
    }
  }

  onSubmit() {
    if (!this.isCityExist(this.city.name || "")) {

      let c = new MeteoItem();
      c.name = this.city.name;
      this.cityList.push(c);

      this.saveCityList();

      console.log(this.city.name, "ajouté dans la liste"); 
    } else {
      console.log(this.city.name, "existe déjà dans la liste"); 
    }
  }

  remove(city: MeteoItem) {
    this.cityList = this.cityList.filter(c => c.name !== city.name);
    this.saveCityList();
  }

  isCityExist(name: string) {
    return this.cityList.some(
      c => (c.name || "").toUpperCase() === name.toUpperCase()
    );
  }

  saveCityList() {
    localStorage.setItem('cityList', JSON.stringify(this.cityList));
  }
}
