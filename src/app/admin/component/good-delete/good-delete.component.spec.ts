import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodDeleteComponent } from './good-delete.component';

describe('GoodDeleteComponent', () => {
  let component: GoodDeleteComponent;
  let fixture: ComponentFixture<GoodDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
