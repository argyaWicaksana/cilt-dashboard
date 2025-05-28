import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCheckComponent } from './report-check.component';

describe('ReportCheckComponent', () => {
  let component: ReportCheckComponent;
  let fixture: ComponentFixture<ReportCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportCheckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
