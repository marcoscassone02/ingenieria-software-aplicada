import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'ingenieriaSoftwareAplicadaApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'uva',
    data: { pageTitle: 'ingenieriaSoftwareAplicadaApp.uva.home.title' },
    loadChildren: () => import('./uva/uva.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
