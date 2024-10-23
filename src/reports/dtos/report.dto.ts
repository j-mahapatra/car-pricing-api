import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  long: number;

  @Expose()
  lat: number;

  @Expose()
  approved: boolean;

  @Expose()
  mileage: number;

  @Expose()
  @Transform(({ obj }) => obj.user.id)
  userId: number;
}
