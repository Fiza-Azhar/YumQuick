//===before socket io=
/*
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { Recipe, RecipeSchema } from './schemas/recipe.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }]),
  ],
  controllers: [RecipeController],
  providers: [RecipeService],
  exports: [RecipeService], // Export RecipeService if you need to use it elsewhere
})
export class RecipeModule {}
*/



import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { Recipe, RecipeSchema } from './schemas/recipe.schema';
import { ChatModule } from '../chat/chat.module'; // Import ChatModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }]),
    ChatModule, // Import the module providing ChatGateway
  ],
  controllers: [RecipeController],
  providers: [RecipeService],
  exports: [RecipeService], // Export RecipeService if you need to use it elsewhere
})
export class RecipeModule {}

