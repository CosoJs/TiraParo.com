import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TareaModalComponent } from './tarea-modal.component';

describe('TareaModalComponent', () => {
  let component: TareaModalComponent;
  let fixture: ComponentFixture<TareaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TareaModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TareaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
