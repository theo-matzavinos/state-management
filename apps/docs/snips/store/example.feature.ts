import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

export type GameState = {
  player1: number;
  player2: number;
};

const initialState: GameState = {
  player1: 0,
  player2: 0,
};

export const gameFeature = createFeature({
  name: 'game',
  reducer: createReducer(
    initialState,
    on(
      gameActions.player1Scored,
      (state, action): GameState => ({
        ...state,
        player1: state.player1 + action.points,
      }),
    ),
    on(
      gameActions.player2Scored,
      (state, action): GameState => ({
        ...state,
        player2: state.player2 + action.points,
      }),
    ),
    on(gameActions.reset, (): GameState => initialState),
  ),
  extraSelectors({ selectPlayer1, selectPlayer2 }) {
    return {
      selectWinner: createSelector(
        selectPlayer1,
        selectPlayer2,
        (player1, player2) => {
          if (player1 > player2) {
            return 'player 1';
          }

          if (player1 < player2) {
            return 'player 2';
          }

          return 'draw';
        },
      ),
    };
  },
});

// const gameFeature = {
//     name,                <- Feature name ('game')
//     reducer,             <- Feature reducer
//     selectGameState,     <- Feature state selector. Automatically created.
//     selectPlayer1,       <- Property selector. Automatically created.
//     selectPlayer2,       <- Property selector. Automatically created.
//     selectWinner         <- Extra selector. Created by extraSelectors.
// };
