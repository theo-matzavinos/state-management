import { createSelector } from '@ngrx/store';

export const selectSecrets = createSelector((state) => state.secrets);
export const selectPassword = createSelector(
  selectSecrets,
  (secrets) => secrets.password,
);
export const selectAfm = createSelector(
  selectSecrets,
  selectIsAuthorized,
  (secrets, isAuthorized) => (isAuthorized ? secrets.afm : 'Nah, fam!'),
);
