import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanlyGVComponent } from './quanly-gv.component';

describe('QuanlyGVComponent', () => {
  let component: QuanlyGVComponent;
  let fixture: ComponentFixture<QuanlyGVComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuanlyGVComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuanlyGVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
