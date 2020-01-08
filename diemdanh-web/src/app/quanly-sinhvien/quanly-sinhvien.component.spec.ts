import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanlySinhvienComponent } from './quanly-sinhvien.component';

describe('QuanlySinhvienComponent', () => {
  let component: QuanlySinhvienComponent;
  let fixture: ComponentFixture<QuanlySinhvienComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuanlySinhvienComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuanlySinhvienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
