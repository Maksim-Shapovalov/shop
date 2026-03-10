import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUrl, Length } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Name of the product',
    example: 'Smartphone XYZ',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'A high-end smartphone with excellent camera quality.',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 500)
  description: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 999.99,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Image URL for the product',
    example: 'https://example.com/images/smartphone-xyz.jpg',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  image: string;

  @ApiProperty({
    description: 'ID of the category',
    example: 1,
  })
  @IsNumber()
  categoryId: number;
}
