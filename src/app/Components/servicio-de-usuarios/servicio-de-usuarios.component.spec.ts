import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicioDeUsuariosComponent } from './servicio-de-usuarios.component';

describe('ServicioDeUsuariosComponent', () => {
  let component: ServicioDeUsuariosComponent;
  let fixture: ComponentFixture<ServicioDeUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServicioDeUsuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicioDeUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
