/*import { Middleware } from '@reduxjs/toolkit';
import { isTokenExpired } from './helper';
 // Adjust the import path as needed

const authMiddleware: Middleware = store => next => async action => {
  // Only intercept actions that make API calls
  if (action.type.startsWith('fetch') || action.type.startsWith('syncRecipe')) {
    const tokenExpired = await isTokenExpired();
    if (tokenExpired) {
      console.log('Token expired, redirecting to login...');
      store.dispatch(logout()); // Dispatch a logout action or handle token expiry
      return;
    }
  }
  return next(action);
};

export default authMiddleware;
*/