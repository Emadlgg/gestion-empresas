
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import {
  Empresa,
  CrearEmpresa,
  ActualizarEmpresa,
  ApiResponse
} from '../models/empresa.model';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/empresas`;

  obtenerEmpresas(): Observable<ApiResponse<Empresa[]>> {
    return this.http.get<ApiResponse<Empresa[]>>(
      this.apiUrl
    );
  }

  obtenerEmpresa(id: number): Observable<ApiResponse<Empresa>> {
    return this.http.get<ApiResponse<Empresa>>(
      `${this.apiUrl}/${id}`
    );
  }

  crearEmpresa(
    empresa: CrearEmpresa
  ): Observable<ApiResponse<Empresa>> {
    return this.http.post<ApiResponse<Empresa>>(
      this.apiUrl,
      empresa
    );
  }

  actualizarEmpresa(
    id: number,
    empresa: ActualizarEmpresa
  ): Observable<ApiResponse<Empresa>> {
    return this.http.put<ApiResponse<Empresa>>(
      `${this.apiUrl}/${id}`,
      empresa
    );
  }

  eliminarEmpresa(
    id: number
  ): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(
      `${this.apiUrl}/${id}`
    );
  }
}
