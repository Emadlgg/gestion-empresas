
import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import { HttpErrorResponse } from '@angular/common/http';

import { EmpresaService } from '../../services/empresa.service';
import { Empresa } from '../../models/empresa.model';

@Component({
  selector: 'app-empresas-lista',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './empresas-lista.html',
  styleUrl: './empresas-lista.css'
})
export class EmpresasLista implements OnInit {

  // Servicios
  private readonly empresaService = inject(EmpresaService);
  private readonly router = inject(Router);

  // Estado del componente
  empresas = signal<Empresa[]>([]);
  cargando = signal(false);
  eliminando = signal(false);

  error = signal('');
  mensajeExito = signal('');
  errorOperacion = signal('');

  // Se ejecuta cuando se inicializa el componente
  ngOnInit(): void {
    // Recuperar mensaje después de registrar o editar
    const mensaje = history.state?.mensaje;

    if (typeof mensaje === 'string' && mensaje.trim()) {
      this.mensajeExito.set(mensaje);

      // Limpiar el mensaje del historial para que
      // no reaparezca al actualizar el navegador
      window.history.replaceState(
        { ...history.state, mensaje: null },
        ''
      );
    }

    // Consultar empresas al iniciar
    this.cargarEmpresas();
  }

  // GET: consultar todas las empresas
  cargarEmpresas(): void {
    if (this.cargando()) {
      return;
    }

    this.cargando.set(true);
    this.error.set('');

    this.empresaService.obtenerEmpresas().subscribe({
      next: (respuesta) => {
        this.empresas.set(respuesta.data);
        this.cargando.set(false);
      },

      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar empresas:', err);

        this.error.set(
          'No se pudieron cargar las empresas. Intenta nuevamente.'
        );

        this.cargando.set(false);
      }
    });
  }

  // DELETE: eliminar una empresa
  eliminarEmpresa(empresa: Empresa): void {
    if (this.eliminando()) {
      return;
    }

    const confirmado = window.confirm(
      `¿Estás seguro de que deseas eliminar la empresa "${empresa.nombre_comercial}"?`
    );

    // Si el usuario cancela, no se elimina
    if (!confirmado) {
      return;
    }

    this.eliminando.set(true);
    this.errorOperacion.set('');
    this.mensajeExito.set('');

    this.empresaService.eliminarEmpresa(empresa.id).subscribe({
      next: () => {
        // Actualizar el arreglo sin recargar la página
        this.empresas.update((empresasActuales) =>
          empresasActuales.filter(
            (item) => item.id !== empresa.id
          )
        );

        this.mensajeExito.set(
          'Empresa eliminada correctamente'
        );

        this.eliminando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al eliminar empresa:', err);

        this.errorOperacion.set(
          err.status === 404
            ? 'La empresa ya no existe. Actualiza el listado.'
            : 'No se pudo eliminar la empresa. Intenta nuevamente.'
        );

        this.eliminando.set(false);
      }
    });
  }
}
