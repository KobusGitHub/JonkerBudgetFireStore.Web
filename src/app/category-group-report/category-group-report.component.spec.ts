import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryGroupReportComponent } from './category-group-report.component';

describe('CategoryGroupReportComponent', () => {
  let component: CategoryGroupReportComponent;
  let fixture: ComponentFixture<CategoryGroupReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryGroupReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryGroupReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
