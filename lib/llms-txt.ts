import {
  animations,
  backgrounds,
  blocks,
  charts,
  components,
  skills,
  templates,
  themes,
} from "@/lib/registry";
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/site";

function list(items: { slug: string; name: string }[], base: string) {
  return items.map((item) => `- ${item.name} (${item.slug}): ${SITE_URL}${base}/${item.slug}`).join("\n");
}

export function llmsTxt(): string {
  return `# VibeFarsi (وایب‌فارسی)

> ${SITE_DESCRIPTION}

VibeFarsi is a copy-into-your-repo RTL UI kit for Persian (Farsi) React and Next.js apps. It is not an npm package of React components. \`npx vibefarsi\` writes files into the project; after that the code is yours.

## What it is
- Native RTL components (layout, icons, focus), not a \`dir="rtl"\` wrapper on a LTR kit
- Persian digits, toman, Jalali calendar, IBAN/Sheba, national ID, Iranian plate
- English prompts plus an MCP server so coding agents follow Persian rules
- Agent skills (SKILL.md) and guides for Persian writing, RTL UI, Jalali dates, Iranian validation, SEO, ParsPack S3 upload, Zarinpal payments and Kavenegar OTP
- Free and open source

## What it is not
- Not a runtime you import from \`node_modules\` (the npm package is the CLI / MCP only)
- Not a left-to-right shadcn port
- Not a hosted design tool

## Install
\`\`\`
npx vibefarsi@latest init
npx vibefarsi add button calendar price
npx vibefarsi list
\`\`\`

Docs: ${SITE_URL}/docs
MCP: ${SITE_URL}/mcp  (also \`npx -y @vibefarsi/mcp\`)

## Counts
- ${components.length} components
- ${blocks.length} blocks
- ${charts.length} charts
- ${animations.length} animations
- ${backgrounds.length} backgrounds
- ${templates.length} templates
- ${themes.length} design systems
- ${skills.length} skills and guides

## Site map
- Home: ${SITE_URL}/
- Quick start: ${SITE_URL}/docs
- About: ${SITE_URL}/about
- Components: ${SITE_URL}/components
- Blocks: ${SITE_URL}/blocks
- Charts: ${SITE_URL}/charts
- Animations: ${SITE_URL}/animations
- Backgrounds: ${SITE_URL}/backgrounds
- Templates: ${SITE_URL}/templates
- Themes: ${SITE_URL}/themes
- Skills: ${SITE_URL}/skills
- Full catalog: ${SITE_URL}/llms-full.txt
`;
}

export function llmsFullTxt(): string {
  return `${llmsTxt()}
## Components
${list(components, "/components")}

## Blocks
${list(blocks, "/blocks")}

## Charts
${list(charts, "/charts")}

## Animations
${list(animations, "/animations")}

## Backgrounds
${list(backgrounds, "/backgrounds")}

## Templates
${list(templates, "/templates")}

## Themes
${list(themes, "/themes")}

## Skills
${list(skills, "/skills")}
`;
}
