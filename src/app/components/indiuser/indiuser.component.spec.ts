import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndiuserComponent } from './indiuser.component';

describe('IndiuserComponent', () => {
  let component: IndiuserComponent;
  let fixture: ComponentFixture<IndiuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndiuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndiuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
