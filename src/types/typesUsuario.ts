export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  roles: string[];
}

export interface ApiResponse<T> {
  mensaje?: string;
  data: T;
}
