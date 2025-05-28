import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingUserAreaComponent } from './mapping-user-area.component';

describe('MappingUserAreaComponent', () => {
  let component: MappingUserAreaComponent;
  let fixture: ComponentFixture<MappingUserAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MappingUserAreaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MappingUserAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
