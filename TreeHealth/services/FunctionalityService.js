/*
** This code is to standardized the functions used to process GeoJSON data
*/

// input GeoJSON content and a keyword
export function searchName_GeoJSON(GeoJSON, keyword) {
  // Returns a GeoJSON list of points that have the keyword in its title
  return GeoJSON.features.filter(points =>
    points.properties.title
      .toLowerCase()
      .includes(keyword.toString().toLowerCase())
  );
}
// input GeoJSON content and a keyword
export function searchNameForCoords(GeoJSON, keyword) {
  // Limits the results of the GeoJSON to the correct point
  let result_GeoJSON = searchName_GeoJSON(GeoJSON, keyword);
  // Returns an array coordinates for the point with keyword in its title
  return result_GeoJSON.features.map(features => features.geometry.coordinates);
}

// input GeoJSON content and a project identifier
export function filterProject_GeoJSON(GeoJSON, projectID) {
  // Returns a GeoJSON list of points that have the project identifier
  return GeoJSON.features.filter(
    points => points.properties.category == parseInt(projectID)
  );
}

// input GeoJSON content
export function getProjectLst(GeoJSON) {
  // returns a list of points' titles
  return GeoJSON.features.map(features => features.properties.title);
}

// input GeoJSON content
export function getProjectLstInfo(GeoJSON) {
  // returns a list of points' title, description, and prefered image
  return GeoJSON.features.map(features => ({
    title: features.properties.title,
    description: features.properties.description,
    image: features.properties.description
  }));
}
