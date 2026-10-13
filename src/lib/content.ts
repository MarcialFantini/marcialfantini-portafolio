import { getCollection } from "astro:content";

// Unico lugar donde se filtran borradores. Todo consumidor de blog/proyectos
// pasa por aca: un item con `draft: true` no se publica en ningun lado.

export async function getPublishedPosts() {
  return (await getCollection("blog", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );
}

export async function getPublishedProjects() {
  return (await getCollection("proyectos", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.fecha.getTime() - a.data.fecha.getTime(),
  );
}

export async function hasPublishedPosts() {
  return (await getPublishedPosts()).length > 0;
}

export async function hasPublishedProjects() {
  return (await getPublishedProjects()).length > 0;
}
