// Enums
export enum EstadoGrupo {
  ACTIVO = "activo",
  FINALIZADO = "finalizado",
}

export enum FrecuenciaGrupo {
  SEMANAL = "semanal",
  QUINCENAL = "quincenal",
  MENSUAL = "mensual",
}

export enum RolMiembro {
  ENCARGADO = "Encargado",
  PARTICIPANTE = "Participante",
}

export enum EstadoTurno {
  PENDIENTE = "pendiente",
  EN_PROCESO = "en_proceso",
  COMPLETADO = "completado",
}

export enum EstadoAporte {
  PENDIENTE = "pendiente",
  PAGADO = "pagado",
  ATRASADO = "atrasado",
}

export enum EstadoInvitacion {
  PENDIENTE = "pendiente",
  ACEPTADA = "aceptada",
  RECHAZADA = "rechazada",
  EXPIRADA = "expirada",
}

// Interfaces
export interface Usuario {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
}

export interface Miembro {
  id: number;
  grupoId: number;
  usuarioId: number;
  rol: RolMiembro;
  unidoEn: Date;
  usuario: Usuario;
  aportes?: Aporte[];
}

export interface Turno {
  id: number;
  grupoId: number;
  miembroId: number;
  numeroTurno: number;
  fechaPrevista: Date;
  fechaEjecucion: Date | null;
  estado: EstadoTurno;
  montoRecibido: number | null;
  observaciones: string | null;
  miembro: Miembro;
}

export interface Aporte {
  id: number;
  miembroId: number;
  numeroPeriodo: number;
  monto: number;
  estado: EstadoAporte;
  fechaLimite: Date;
  fechaPago: Date | null;
  comprobante: string | null;
  observaciones: string | null;
  miembro?: Miembro;
}

export interface Invitacion {
  id: number;
  grupoId: number;
  usuarioInvitadoId: number;
  usuarioInvitadorId: number;
  estado: EstadoInvitacion;
  fechaExpiracion: Date;
  mensaje: string | null;
  usuarioInvitado: Usuario;
  usuarioInvitador: Usuario;
  grupo: {
    id: number;
    nombre: string;
  };
}

export interface Grupo {
  id: number;
  nombre: string;
  descripcion: string;
  montoAporte: number;
  frecuencia: FrecuenciaGrupo;
  cantidadMiembros: number;
  estado: EstadoGrupo;
  fechaInicio: Date | null;
  fechaFinalizacion: Date | null;
  turnoActual: number;
  turnosSorteados: boolean;
  miembros: Miembro[];
  turnos: Turno[];
  invitaciones?: Invitacion[];
}
