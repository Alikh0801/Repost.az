import { useEffect } from "react";
import { setPageMeta, type PageMetaInput } from "./set-page-meta";

type PageMetaProps = PageMetaInput;

export function PageMeta(props: PageMetaProps) {
  const {
    title,
    description,
    canonicalPath,
    imageUrl,
    type,
    locale,
    noIndex,
  } = props;

  useEffect(() => {
    setPageMeta({
      title,
      description,
      canonicalPath,
      imageUrl,
      type,
      locale,
      noIndex,
    });
  }, [
    title,
    description,
    canonicalPath,
    imageUrl,
    type,
    locale,
    noIndex,
  ]);

  return null;
}
