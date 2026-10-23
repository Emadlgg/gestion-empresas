
export interface Empresa {
  id: number;
  nombre_comercial: string;
  razon_social: string;
  telefono: string;
  correo_electronico: string;
  nit: string;
  estado: 'Activo' | 'Inactivo';
  direccion: string;
  fecha_creacion: string;
}

export type CrearEmpresa = Omit<
  Empresa,
  'id' | 'fecha_creacion'
>;

export type ActualizarEmpresa = Omit<
  CrearEmpresa,
  'correo_electronico'
>;

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
