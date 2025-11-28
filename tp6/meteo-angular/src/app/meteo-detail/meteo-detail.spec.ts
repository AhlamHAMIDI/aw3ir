import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeteoDetail } from './meteo-detail';

describe('MeteoDetail', () => {
  let component: MeteoDetail;
  let fixture: ComponentFixture<MeteoDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeteoDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeteoDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
