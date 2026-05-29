import DOMPurify from "dompurify";

type ArticleBodyProps = {
  body: string[];
};

function looksLikeHtml(value: string): boolean {
  return /<[a-z][\s\S]*>/i.test(value);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function bodyToHtml(body: string[]): string {
  if (body.length === 0) return "";

  if (body.length === 1 && looksLikeHtml(body[0] ?? "")) {
    return body[0] ?? "";
  }

  if (body.some((block) => looksLikeHtml(block))) {
    return body
      .map((block) =>
        looksLikeHtml(block) ? block : `<p>${escapeHtml(block)}</p>`,
      )
      .join("");
  }

  return body.map((block) => `<p>${escapeHtml(block)}</p>`).join("");
}

function sanitizeArticleHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_TAGS: ["iframe"],
    ADD_ATTR: [
      "target",
      "rel",
      "src",
      "alt",
      "title",
      "width",
      "height",
      "allow",
      "allowfullscreen",
      "frameborder",
    ],
  });
}

export function ArticleBody({ body }: ArticleBodyProps) {
  const html = bodyToHtml(body);

  if (!html.trim()) {
    return null;
  }

  if (looksLikeHtml(html)) {
    return (
      <div
        className="article-detail__body article-detail__body--rich"
        dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(html) }}
      />
    );
  }

  return (
    <div className="article-detail__body">
      {body.map((paragraph, index) => (
        <p key={`p-${index}`}>{paragraph}</p>
      ))}
    </div>
  );
}
