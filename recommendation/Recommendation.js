function filterById(jsonObject, id) {
  return jsonObject.filter(function (jsonObject) {
    return jsonObject["name"] == id;
  })[0];
}

const countOccurrences = (arr, val) =>
  arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const calculateUserPreferredCategory = (likedPlaces, data, topCategories) => {
  var likedCategories = [];
  likedPlaces.forEach((place) => {
    const filter = filterById(data, place);
    if (filter) likedCategories.push(capitalizeFirstLetter(filter.category));
  });
  var map = new Map();
  likedCategories.forEach((category) => {
    map.set(category, countOccurrences(likedCategories, category));
  });
  topCategories.forEach((category) => {
    if (category.visitedCount > 0) {
      if (isNaN(map.get(category.category))) map.set(category.category, 0);
      map.set(
        category.category,
        map.get(category.category) + category.visitedCount / 3
      );

      console.log(map.get(category.category));
    }
  });
  const sortedCategories = new Map(
    [...map.entries()].sort((a, b) => b[1] - a[1])
  );
  return [...sortedCategories.keys()];
};

// Returns similar places a specific place
export const getSimilarPlaces = (place, similarity, userPreference, data) => {
  var matrix = similarity.getDistanceMatrix();

  const index = matrix.identifiers.indexOf(place);
  var placeMatrix = matrix.matrix[index];
  var map = new Map();

  for (var i = 0; i < placeMatrix.length; i++) {
    // Check if place category is in any of his favorite categories
    // and if yes, multiply the score of the place
    if (userPreference.includes(data[i].category)) {
      if (userPreference[0] == data[i].category) placeMatrix[i] *= 3;
      if (userPreference[1] == data[i].category) placeMatrix[i] *= 2.5;
      if (userPreference[2] == data[i].category) placeMatrix[i] *= 2;
    }
    if (filterById(data, place).category == data[i].category) {
      placeMatrix[i] *= 3;
    } else {
      placeMatrix[i] *= 0.2;
    }
    if (parseFloat(placeMatrix[i]) > 0.2)
      map.set(matrix.identifiers[i], placeMatrix[i]);
  }
  const sortedSimilarPlaces = new Map(
    [...map.entries()].sort((a, b) => b[1] - a[1])
  );
  return sortedSimilarPlaces;
};

// Returns similar places to user preference
export const getPreference = (
  preferenceId,
  similarity,
  isInit,
  data,
  likedPlaces,
  topCategories
) => {
  if (!preferenceId) return [];
  var preferences = [];
  const userPreference = calculateUserPreferredCategory(
    preferenceId,
    data,
    topCategories
  );
  console.log(userPreference);
  preferenceId.forEach((preference) => {
    getSimilarPlaces(preference, similarity, userPreference, data).forEach(
      (place, key) => {
        if (isInit) {
          if (!likedPlaces.includes(key)) preferences.push([key, place]);
        } else {
          if (!preferenceId.includes(key)) {
            preferences.push([key, place]);
          }
        }
      }
    );
  });
  var sortedArray = preferences.sort(function (a, b) {
    return a[1] - b[1];
  });
  const recommendedPlaces = new Map();
  sortedArray.forEach((element) => {
    recommendedPlaces.set(element[0], element[1]);
  });
  const sortedRecommendedPlaces = new Map(
    [...recommendedPlaces.entries()].sort((a, b) => b[1] - a[1])
  );

  // Return top 15 places
  return Array.from(sortedRecommendedPlaces).slice(0, 15);
};
