import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import site from '../data/site.json';

export const prerender = true;

export const GET: APIRoute = async ({ site: astroSite }) => {
  const posts = await getCollection('blog');
  const sorted = posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
  const baseUrl = astroSite?.toString() ?? 'https://marcialfantini.com';

  const escapeXml = (s: string) => s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  const items = sorted.map((post) => {
    const url = `${baseUrl}blog/${post.id}`;
    const pubDate = post.data.pubDate.toUTCString();
    return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.data.description)}</description>
      <category>${escapeXml(post.data.category)}</category>
      <author>${escapeXml(site.email)} (${escapeXml(site.name)})</author>
    </item>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)} — Blog</title>
    <link>${baseUrl}blog</link>
    <description>${escapeXml(site.description)}</description>
    <language>es-AR</language>
    <atom:link href="${baseUrl}rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};