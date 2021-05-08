import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodManagerComponent } from './good-manager.component';

describe('GoodManagerComponent', () => {
  let component: GoodManagerComponent;
  let fixture: ComponentFixture<GoodManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
