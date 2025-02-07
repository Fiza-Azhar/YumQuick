// src/recipe/dto/create-recipe.dto.ts
import { IsString, IsNumber, IsArray, IsOptional, IsBoolean } from 'class-validator';
import { Step, Ingredient } from '../schemas/recipe.schema';

export class CreateRecipeDto {
  @IsString()
  email: string;
  
  @IsString()
  name: string;

  @IsNumber()
  size: number;

  @IsNumber()
  price: number;
  
  @IsArray()
  ingredients: Ingredient[];

  @IsArray()
  steps: Step[];

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsBoolean()
  public: boolean;
}


