import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { UvaService } from '../service/uva.service';
import { IUva } from '../uva.model';
import { UvaFormService } from './uva-form.service';

import { UvaUpdateComponent } from './uva-update.component';

describe('Uva Management Update Component', () => {
  let comp: UvaUpdateComponent;
  let fixture: ComponentFixture<UvaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let uvaFormService: UvaFormService;
  let uvaService: UvaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UvaUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(UvaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UvaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    uvaFormService = TestBed.inject(UvaFormService);
    uvaService = TestBed.inject(UvaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const uva: IUva = { id: 17046 };

      activatedRoute.data = of({ uva });
      comp.ngOnInit();

      expect(comp.uva).toEqual(uva);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUva>>();
      const uva = { id: 11053 };
      jest.spyOn(uvaFormService, 'getUva').mockReturnValue(uva);
      jest.spyOn(uvaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ uva });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: uva }));
      saveSubject.complete();

      // THEN
      expect(uvaFormService.getUva).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(uvaService.update).toHaveBeenCalledWith(expect.objectContaining(uva));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUva>>();
      const uva = { id: 11053 };
      jest.spyOn(uvaFormService, 'getUva').mockReturnValue({ id: null });
      jest.spyOn(uvaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ uva: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: uva }));
      saveSubject.complete();

      // THEN
      expect(uvaFormService.getUva).toHaveBeenCalled();
      expect(uvaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUva>>();
      const uva = { id: 11053 };
      jest.spyOn(uvaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ uva });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(uvaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
