export function getStaticMapUrl(
  lat: number,
  lng: number,
  width = 600,
  height = 300,
  zoom = 15
) {
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&markers=${lat},${lng},red-pushpin`;
}