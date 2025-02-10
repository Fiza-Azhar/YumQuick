// src/navigation/ParamList.ts
export type RootStackParamList = {
    LaunchScreen: undefined;
    SignUpScreen: undefined;
    LoginScreen: undefined;
    MenuScreen: { username: string;
      profilePhoto: string;
      email: string;
      uid:string;
     };
     AddRecipeScreen: {
      username: string;
      email: { email: string; message: string; profilePhoto: string; success: boolean; userId: string; username: string } | string;
      profilePhoto: string;
      uid:string;

    };
    MyRecipesScreen:  {
      username: string;
      email: { email: string; message: string; profilePhoto: string; success: boolean; userId: string; username: string } | string;
      profilePhoto: string;
      uid:string;

    }
    FavRecipesScreen: {
      username: string;
      email: { email: string; message: string; profilePhoto: string; success: boolean; userId: string; username: string } | string;
      profilePhoto: string;
      uid:string;

    };
    RecipeList: {
      username: string;
      profilePhoto: string;
      email: string;
      uid:string;

    };
    GroceryRecipesScreen:  {
      username: string;
      profilePhoto: string;
      email: string;
      uid:string;

    };
    GroceryListScreen: {
      selectedRecipes: string[];
      servings: number;
      username: string;
      profilePhoto: string;
      email: string;
      uid:string;

    };
    CookScreen: {
      id: string;
      username: string;
      profilePhoto: string;
      email: string;
      uid:string;

  };
  CategoryScreen:{
    name: string;
    username: string;
      email: { email: string; message: string; profilePhoto: string; success: boolean; userId: string; username: string } | string;
      profilePhoto: string;
      uid:string;
  }
  };