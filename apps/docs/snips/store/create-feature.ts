export function createFeature(featureConfig: {
  name: string;
  reducer: Reducer;
  extraSelectors?: Record<string, Selector>;
}): StoreFeature;
