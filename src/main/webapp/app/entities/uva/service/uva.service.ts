import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUva, NewUva } from '../uva.model';

export type PartialUpdateUva = Partial<IUva> & Pick<IUva, 'id'>;

export type EntityResponseType = HttpResponse<IUva>;
export type EntityArrayResponseType = HttpResponse<IUva[]>;

@Injectable({ providedIn: 'root' })
export class UvaService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/uvas');

  create(uva: NewUva): Observable<EntityResponseType> {
    return this.http.post<IUva>(this.resourceUrl, uva, { observe: 'response' });
  }

  update(uva: IUva): Observable<EntityResponseType> {
    return this.http.put<IUva>(`${this.resourceUrl}/${this.getUvaIdentifier(uva)}`, uva, { observe: 'response' });
  }

  partialUpdate(uva: PartialUpdateUva): Observable<EntityResponseType> {
    return this.http.patch<IUva>(`${this.resourceUrl}/${this.getUvaIdentifier(uva)}`, uva, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUva>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUva[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUvaIdentifier(uva: Pick<IUva, 'id'>): number {
    return uva.id;
  }

  compareUva(o1: Pick<IUva, 'id'> | null, o2: Pick<IUva, 'id'> | null): boolean {
    return o1 && o2 ? this.getUvaIdentifier(o1) === this.getUvaIdentifier(o2) : o1 === o2;
  }

  addUvaToCollectionIfMissing<Type extends Pick<IUva, 'id'>>(uvaCollection: Type[], ...uvasToCheck: (Type | null | undefined)[]): Type[] {
    const uvas: Type[] = uvasToCheck.filter(isPresent);
    if (uvas.length > 0) {
      const uvaCollectionIdentifiers = uvaCollection.map(uvaItem => this.getUvaIdentifier(uvaItem));
      const uvasToAdd = uvas.filter(uvaItem => {
        const uvaIdentifier = this.getUvaIdentifier(uvaItem);
        if (uvaCollectionIdentifiers.includes(uvaIdentifier)) {
          return false;
        }
        uvaCollectionIdentifiers.push(uvaIdentifier);
        return true;
      });
      return [...uvasToAdd, ...uvaCollection];
    }
    return uvaCollection;
  }
}
