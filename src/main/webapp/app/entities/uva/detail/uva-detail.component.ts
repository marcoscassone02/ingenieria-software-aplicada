import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IUva } from '../uva.model';

@Component({
  selector: 'jhi-uva-detail',
  templateUrl: './uva-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class UvaDetailComponent {
  uva = input<IUva | null>(null);

  previousState(): void {
    window.history.back();
  }
}
