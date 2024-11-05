import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarServicioComponent } from './editar-servicio.component';

describe('EditarServicioComponent', () => {
  let component: EditarServicioComponent;
  let fixture: ComponentFixture<EditarServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarServicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
