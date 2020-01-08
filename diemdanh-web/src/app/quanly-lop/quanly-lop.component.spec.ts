import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanlyLopComponent } from './quanly-lop.component';

describe('QuanlyLopComponent', () => {
  let component: QuanlyLopComponent;
  let fixture: ComponentFixture<QuanlyLopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuanlyLopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuanlyLopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
