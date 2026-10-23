
import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import { EmpresaService } from '../../services/empresa.service';
import { Empresa } from '../../models/empresa.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-empresa-detalle',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './empresa-detalle.html',
  styleUrl: './empresa-detalle.css'
})
export class EmpresaDetalle implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly empresaService = inject(EmpresaService);

  empresa = signal<Empresa | null>(null);
  cargando = signal(true);
  error = signal('');

  ngOnInit(): void {
    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!Number.isSafeInteger(id) || id <= 0) {
      this.error.set('El identificador de empresa no es válido.');
      this.cargando.set(false);
      return;
    }

    this.empresaService.obtenerEmpresa(id).subscribe({
      next: (respuesta) => {
        this.empresa.set(respuesta.data);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(
          err.status === 404
            ? 'La empresa solicitada no existe.'
            : 'No se pudo cargar la información de la empresa.'
        );

        this.cargando.set(false);
      }
    });
  }
}
