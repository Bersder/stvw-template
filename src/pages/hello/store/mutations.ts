import { ADD_COUNT } from './types';

export default {
  [ADD_COUNT](state): void {
    state.count++;
  }
};