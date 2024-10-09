import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralviewComponent } from './generalview.component';

describe('GeneralviewComponent', () => {
  let component: GeneralviewComponent;
  let fixture: ComponentFixture<GeneralviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneralviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
