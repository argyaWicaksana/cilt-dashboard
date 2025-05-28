import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterCheckComponent } from './master-check.component';

describe('MasterCheckComponent', () => {
  let component: MasterCheckComponent;
  let fixture: ComponentFixture<MasterCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterCheckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
