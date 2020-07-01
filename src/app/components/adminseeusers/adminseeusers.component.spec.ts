import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminseeusersComponent } from './adminseeusers.component';

describe('AdminseeusersComponent', () => {
  let component: AdminseeusersComponent;
  let fixture: ComponentFixture<AdminseeusersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminseeusersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminseeusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
