import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryAddModifyComponent } from './category-add-modify.component';

describe('CategoryAddModifyComponent', () => {
  let component: CategoryAddModifyComponent;
  let fixture: ComponentFixture<CategoryAddModifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryAddModifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryAddModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
