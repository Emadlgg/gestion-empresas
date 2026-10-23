
import { Routes } from '@angular/router';

import { EmpresasLista } from './pages/empresas-lista/empresas-lista';
import { EmpresaFormulario } from './pages/empresa-formulario/empresa-formulario';
import { EmpresaDetalle } from './pages/empresa-detalle/empresa-detalle';

export const routes: Routes = [
  {
    path: '',
    component: EmpresasLista
  },
  {
    path: 'empresas/nueva',
    component: EmpresaFormulario
  },
  {
    path: 'empresas/:id/editar',
    component: EmpresaFormulario
  },
  {
    path: 'empresas/:id',
    component: EmpresaDetalle
  },
  {
    path: '**',
    redirectTo: ''
  }
];
