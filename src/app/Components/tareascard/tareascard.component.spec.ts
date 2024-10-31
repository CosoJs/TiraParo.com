import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TareascardComponent } from './tareascard.component';

describe('TareascardComponent', () => {
  let component: TareascardComponent;
  let fixture: ComponentFixture<TareascardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TareascardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TareascardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
