// Resource hints para los tiles del mapa (Carto). Renderizamos los <link> crudos:
// React 19 los iza al <head> y los emite en el HTML (SSR), así el primer tile
// conecta antes. Host único, así que un solo preconnect. Server component: no
// necesita JS de cliente.
const TILE_HOSTS = ["https://basemaps.cartocdn.com"];

export function PreloadResources() {
  return TILE_HOSTS.flatMap((host) => [
    <link key={`preconnect-${host}`} rel="preconnect" href={host} />,
    <link key={`dns-${host}`} rel="dns-prefetch" href={host} />,
  ]);
}
