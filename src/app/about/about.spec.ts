import { ComponentFixture, TestBed } from '@angular/core/testing';

import { About } from './about';
import { RouterTestingModule } from '@angular/router/testing';

describe('About', () => {
  let component: About;
  let fixture: ComponentFixture<About>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [About],
      imports: [RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(About);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
