import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../uva.test-samples';

import { UvaFormService } from './uva-form.service';

describe('Uva Form Service', () => {
  let service: UvaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UvaFormService);
  });

  describe('Service methods', () => {
    describe('createUvaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUvaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            ph: expect.any(Object),
            acidez: expect.any(Object),
            brix: expect.any(Object),
            variedad: expect.any(Object),
            viniedo: expect.any(Object),
            cantidad: expect.any(Object),
          }),
        );
      });

      it('passing IUva should create a new form with FormGroup', () => {
        const formGroup = service.createUvaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            ph: expect.any(Object),
            acidez: expect.any(Object),
            brix: expect.any(Object),
            variedad: expect.any(Object),
            viniedo: expect.any(Object),
            cantidad: expect.any(Object),
          }),
        );
      });
    });

    describe('getUva', () => {
      it('should return NewUva for default Uva initial value', () => {
        const formGroup = service.createUvaFormGroup(sampleWithNewData);

        const uva = service.getUva(formGroup) as any;

        expect(uva).toMatchObject(sampleWithNewData);
      });

      it('should return NewUva for empty Uva initial value', () => {
        const formGroup = service.createUvaFormGroup();

        const uva = service.getUva(formGroup) as any;

        expect(uva).toMatchObject({});
      });

      it('should return IUva', () => {
        const formGroup = service.createUvaFormGroup(sampleWithRequiredData);

        const uva = service.getUva(formGroup) as any;

        expect(uva).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUva should not enable id FormControl', () => {
        const formGroup = service.createUvaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUva should disable id FormControl', () => {
        const formGroup = service.createUvaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
