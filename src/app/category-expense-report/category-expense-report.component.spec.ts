import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryExpenseReportComponent } from './category-expense-report.component';

describe('CategoryExpenseReportComponent', () => {
  let component: CategoryExpenseReportComponent;
  let fixture: ComponentFixture<CategoryExpenseReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryExpenseReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryExpenseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
