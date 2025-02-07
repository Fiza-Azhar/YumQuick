//===================perfect before socket.io=========


import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recipe, RecipeDocument } from './schemas/recipe.schema';
import { CreateRecipeDto } from '../recipe/dto/create-recipe.dto';
import { UpdateRecipeDto } from '../recipe/dto/update-recipe.dto';

@Injectable()
export class RecipeService {
  constructor(@InjectModel(Recipe.name) private readonly recipeModel: Model<RecipeDocument>) {}
  /**
   * Toggle the favorite status of a recipe.
   * 
   * @param id - The ID of the recipe to toggle the favorite status.
   * @returns The updated recipe with the toggled favorite status.
   * @throws {NotFoundException} If the recipe with the specified ID is not found.
   */
  async toggleFavorite(id: string): Promise<Recipe> {
    const recipe = await this.recipeModel.findById(id);
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }
    recipe.favorites = !recipe.favorites;
    return recipe.save();
  }

  /**
   * Create a new recipe.
   * 
   * @param recipeDto - The data transfer object containing the recipe details.
   * @returns The newly created recipe document.
   */
  async create(recipeDto: CreateRecipeDto): Promise<RecipeDocument> {
    const createdRecipe = new this.recipeModel(recipeDto);
    return createdRecipe.save();
  }
  //before user id

  async findAll(): Promise<RecipeDocument[]> {
    return this.recipeModel.find().exec();
  }
  /**
   * Retrieve a recipe by its ID.
   * 
   * @param id - The ID of the recipe to retrieve.
   * @returns The recipe document with the specified ID.
   * @throws {NotFoundException} If the recipe with the specified ID is not found.
   */
  async findById(id: string): Promise<RecipeDocument> {
    const recipe = await this.recipeModel.findById(id).exec();
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }
    return recipe;
  }

  async update(id: string, recipeDto: UpdateRecipeDto): Promise<RecipeDocument> {
    const updatedRecipe = await this.recipeModel.findByIdAndUpdate(id, recipeDto, { new: true }).exec();
    if (!updatedRecipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }
    return updatedRecipe;
  }
  /**
   * Toggle the checked status of a recipe and increment the cook count.
   * 
   * @param id - The ID of the recipe to toggle the checked status.
   * @returns The updated recipe document with the toggled checked status and incremented cook count.
   * @throws {NotFoundException} If the recipe with the specified ID is not found.
   */
  async toggleChecked(id: string): Promise<RecipeDocument> {
    const recipe = await this.findById(id); // Reuse findById to handle non-existent recipes
    recipe.checked = !recipe.checked;
    recipe.cookCount += 1;
    return recipe.save(); // Ensure recipe is an instance of RecipeDocument
  }
  /**
   * Toggle the public visibility status of a recipe.
   * 
   * @param id - The ID of the recipe to toggle the public visibility status.
   * @returns The updated recipe with the toggled public visibility status.
   * @throws {NotFoundException} If the recipe with the specified ID is not found.
   */
  async togglePublic(id: string): Promise<Recipe> {
    const recipe = await this.recipeModel.findById(id);
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }
    recipe.public = !recipe.public;
    return recipe.save();
  }

  /**
   * Delete a recipe by its ID.
   * 
   * @param id - The ID of the recipe to delete.
   * @throws {NotFoundException} If the recipe with the specified ID is not found.
   * 
   * @remarks
   * This method does not return anything but will throw an exception if the deletion fails.
   */
  async deleteRecipe(id: string): Promise<void> {
    const result = await this.recipeModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }
  }
}

