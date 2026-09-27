import type { MetadataRoute } from "next";
import {
  animations,
  backgrounds,
  blocks,
  components,
  sites,
  skills,
  templates,
  themes,
} from "@/lib/registry";
import { absUrl, COMMUNITY_ENABLED } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const indexes: MetadataRoute.Sitemap = [
    { url: absUrl("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    { url: absUrl("/docs"), lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: absUrl("/about"), lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: absUrl("/components"), lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: absUrl("/blocks"), lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: absUrl("/animations"), lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: absUrl("/backgrounds"), lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: absUrl("/templates"), lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: absUrl("/sites"), lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: absUrl("/themes"), lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: absUrl("/skills"), lastModified, changeFrequency: "weekly", priority: 0.8 },
    ...(COMMUNITY_ENABLED
      ? ([
          { url: absUrl("/community"), lastModified, changeFrequency: "daily", priority: 0.7 },
          { url: absUrl("/showcase"), lastModified, changeFrequency: "daily", priority: 0.7 },
        ] as const)
      : []),
    { url: absUrl("/icons"), lastModified, changeFrequency: "monthly", priority: 0.3 },
  ];

  const items: MetadataRoute.Sitemap = [
    ...components.map((item) => ({
      url: absUrl(`/components/${item.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...blocks.map((item) => ({
      url: absUrl(`/blocks/${item.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...animations.map((item) => ({
      url: absUrl(`/animations/${item.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...backgrounds.map((item) => ({
      url: absUrl(`/backgrounds/${item.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...templates.map((item) => ({
      url: absUrl(`/templates/${item.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...sites.map((item) => ({
      url: absUrl(`/sites/${item.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...themes.map((item) => ({
      url: absUrl(`/themes/${item.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...skills.map((item) => ({
      url: absUrl(`/skills/${item.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return [...indexes, ...items];
}
