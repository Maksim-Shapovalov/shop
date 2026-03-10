import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from '@entities/Product.entity';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Get all products' })
  @ApiOkResponse({ description: 'List of products', type: [Product] })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term for filtering products by name or description',
  })
  @Get()
  async getAll(@Query('search') searchTerm?: string) {
    return await this.productService.getAll(searchTerm);
  }

  @ApiOperation({ summary: 'Get product by ID' })
  @ApiOkResponse({ description: 'product details', type: Product })
  @ApiNotFoundResponse({
    description: 'product not found',
    schema: { example: { statusCode: 404, message: 'product not found' } },
  })
  @Get(':id')
  async getById(@Param('id', new ParseIntPipe()) id: number) {
    return await this.productService.getById(id);
  }

  @ApiOperation({ summary: 'Get product by slug' })
  @ApiOkResponse({ description: 'product details', type: Product })
  @ApiNotFoundResponse({
    description: 'product not found',
    schema: { example: { statusCode: 404, message: 'product not found' } },
  })
  @Get('category/:slug')
  async getByCategorySlug(@Param('slug') slug: string) {
    return await this.productService.getByCategorySlug(slug);
  }

  @ApiOperation({ summary: 'Get product by slug' })
  @ApiOkResponse({ description: 'product details', type: Product })
  @ApiNotFoundResponse({
    description: 'product not found',
    schema: { example: { statusCode: 404, message: 'product not found' } },
  })
  @Get('slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return await this.productService.getBySlug(slug);
  }

  @ApiOperation({ summary: 'Create a new product' })
  @ApiOkResponse({ description: 'product created', type: Product })
  @ApiBadRequestResponse({
    description: 'Validation failed',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'name must be a string',
          'name should not be empty',
          'name must be shorter than or equal to 100 characters',
          'name must be longer than or equal to 3 characters',
        ],
        error: 'Bad Request',
      },
    },
  })
  @Post()
  async create(@Body() dto: CreateProductDto) {
    return await this.productService.create(dto);
  }

  @ApiOperation({ summary: 'Update an existing product' })
  @ApiOkResponse({ description: 'product updated', type: Product })
  @ApiBadRequestResponse({
    description: 'Validation failed',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'name must be a string',
          'name should not be empty',
          'name must be shorter than or equal to 100 characters',
          'name must be longer than or equal to 3 characters',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'product not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'product not found',
      },
    },
  })
  @ApiBody({ type: UpdateProductDto })
  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return await this.productService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete a product' })
  @ApiOkResponse({ description: 'product deleted' })
  @ApiNotFoundResponse({
    description: 'product not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'product not found',
      },
    },
  })
  @Delete(':id')
  async delete(@Param('id', new ParseIntPipe()) id: number) {
    await this.productService.delete(id);
  }
}
