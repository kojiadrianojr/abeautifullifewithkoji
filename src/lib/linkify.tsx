import { Link } from "@chakra-ui/react";
import React from "react";

/**
 * Converts URLs in text to clickable links
 * Supports both plain URLs and markdown-style links [text](url)
 */
export function linkifyText(text: string): React.ReactNode[] {
  if (!text) return [text];

  const elements: React.ReactNode[] = [];
  let key = 0;

  // First, handle markdown-style links [text](url)
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

  // Store markdown link positions to avoid double-processing
  const markdownLinks: Array<{ start: number; end: number; text: string; url: string }> = [];
  let match;

  while ((match = markdownLinkRegex.exec(text)) !== null) {
    markdownLinks.push({
      start: match.index,
      end: match.index + match[0].length,
      text: match[1],
      url: match[2],
    });
  }

  // Process the text
  let currentPos = 0;
  
  // If there are markdown links, process them first
  if (markdownLinks.length > 0) {
    markdownLinks.forEach((mdLink) => {
      // Add text before the markdown link
      if (currentPos < mdLink.start) {
        const beforeText = text.slice(currentPos, mdLink.start);
        // Check for plain URLs in the before text
        const urlParts = linkifyPlainUrls(beforeText, key);
        elements.push(...urlParts);
        key += urlParts.length;
      }

      // Add the markdown link
      elements.push(
        <Link
          key={key++}
          href={mdLink.url}
          color="primary.500"
          textDecoration="underline"
          _hover={{ color: "primary.600" }}
          isExternal
        >
          {mdLink.text}
        </Link>
      );

      currentPos = mdLink.end;
    });

    // Add remaining text after last markdown link
    if (currentPos < text.length) {
      const remainingText = text.slice(currentPos);
      const urlParts = linkifyPlainUrls(remainingText, key);
      elements.push(...urlParts);
    }
  } else {
    // No markdown links, just process plain URLs
    const urlParts = linkifyPlainUrls(text, key);
    elements.push(...urlParts);
  }

  return elements;
}

/**
 * Helper function to convert plain URLs to links
 */
function linkifyPlainUrls(text: string, startKey: number): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  let lastIndex = 0;
  let key = startKey;
  let match;

  while ((match = urlRegex.exec(text)) !== null) {
    // Add text before the URL
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index));
    }

    // Add the URL as a link
    elements.push(
      <Link
        key={key++}
        href={match[0]}
        color="primary.500"
        textDecoration="underline"
        _hover={{ color: "primary.600" }}
        isExternal
      >
        {match[0]}
      </Link>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  // If no URLs were found, return the original text
  if (elements.length === 0) {
    elements.push(text);
  }

  return elements;
}
