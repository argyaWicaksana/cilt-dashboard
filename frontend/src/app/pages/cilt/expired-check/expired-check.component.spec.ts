import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredCheckComponent } from './expired-check.component';

describe('ExpiredCheckComponent', () => {
  let component: ExpiredCheckComponent;
  let fixture: ComponentFixture<ExpiredCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpiredCheckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpiredCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
