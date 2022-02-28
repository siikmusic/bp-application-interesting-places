
function filterById(jsonObject, id) {return jsonObject.filter(function(jsonObject) {return (jsonObject['name'] == id);})[0];}
const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const calculateUserPreferredCategory = (likedPlaces, data) => {
    var likedCategories = []
    likedPlaces.forEach(place => {
      const filter = filterById(data, place)
      if(filter) likedCategories.push(capitalizeFirstLetter(filter.category))
    })
    var map = new Map()
    likedCategories.forEach(category => {
        map.set(category, countOccurrences(likedCategories, category))
    })
    const sortedCategories = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
    return [...sortedCategories.keys()]
}
// Returns similar places a specific place
export const getSimilarPlaces = (place, similarity, userPreference, data) => {
  var matrix = similarity.getDistanceMatrix()

  const index = matrix.identifiers.indexOf(place)
  var placeMatrix = matrix.matrix[index]
  var map = new Map()
  for(var i = 0; i < (placeMatrix.length); i++) {
    if(userPreference.includes(data[i].category) ) {
      if(userPreference[0] == data[i].category )
        placeMatrix[i] *= 1.5
      if(userPreference[1] == data[i].category )
        placeMatrix[i] *= 1.4
      if(userPreference[2] == data[i].category )
        placeMatrix[i] *= 1.2   
    } 
    if(filterById(data,place).category == data[i].category)
      placeMatrix[i] *= 2
    else {
      placeMatrix[i] *= 0.5
    }
    if(parseFloat(placeMatrix[i]) > 0.05) 
      map.set(matrix.identifiers[i], placeMatrix[i])
  }
  const sortedSimilarPlaces = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
  return sortedSimilarPlaces;
}

// Returns similar places to user preference
export const getPreference = (preferenceId, similarity, isInit, data, likedPlaces) => { 
  if(!preferenceId) return [];
  var preferences = []
  const userPreference = calculateUserPreferredCategory(preferenceId, data);
  console.log(userPreference)
  preferenceId.forEach(preference => {
    getSimilarPlaces(preference, similarity, userPreference, data).forEach((place, key) => {
      if(isInit) {
        if(!likedPlaces.includes(key))
          preferences.push([key, place])
      }else { 
        if(!preferenceId.includes(key)) {
          preferences.push([key, place])
        }
      }
    })
    })
    var sortedArray = preferences.sort(function(a, b) {

      return a[1] - b[1];
    });
    const recommendedPlaces = new Map();
    sortedArray.forEach(element =>{
      recommendedPlaces.set(element[0], element[1])
    })
    const sortedRecommendedPlaces = new Map([...recommendedPlaces.entries()].sort((a, b) => b[1] - a[1]));
    return(Array.from(sortedRecommendedPlaces).slice(0,15))

} 