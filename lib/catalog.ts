import { createClient } from "@/lib/supabase/server";

type CatalogCategory = {
  id: number;
  name: string;
  slug: string;
  highlight: boolean;
};

type CatalogSubCategory = {
  id: number;
  name: string;
  slug: string;
};

export type CatalogProduct = {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
  stock: boolean;
  category: { name: string; slug: string } | null;
  subcategory: { name: string; slug: string } | null;
};

type ProductSort =
  | "alpha-asc"
  | "alpha-desc"
  | "price-asc"
  | "price-desc";

type ProductQueryFilters = {
  categorySlug?: string;
  subSlug?: string;
  sort?: ProductSort;
  q?: string;
};

function escapeIlikePattern(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

function normalizeRelation<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, highlight")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as CatalogCategory[];
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, highlight")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data as CatalogCategory | null;
}

export async function getSubCategories(categoryId?: number) {
  const supabase = await createClient();
  let query = supabase
    .from("sub-categories")
    .select("id, name, slug")
    .order("sort_order", { ascending: true });

  if (categoryId) {
    query = query.eq("category", categoryId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as CatalogSubCategory[];
}

export async function getProducts(filters: ProductQueryFilters = {}) {
  const supabase = await createClient();

  let categoryId: number | undefined;
  let subCategoryId: number | undefined;

  if (filters.categorySlug) {
    const category = await getCategoryBySlug(filters.categorySlug);
    if (!category) return [];
    categoryId = category.id;
  }

  if (filters.subSlug) {
    let subQuery = supabase
      .from("sub-categories")
      .select("id")
      .eq("slug", filters.subSlug);

    if (categoryId) {
      subQuery = subQuery.eq("category", categoryId);
    }

    const { data: sub, error: subError } = await subQuery.maybeSingle();
    if (subError) throw subError;
    if (!sub) return [];
    subCategoryId = sub.id;
  }

  let query = supabase.from("products").select(`
      id,
      name,
      price,
      image_url,
      stock,
      category:categories ( name, slug ),
      subcategory:"sub-categories" ( name, slug )
    `);

  if (categoryId) {
    query = query.eq("category", categoryId);
  }

  if (subCategoryId) {
    query = query.eq("sub-category", subCategoryId);
  }

  const search = filters.q?.trim();
  if (search) {
    query = query.ilike("name", `%${escapeIlikePattern(search)}%`);
  }

  switch (filters.sort) {
    case "price-asc":
      query = query.order("price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price", { ascending: false });
      break;
    case "alpha-desc":
      query = query.order("name", { ascending: false });
      break;
    case "alpha-asc":
    default:
      query = query.order("name", { ascending: true });
      break;
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id as number,
    name: row.name as string,
    price: Number(row.price ?? 0),
    image_url: (row.image_url as string | null) ?? null,
    stock: Boolean(row.stock),
    category: normalizeRelation(
      row.category as
        | { name: string; slug: string }
        | { name: string; slug: string }[]
        | null,
    ),
    subcategory: normalizeRelation(
      row.subcategory as
        | { name: string; slug: string }
        | { name: string; slug: string }[]
        | null,
    ),
  })) satisfies CatalogProduct[];
}

export function parseSort(value?: string): ProductSort {
  if (
    value === "alpha-asc" ||
    value === "alpha-desc" ||
    value === "price-asc" ||
    value === "price-desc"
  ) {
    return value;
  }
  return "alpha-asc";
}
