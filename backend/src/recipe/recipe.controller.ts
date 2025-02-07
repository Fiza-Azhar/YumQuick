//================before jwt
/*
import { Controller, Get, Post, Body, Param, Put, Patch, Query, Delete } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';


@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Patch(':id/favorite')
  async toggleFavorite(@Param('id') id: string) {
    return this.recipeService.toggleFavorite(id);
  }
  

  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipeService.create(createRecipeDto);
  }

  @Get()
  findAll() {
    return this.recipeService.findAll();
  }



  @Put(':id')
  update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipeService.update(id, updateRecipeDto);
  }

  @Patch(':id/toggle')
  toggleChecked(@Param('id') id: string) {
    return this.recipeService.toggleChecked(id);
  }

  @Patch(':id/public')
  async togglePublic(@Param('id') id: string) {
    return this.recipeService.togglePublic(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    console.log(`Received DELETE request for ID: ${id}`);
    try {
      const result = await this.recipeService.deleteRecipe(id);
      console.log('Delete result:', result);
      return result;
    } catch (error) {
      console.error('Error in delete method:', error);
      throw error;
    }
  }
  
  
  
}
*/


import { Controller, Get, Post, Body, Param, Put, Patch, Query, Delete, UseGuards } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('recipes')
@UseGuards(JwtAuthGuard)
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}
  /**
   * Toggle the favorite status of a recipe.
   * 
   * @param id - The ID of the recipe to toggle the favorite status.
   * @returns The updated recipe with the toggled favorite status.
   */
  @Patch(':id/favorite')
  async toggleFavorite(@Param('id') id: string) {
    return this.recipeService.toggleFavorite(id);
  }
  
  /**
   * Create a new recipe.
   * 
   * @param createRecipeDto - The data transfer object containing the recipe details.
   * @returns The newly created recipe.
   */
  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipeService.create(createRecipeDto);
  }
 /**
   * Retrieve all recipes.
   * 
   * @returns An array of all recipes.
   */
  @Get()
  findAll() {
    return this.recipeService.findAll();
  }



  @Put(':id')
  update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipeService.update(id, updateRecipeDto);
  }
 /**
   * Toggle the checked status of a recipe.
   * 
   * @param id - The ID of the recipe to toggle the checked status.
   * @returns The updated recipe with the toggled checked status.
   */
  @Patch(':id/toggle')
  toggleChecked(@Param('id') id: string) {
    return this.recipeService.toggleChecked(id);
  }

  /**
   * Toggle the public visibility status of a recipe.
   * 
   * @param id - The ID of the recipe to toggle the public visibility status.
   * @returns The updated recipe with the toggled public visibility status.
   */
  
  @Patch(':id/public')
  async togglePublic(@Param('id') id: string) {
    return this.recipeService.togglePublic(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    console.log(`Received DELETE request for ID: ${id}`);
    try {
      const result = await this.recipeService.deleteRecipe(id);
      console.log('Delete result:', result);
      return result;
    } catch (error) {
      console.error('Error in delete method:', error);
      throw error;
    }
  }
  
  
  
}
