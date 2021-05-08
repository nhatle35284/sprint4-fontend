import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteGoodCartComponent } from './delete-good-cart.component';

describe('DeleteGoodCartComponent', () => {
  let component: DeleteGoodCartComponent;
  let fixture: ComponentFixture<DeleteGoodCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteGoodCartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteGoodCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
