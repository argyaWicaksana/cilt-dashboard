import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateCheckComponent } from './generate-check.component';

describe('GenerateCheckComponent', () => {
  let component: GenerateCheckComponent;
  let fixture: ComponentFixture<GenerateCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateCheckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
