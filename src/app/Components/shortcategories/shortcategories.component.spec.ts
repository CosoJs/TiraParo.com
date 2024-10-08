import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortcategoriesComponent } from './shortcategories.component';

describe('ShortcategoriesComponent', () => {
  let component: ShortcategoriesComponent;
  let fixture: ComponentFixture<ShortcategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShortcategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShortcategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
