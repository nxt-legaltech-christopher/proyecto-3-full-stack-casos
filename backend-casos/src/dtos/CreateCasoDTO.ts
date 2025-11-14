import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';

export class CreateCasoDTO {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsIn(['baja', 'media', 'alta'])
  @IsNotEmpty()
  prioridad!: 'baja' | 'media' | 'alta';

  @IsString()
  @IsOptional()
  responsable?: string;

  @IsString()
  @IsOptional()
  estado?: string;
}
