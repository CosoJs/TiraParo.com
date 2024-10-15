import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroServiciosComponent } from './registro-servicios.component';

describe('RegistroServiciosComponent', () => {
  let component: RegistroServiciosComponent;
  let fixture: ComponentFixture<RegistroServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistroServiciosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
