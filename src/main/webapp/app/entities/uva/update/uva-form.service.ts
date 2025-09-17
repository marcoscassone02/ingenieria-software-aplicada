import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IUva, NewUva } from '../uva.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUva for edit and NewUvaFormGroupInput for create.
 */
type UvaFormGroupInput = IUva | PartialWithRequiredKeyOf<NewUva>;

type UvaFormDefaults = Pick<NewUva, 'id'>;

type UvaFormGroupContent = {
  id: FormControl<IUva['id'] | NewUva['id']>;
  ph: FormControl<IUva['ph']>;
  acidez: FormControl<IUva['acidez']>;
  brix: FormControl<IUva['brix']>;
  variedad: FormControl<IUva['variedad']>;
  viniedo: FormControl<IUva['viniedo']>;
  cantidad: FormControl<IUva['cantidad']>;
};

export type UvaFormGroup = FormGroup<UvaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UvaFormService {
  createUvaFormGroup(uva: UvaFormGroupInput = { id: null }): UvaFormGroup {
    const uvaRawValue = {
      ...this.getFormDefaults(),
      ...uva,
    };
    return new FormGroup<UvaFormGroupContent>({
      id: new FormControl(
        { value: uvaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      ph: new FormControl(uvaRawValue.ph, {
        validators: [Validators.required],
      }),
      acidez: new FormControl(uvaRawValue.acidez, {
        validators: [Validators.required],
      }),
      brix: new FormControl(uvaRawValue.brix, {
        validators: [Validators.required],
      }),
      variedad: new FormControl(uvaRawValue.variedad, {
        validators: [Validators.required],
      }),
      viniedo: new FormControl(uvaRawValue.viniedo, {
        validators: [Validators.required],
      }),
      cantidad: new FormControl(uvaRawValue.cantidad, {
        validators: [Validators.required],
      }),
    });
  }

  getUva(form: UvaFormGroup): IUva | NewUva {
    return form.getRawValue() as IUva | NewUva;
  }

  resetForm(form: UvaFormGroup, uva: UvaFormGroupInput): void {
    const uvaRawValue = { ...this.getFormDefaults(), ...uva };
    form.reset(
      {
        ...uvaRawValue,
        id: { value: uvaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): UvaFormDefaults {
    return {
      id: null,
    };
  }
}
