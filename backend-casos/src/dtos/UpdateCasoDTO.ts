import { IsString, IsIn, IsOptional } from 'class-validator';

export class UpdateCasoDTO {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsIn(['baja', 'media', 'alta'])
  @IsOptional()
  prioridad?: 'baja' | 'media' | 'alta';

  @IsString()
  @IsOptional()
  estado?: string;

  @IsString()
  @IsOptional()
  responsable?: string;
}
