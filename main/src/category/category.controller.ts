import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Category } from '@entities/index';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Get all categories' })
  @ApiOkResponse({ description: 'List of categories', type: [Category] })
  @Get()
  async getAll() {
    return await this.categoryService.getAll();
  }

  @ApiOperation({ summary: 'Get category by ID' })
  @ApiOkResponse({ description: 'Category details', type: Category })
  @ApiNotFoundResponse({
    description: 'Category not found',
    schema: { example: { statusCode: 404, message: 'Category not found' } },
  })
  @Get(':id')
  async getById(@Param('id', new ParseIntPipe()) id: number) {
    return await this.categoryService.getById(id);
  }

  @ApiOperation({ summary: 'Get category by slug' })
  @ApiOkResponse({ description: 'Category details', type: Category })
  @ApiNotFoundResponse({
    description: 'Category not found',
    schema: { example: { statusCode: 404, message: 'Category not found' } },
  })
  @Get('slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return await this.categoryService.getBySlug(slug);
  }

  @ApiOperation({ summary: 'Create a new category' })
  @ApiOkResponse({ description: 'Category created', type: Category })
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
  async create(@Body() dto: CreateCategoryDto) {
    return await this.categoryService.create(dto);
  }

  @ApiOperation({ summary: 'Update an existing category' })
  @ApiOkResponse({ description: 'Category updated', type: Category })
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
    description: 'Category not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Category not found',
      },
    },
  })
  @ApiBody({ type: UpdateCategoryDto })
  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    return await this.categoryService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete a category' })
  @ApiOkResponse({ description: 'Category deleted' })
  @ApiNotFoundResponse({
    description: 'Category not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Category not found',
      },
    },
  })
  @Delete(':id')
  async delete(@Param('id', new ParseIntPipe()) id: number) {
    await this.categoryService.delete(id);
  }
}
