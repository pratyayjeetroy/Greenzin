// components/general/search.js

export function searchProducts(query, allProducts) {
  if (!query || query.trim() === "") return [];
  const q = query.toLowerCase();
  return allProducts.filter(product =>
    product.name.toLowerCase().includes(q) ||
    product.categories?.some(cat => cat.toLowerCase().includes(q))
  );
}

// export function getSearchRedirect(query, allProducts) {
//   if (!query || query.trim() === "") return null;
//   const q = query.toLowerCase();

//   // Step 1 — section name match e.g. "plants", "pots", "gifting"
//   const sectionMatch = allProducts.find(
//     product => product.section.toLowerCase().includes(q)
//   );
//   if (sectionMatch) {
//     return sectionMatch.url;
//   }

//   // Step 2 — product name match e.g. "ceramic pot"
//   for (const product of allProducts) {
//     if (product.name.toLowerCase().includes(q)) {
//       return `${product.url}?category=${encodeURIComponent(product.category[0])}`;
//     }
//     // Step 3 — category tag match e.g. "air purifying"
//     const matchedCat = product.category?.find(
//       cat => cat.toLowerCase().includes(q)
//     );
//     if (matchedCat) {
//       return `${product.url}?category=${encodeURIComponent(matchedCat)}`;
//     }
//   }

//   // Step 4 — no match → fallback to search page
//   return null;
// }