import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StopCycleComponent } from './stop-cycle.component';

describe('StopCycleComponent', () => {
  let component: StopCycleComponent;
  let fixture: ComponentFixture<StopCycleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StopCycleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StopCycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
