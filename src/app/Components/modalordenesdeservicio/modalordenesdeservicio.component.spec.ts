import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalordenesdeservicioComponent } from './modalordenesdeservicio.component';

describe('ModalordenesdeservicioComponent', () => {
  let component: ModalordenesdeservicioComponent;
  let fixture: ComponentFixture<ModalordenesdeservicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalordenesdeservicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalordenesdeservicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
