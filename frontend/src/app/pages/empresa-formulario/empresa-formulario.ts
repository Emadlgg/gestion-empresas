
import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { HttpErrorResponse } from '@angular/common/http';

import { EmpresaService } from '../../services/empresa.service';
import { validarNitGuatemala } from '../../validators/nit.validator';

@Component({
  selector: 'app-empresa-formulario',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './empresa-formulario.html',
  styleUrl: './empresa-formulario.css'
})
export class EmpresaFormulario implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly empresaService = inject(EmpresaService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  esEdicion = signal(false);
  cargando = signal(false);
  guardando = signal(false);
  errorServidor = signal('');

  empresaId: number | null = null;

  formulario = this.fb.nonNullable.group({
    nombre_comercial: ['', [
      Validators.required,
      Validators.maxLength(150)
    ]],
    razon_social: ['', [
      Validators.required,
      Validators.maxLength(200)
    ]],
    telefono: ['', [
      Validators.required,
      Validators.pattern(/^[0-9+\s()-]{8,20}$/)
    ]],
    correo_electronico: ['', [
      Validators.required,
      Validators.email,
      Validators.maxLength(150)
    ]],
    nit: ['', [
      Validators.required,
      Validators.maxLength(20),
      validarNitGuatemala
    ]],
    estado: ['Activo' as 'Activo' | 'Inactivo', [
      Validators.required
    ]],
    direccion: ['', [
      Validators.required
    ]]
  });

  ngOnInit(): void {
    const idParametro = this.route.snapshot.paramMap.get('id');

    if (idParametro !== null) {
      const id = Number(idParametro);

      if (!Number.isSafeInteger(id) || id <= 0) {
        this.errorServidor.set('El identificador de empresa no es válido.');
        this.formulario.disable();
        return;
      }

      this.esEdicion.set(true);
      this.empresaId = id;
      this.cargarEmpresa(id);
    }
  }

  cargarEmpresa(id: number): void {
    this.cargando.set(true);
    this.errorServidor.set('');
    this.formulario.disable();

    this.empresaService.obtenerEmpresa(id).subscribe({
      next: (respuesta) => {
        this.formulario.patchValue({
          nombre_comercial: respuesta.data.nombre_comercial,
          razon_social: respuesta.data.razon_social,
          telefono: respuesta.data.telefono,
          correo_electronico: respuesta.data.correo_electronico,
          nit: respuesta.data.nit,
          estado: respuesta.data.estado,
          direccion: respuesta.data.direccion
        });

        this.formulario.enable();
        this.formulario.controls.correo_electronico.disable();

        this.cargando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.cargando.set(false);
        this.errorServidor.set(
          error.status === 404
            ? 'La empresa solicitada no existe.'
            : 'No se pudo cargar la información de la empresa.'
        );
      }
    });
  }

  campoInvalido(
    nombre: keyof typeof this.formulario.controls
  ): boolean {
    const campo = this.formulario.controls[nombre];

    return campo.invalid && (campo.touched || campo.dirty);
  }

  guardar(): void {
    if (this.guardando() || this.cargando() || this.formulario.disabled) {
      return;
    }

    this.formulario.markAllAsTouched();

    if (this.formulario.invalid) {
      return;
    }

    this.guardando.set(true);
    this.errorServidor.set('');

    const datos = this.formulario.getRawValue();

    const datosComunes = {
      nombre_comercial: datos.nombre_comercial.trim(),
      razon_social: datos.razon_social.trim(),
      telefono: datos.telefono.trim(),
      nit: datos.nit.trim().toUpperCase(),
      estado: datos.estado,
      direccion: datos.direccion.trim()
    };

    const peticion = this.esEdicion() && this.empresaId !== null
      ? this.empresaService.actualizarEmpresa(
          this.empresaId,
          datosComunes
        )
      : this.empresaService.crearEmpresa({
          ...datosComunes,
          correo_electronico: datos.correo_electronico.trim()
        });

    peticion.subscribe({
      next: () => {
        this.guardando.set(false);

        this.router.navigate(['/'], {
          state: {
            mensaje: this.esEdicion()
              ? 'Empresa actualizada correctamente'
              : 'Empresa registrada correctamente'
          }
        });
      },
      error: (error: HttpErrorResponse) => {
        this.guardando.set(false);

        if (error.status === 409) {
          this.errorServidor.set(
            'El correo electrónico o NIT ya está registrado.'
          );
        } else if (error.status === 400) {
          const errores = error.error?.errors;

          this.errorServidor.set(
            Array.isArray(errores) && errores.length
              ? errores.join('. ')
              : error.error?.message || 'Revisa los datos ingresados.'
          );
        } else if (error.status === 404) {
          this.errorServidor.set('La empresa ya no existe.');
        } else {
          this.errorServidor.set(
            'No se pudo guardar la información. Intenta nuevamente.'
          );
        }
      }
    });
  }
}
