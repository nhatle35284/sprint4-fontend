import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodAddComponent } from './good-add.component';

describe('GoodAddComponent', () => {
  let component: GoodAddComponent;
  let fixture: ComponentFixture<GoodAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
