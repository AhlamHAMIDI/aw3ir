import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Meteo } from './meteo';

describe('Meteo', () => {
  let component: Meteo;
  let fixture: ComponentFixture<Meteo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Meteo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Meteo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
