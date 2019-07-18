import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralFeedComponent } from './general-feed.component';

describe('GeneralFeedComponent', () => {
  let component: GeneralFeedComponent;
  let fixture: ComponentFixture<GeneralFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
