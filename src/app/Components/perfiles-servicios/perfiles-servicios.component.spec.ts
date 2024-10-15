import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilesServiciosComponent } from './perfiles-servicios.component';

describe('PerfilesServiciosComponent', () => {
  let component: PerfilesServiciosComponent;
  let fixture: ComponentFixture<PerfilesServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerfilesServiciosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilesServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
