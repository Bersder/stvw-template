import { ADD_COUNT } from './mutation-types';
import { State } from './types';

export default {
  [ADD_COUNT](state: State): void {
    state.count++;
  }
};