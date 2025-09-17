import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { UvaDetailComponent } from './uva-detail.component';

describe('Uva Management Detail Component', () => {
  let comp: UvaDetailComponent;
  let fixture: ComponentFixture<UvaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UvaDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./uva-detail.component').then(m => m.UvaDetailComponent),
              resolve: { uva: () => of({ id: 11053 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(UvaDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UvaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load uva on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', UvaDetailComponent);

      // THEN
      expect(instance.uva()).toEqual(expect.objectContaining({ id: 11053 }));
    });
  });

  describe('PreviousState', () => {
    it('should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
