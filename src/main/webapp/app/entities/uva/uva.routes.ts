import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import UvaResolve from './route/uva-routing-resolve.service';

const uvaRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/uva.component').then(m => m.UvaComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/uva-detail.component').then(m => m.UvaDetailComponent),
    resolve: {
      uva: UvaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/uva-update.component').then(m => m.UvaUpdateComponent),
    resolve: {
      uva: UvaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/uva-update.component').then(m => m.UvaUpdateComponent),
    resolve: {
      uva: UvaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default uvaRoute;
