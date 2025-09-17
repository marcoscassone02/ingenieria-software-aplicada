import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUva } from '../uva.model';
import { UvaService } from '../service/uva.service';

const uvaResolve = (route: ActivatedRouteSnapshot): Observable<null | IUva> => {
  const id = route.params.id;
  if (id) {
    return inject(UvaService)
      .find(id)
      .pipe(
        mergeMap((uva: HttpResponse<IUva>) => {
          if (uva.body) {
            return of(uva.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default uvaResolve;
