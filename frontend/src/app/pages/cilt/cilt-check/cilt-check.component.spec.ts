import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CiltCheckComponent } from './cilt-check.component';


describe('CiltCheckComponent', () => {
  let component: CiltCheckComponent;
  let fixture: ComponentFixture<CiltCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CiltCheckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CiltCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
