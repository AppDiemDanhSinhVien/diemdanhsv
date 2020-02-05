import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLopComponent } from './edit-lop.component';

describe('EditLopComponent', () => {
  let component: EditLopComponent;
  let fixture: ComponentFixture<EditLopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
