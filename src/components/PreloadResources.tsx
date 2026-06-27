// Resource hints para los tiles del mapa. Renderizamos los <link> crudos: React 19
// los iza al <head> y los emite en el HTML (SSR), así el primer tile conecta antes.
// No cambia el proveedor de tiles (eso es la Fase 4). Server component: no necesita
// JS de cliente.
const TILE_HOSTS = [
  "https://a.tile.openstreetmap.org",
  "https://b.tile.openstreetmap.org",
  "https://c.tile.openstreetmap.org",
];

export function PreloadResources() {
  return TILE_HOSTS.flatMap((host) => [
    <link key={`preconnect-${host}`} rel="preconnect" href={host} />,
    <link key={`dns-${host}`} rel="dns-prefetch" href={host} />,
  ]);
}
