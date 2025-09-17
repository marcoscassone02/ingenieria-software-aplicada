import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IUva } from '../uva.model';
import { UvaService } from '../service/uva.service';

@Component({
  templateUrl: './uva-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class UvaDeleteDialogComponent {
  uva?: IUva;

  protected uvaService = inject(UvaService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.uvaService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
