import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilcardsComponent } from './perfilcards.component';

describe('PerfilcardsComponent', () => {
  let component: PerfilcardsComponent;
  let fixture: ComponentFixture<PerfilcardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerfilcardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
