import { useLayoutEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useCatalog } from "../../app/context/catalog-context";
import { mapLegacyWordPressCategoryId } from "../../shared/lib/legacy-category-map";

/** Köhnə `/category/:id` və `/category/:id/pg/:page` URL-ləri */
export function LegacyCategoryRedirect() {
  const { legacyId } = useParams<{ legacyId: string }>();
  const { setActiveView } = useCatalog();
  const category = mapLegacyWordPressCategoryId(legacyId);

  useLayoutEffect(() => {
    if (category) setActiveView(category);
  }, [category, setActiveView]);

  return <Navigate to="/" replace />;
}
