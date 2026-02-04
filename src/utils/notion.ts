import { Client } from "@notionhq/client";
import fs from "fs/promises";
import path from "path";
import { type NotionPage, type NotionSubscription, type Person } from "../types/notion";

// Initialize Notion client
export const notion = new Client({
  auth: import.meta.env.NOTION_TOKEN,
  notionVersion: "2025-09-03",
});

/**
 * Saves an icon from a Notion page to a local folder
 */
export async function saveIconToFolder(page: NotionPage, folderName: string): Promise<string | undefined> {
  if (!page.icon?.[page.icon?.type]?.url) return undefined;
  
  const iconUrl = page.icon[page.icon.type].url;
  try {
    const response = await fetch(iconUrl);
    const extension = iconUrl.split("?")[0].split(".").pop()?.toLowerCase();

    // Handle different file types appropriately
    let iconData;
    if (extension === "svg") {
      iconData = await response.text();
    } else {
      const buffer = await response.arrayBuffer();
      iconData = Buffer.from(buffer);
    }

    // Ensure directory exists
    const iconDir = path.join(process.cwd(), "public", "assets", folderName);
    await fs.mkdir(iconDir, { recursive: true });

    // Save icon with ID as filename
    const iconPath = path.join(iconDir, `${page.id}.${extension}`);
    await fs.writeFile(iconPath, iconData);
    
    return `/assets/${folderName}/${page.id}.${extension}`;
  } catch (error) {
    console.error(`Error saving icon for ${folderName} ${page.id}:`, error);
    return undefined;
  }
}

/**
 * Formats a date string to a more readable format
 */
export function formatDate(dateString?: string): string | undefined {
  if (!dateString) return undefined;
  
  return new Date(dateString)
    .toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .replace(",", "");
}

/**
 * Extracts person information from a Notion subscription
 */
export function extractPersonFromSubscription(subscription: NotionSubscription): Person {
  return {
    id: subscription.properties.Volunteers?.relation?.[0]?.id || "",
    name: [
      subscription.properties["First Name"]?.rollup?.array?.[0]?.rich_text?.[0]?.plain_text || "",
      subscription.properties.Surname?.rollup?.array?.[0]?.rich_text?.[0]?.plain_text || ""
    ].filter(Boolean).join(" "),
    role: subscription.properties["Role for Subscription"]?.select?.name,
    city: subscription.properties.City?.rollup?.array?.[0]?.rich_text?.[0]?.plain_text,
    title: subscription.properties.Title?.rollup?.array?.[0]?.rich_text?.[0]?.plain_text,
    company: subscription.properties["API-MN"]?.formula?.string,
    linkedin: subscription.properties["Volunteer LinkedIn"]?.rollup?.array?.[0]?.url,
  };
}

/**
 * Creates a dictionary of organization leads grouped by company
 */
export function createOrgLeadsDict(subscriptionResponse: { results: NotionSubscription[] }): Record<string, Person[]> {
  return subscriptionResponse.results.reduce(
    (acc: Record<string, Person[]>, subscription: NotionSubscription) => {
      const company = subscription.properties["API-MN"]?.formula?.string;
      const role = subscription.properties["Role for Subscription"]?.select?.name;
      
      if (
        company &&
        (role === "Organization Lead" ||
          role === "Project Lead" ||
          role === "Committee Chair" ||
          role === "Committee Member")
      ) {
        if (!acc[company]) {
          acc[company] = [];
        }
        acc[company].push(extractPersonFromSubscription(subscription));
      }
      return acc;
    },
    {}
  );
}

/**
 * Renders Notion blocks to HTML
 */
export async function renderNotionBlocks(blocks: any[]): Promise<string> {
  let html = "";
  let currentListType: string | null = null;
  let listItems = "";

  const closeList = () => {
    if (currentListType) {
      html += currentListType === "bulleted_list_item" ? `<ul>${listItems}</ul>` : `<ol>${listItems}</ol>`;
      listItems = "";
      currentListType = null;
    }
  };

  for (const block of blocks) {
    // If we encounter a non-list item and we have an open list, close it
    if (block.type !== "bulleted_list_item" && block.type !== "numbered_list_item" && currentListType) {
      closeList();
    }

    switch (block.type) {
      case "paragraph":
        html += `<p>${await renderRichText(block.paragraph.rich_text)}</p>`;
        break;
      case "heading_1":
        html += `<h1>${await renderRichText(block.heading_1.rich_text)}</h1>`;
        break;
      case "heading_2":
        html += `<h2>${await renderRichText(block.heading_2.rich_text)}</h2>`;
        break;
      case "heading_3":
        html += `<h3>${await renderRichText(block.heading_3.rich_text)}</h3>`;
        break;
      case "bulleted_list_item":
        // If we're switching from numbered to bulleted, close the numbered list first
        if (currentListType === "numbered_list_item") {
          closeList();
        }
        
        // Start a new bulleted list if needed
        if (!currentListType) {
          currentListType = "bulleted_list_item";
        }
        
        listItems += `<li>${await renderRichText(block.bulleted_list_item.rich_text)}</li>`;
        break;
      case "numbered_list_item":
        // If we're switching from bulleted to numbered, close the bulleted list first
        if (currentListType === "bulleted_list_item") {
          closeList();
        }
        
        // Start a new numbered list if needed
        if (!currentListType) {
          currentListType = "numbered_list_item";
        }
        
        listItems += `<li>${await renderRichText(block.numbered_list_item.rich_text)}</li>`;
        break;
      case "code":
        html += `<pre><code class="language-${block.code.language}">${block.code.rich_text[0].plain_text}</code></pre>`;
        break;
      case "image":
        const imageUrl = block.image.type === "external" ? block.image.external.url : block.image.file.url;
        html += `<img src="${imageUrl}" alt="${block.image.caption?.[0]?.plain_text || ""}" />`;
        break;
      case "divider":
        html += `<hr />`;
        break;
      case "quote":
        html += `<blockquote>${await renderRichText(block.quote.rich_text)}</blockquote>`;
        break;
      case "callout":
        html += `<div class="callout">
          ${block.callout.icon?.emoji ? `<div class="callout-icon">${block.callout.icon.emoji}</div>` : ''}
          <div class="callout-content">${await renderRichText(block.callout.rich_text)}</div>
        </div>`;
        break;
      case "toggle":
        html += `<details>
          <summary>${await renderRichText(block.toggle.rich_text)}</summary>
          ${block.has_children ? await fetchAndRenderChildren(block.id) : ''}
        </details>`;
        break;
      case "to_do":
        const checked = block.to_do.checked ? 'checked' : '';
        html += `<div class="to-do-item">
          <input type="checkbox" ${checked} disabled />
          <span>${await renderRichText(block.to_do.rich_text)}</span>
        </div>`;
        break;
      case "table":
        if (block.has_children) {
          html += `<table><tbody>${await fetchAndRenderChildren(block.id)}</tbody></table>`;
        }
        break;
      case "table_row":
        html += `<tr>`;
        for (const cell of block.table_row.cells) {
          html += `<td>${await renderRichText(cell)}</td>`;
        }
        html += `</tr>`;
        break;
      case "bookmark":
        html += `<a href="${block.bookmark.url}" class="bookmark" target="_blank" rel="noopener noreferrer">
          ${block.bookmark.caption ? await renderRichText(block.bookmark.caption) : block.bookmark.url}
        </a>`;
        break;
      case "embed":
        html += `<div class="embed-container">
          <iframe src="${block.embed.url}" frameborder="0" allowfullscreen></iframe>
        </div>`;
        break;
      case "video":
        const videoUrl = block.video.type === "external" ? block.video.external.url : block.video.file.url;
        html += `<div class="video-container">
          <video controls src="${videoUrl}">${block.video.caption ? await renderRichText(block.video.caption) : ''}</video>
        </div>`;
        break;
      case "file":
        const fileUrl = block.file.type === "external" ? block.file.external.url : block.file.file.url;
        const fileName = block.file.caption?.[0]?.plain_text || "Download file";
        html += `<a href="${fileUrl}" class="file-link" target="_blank" rel="noopener noreferrer">${fileName}</a>`;
        break;
      case "table_of_contents":
        html += `<div class="table-of-contents">Table of Contents</div>`;
        break;
    }
  }

  // Close any open list at the end of processing
  if (currentListType) {
    closeList();
  }

  return html;
}

/**
 * Helper function to fetch and render child blocks
 */
async function fetchAndRenderChildren(blockId: string): Promise<string> {
  try {
    const response = await notion.blocks.children.list({
      block_id: blockId,
    });
    return await renderNotionBlocks(response.results);
  } catch (error) {
    console.error(`Error fetching children for block ${blockId}:`, error);
    return "";
  }
}

/**
 * Renders Notion rich text to HTML
 */
export async function renderRichText(richText: any[]): Promise<string> {
  let text = "";

  for (const textBlock of richText) {
    let content = textBlock.plain_text;

    if (textBlock.annotations.bold) {
      content = `<strong>${content}</strong>`;
    }
    if (textBlock.annotations.italic) {
      content = `<em>${content}</em>`;
    }
    if (textBlock.annotations.strikethrough) {
      content = `<del>${content}</del>`;
    }
    if (textBlock.annotations.underline) {
      content = `<u>${content}</u>`;
    }
    if (textBlock.annotations.code) {
      content = `<code>${content}</code>`;
    }
    if (textBlock.href) {
      content = `<a href="${textBlock.href}" target="_blank" rel="noopener noreferrer">${content}</a>`;
    }

    text += content;
  }

  return text;
}

/**
 * Fetches page content from Notion
 */
export async function fetchPageContent(pageId: string): Promise<string> {
  try {
    const pageBlocks = await notion.blocks.children.list({
      block_id: pageId,
    });
    return await renderNotionBlocks(pageBlocks.results);
  } catch (error) {
    console.error(`Error fetching page content for ${pageId}:`, error);
    return "";
  }
}
