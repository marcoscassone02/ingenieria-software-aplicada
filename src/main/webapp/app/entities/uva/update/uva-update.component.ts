import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUva } from '../uva.model';
import { UvaService } from '../service/uva.service';
import { UvaFormGroup, UvaFormService } from './uva-form.service';

@Component({
  selector: 'jhi-uva-update',
  templateUrl: './uva-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class UvaUpdateComponent implements OnInit {
  isSaving = false;
  uva: IUva | null = null;

  protected uvaService = inject(UvaService);
  protected uvaFormService = inject(UvaFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: UvaFormGroup = this.uvaFormService.createUvaFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ uva }) => {
      this.uva = uva;
      if (uva) {
        this.updateForm(uva);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const uva = this.uvaFormService.getUva(this.editForm);
    if (uva.id !== null) {
      this.subscribeToSaveResponse(this.uvaService.update(uva));
    } else {
      this.subscribeToSaveResponse(this.uvaService.create(uva));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUva>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(uva: IUva): void {
    this.uva = uva;
    this.uvaFormService.resetForm(this.editForm, uva);
  }
}
