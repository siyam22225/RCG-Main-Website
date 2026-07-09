"use client";

import { useEffect, useState } from "react";
import styles from "./BusinessVerticalSettingsClient.module.css";

type BusinessVerticalItem = {
  id: string;
  label: string;
  enterpriseSlug: string | null;
  targetUrl: string | null;
  imageUrl: string | null;
  description: string | null;
  location: string | null;
  websiteUrl: string | null;
  displayOrder: number;
  isActive: boolean;
};

type BusinessVerticalCategory = {
  id: string;
  label: string;
  displayOrder: number;
  isActive: boolean;
  items: BusinessVerticalItem[];
};

export default function BusinessVerticalSettingsClient() {
  const [categories, setCategories] = useState<BusinessVerticalCategory[]>([]);

  const [categoryLabel, setCategoryLabel] = useState("");
  const [categoryOrder, setCategoryOrder] = useState("0");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryActive, setEditingCategoryActive] = useState(true);

  const [itemCategoryId, setItemCategoryId] = useState("");
  const [itemLabel, setItemLabel] = useState("");
  const [itemEnterpriseSlug, setItemEnterpriseSlug] = useState("");
  const [itemTargetUrl, setItemTargetUrl] = useState("");
  const [itemImageUrl, setItemImageUrl] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemLocation, setItemLocation] = useState("");
  const [itemWebsiteUrl, setItemWebsiteUrl] = useState("");
  const [itemOrder, setItemOrder] = useState("0");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItemActive, setEditingItemActive] = useState(true);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadData() {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/business-verticals", { cache: "no-store" });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Failed to load.");

      setCategories(data.categories || []);

      if (!itemCategoryId && data.categories?.length) {
        const firstActiveCategory = data.categories.find((category: BusinessVerticalCategory) => category.isActive) || data.categories[0];
        if (firstActiveCategory?.id) setItemCategoryId(firstActiveCategory.id);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendAction(payload: Record<string, unknown>) {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/business-verticals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Failed to save.");

      setMessage("Saved successfully.");
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save.");
    } finally {
      setLoading(false);
    }
  }

  function resetCategoryForm() {
    setEditingCategoryId(null);
    setEditingCategoryActive(true);
    setCategoryLabel("");
    setCategoryOrder("0");
  }

  function resetItemForm() {
    setEditingItemId(null);
    setEditingItemActive(true);
    setItemLabel("");
    setItemEnterpriseSlug("");
    setItemTargetUrl("");
    setItemImageUrl("");
    setItemDescription("");
    setItemLocation("");
    setItemWebsiteUrl("");
    setItemOrder("0");
  }

  async function saveCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await sendAction({
      action: editingCategoryId ? "updateCategory" : "createCategory",
      id: editingCategoryId,
      label: categoryLabel,
      displayOrder: Number(categoryOrder || 0),
      isActive: editingCategoryActive,
    });

    resetCategoryForm();
  }

  async function saveItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await sendAction({
      action: editingItemId ? "updateItem" : "createItem",
      id: editingItemId,
      categoryId: itemCategoryId,
      label: itemLabel,
      enterpriseSlug: itemEnterpriseSlug,
      targetUrl: itemTargetUrl,
      imageUrl: itemImageUrl,
      description: itemDescription,
      location: itemLocation,
      websiteUrl: itemWebsiteUrl,
      displayOrder: Number(itemOrder || 0),
      isActive: editingItemActive,
    });

    resetItemForm();
  }

  function editCategory(category: BusinessVerticalCategory) {
    setEditingCategoryId(category.id);
    setEditingCategoryActive(category.isActive);
    setCategoryLabel(category.label);
    setCategoryOrder(String(category.displayOrder));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function editItem(categoryId: string, item: BusinessVerticalItem) {
    setEditingItemId(item.id);
    setEditingItemActive(item.isActive);
    setItemCategoryId(categoryId);
    setItemLabel(item.label);
    setItemEnterpriseSlug(item.enterpriseSlug || "");
    setItemTargetUrl(item.targetUrl || "");
    setItemImageUrl(item.imageUrl || "");
    setItemDescription(item.description || "");
    setItemLocation(item.location || "");
    setItemWebsiteUrl(item.websiteUrl || "");
    setItemOrder(String(item.displayOrder));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className={styles.bvWrap}>
<div className={styles.bvGrid}>
        <form className={styles.bvCard} onSubmit={saveCategory}>
          <div className={styles.formHead}>
            <div>
              <h2>{editingCategoryId ? "Edit Category" : "Add Category"}</h2>
              <p>Example: Real Estate (Housing), Real Estate (Apartment), Information Technology.</p>
            </div>

            {editingCategoryId ? (
              <button type="button" className={styles.lightBtn} onClick={resetCategoryForm}>
                Cancel
              </button>
            ) : null}
          </div>

          <label>
            Category Name
            <input
              value={categoryLabel}
              onChange={(event) => setCategoryLabel(event.target.value)}
              placeholder="Real Estate (Housing)"
              required
            />
          </label>

          <label>
            Display Order
            <input
              type="number"
              value={categoryOrder}
              onChange={(event) => setCategoryOrder(event.target.value)}
            />
          </label>

          <label className={styles.checkRow}>
            <input
              type="checkbox"
              checked={editingCategoryActive}
              onChange={(event) => setEditingCategoryActive(event.target.checked)}
            />
            Active
          </label>

          <button type="submit" disabled={loading}>
            {editingCategoryId ? "Update Category" : "Add Category"}
          </button>
        </form>

        <form className={styles.bvCard} onSubmit={saveItem}>
          <div className={styles.formHead}>
            <div>
              <h2>{editingItemId ? "Edit Sub Category" : "Add Sub Category"}</h2>
              <p>Example: RC Property under Real Estate (Housing).</p>
            </div>

            {editingItemId ? (
              <button type="button" className={styles.lightBtn} onClick={resetItemForm}>
                Cancel
              </button>
            ) : null}
          </div>

          <label>
            Parent Category
            <select
              value={itemCategoryId}
              onChange={(event) => setItemCategoryId(event.target.value)}
              required
            >
              <option value="">Select category</option>
              {categories
                .filter((category) => category.isActive)
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
            </select>
          </label>

          <label>
            Sub Category Name
            <input
              value={itemLabel}
              onChange={(event) => setItemLabel(event.target.value)}
              placeholder="RC Property"
              required
            />
          </label>

          <label>
            Enterprise Slug
            <input
              value={itemEnterpriseSlug}
              onChange={(event) => setItemEnterpriseSlug(event.target.value)}
              placeholder="rc-property"
            />
          </label>

          <label>
            Custom URL
            <input
              value={itemTargetUrl}
              onChange={(event) => setItemTargetUrl(event.target.value)}
              placeholder="/business-verticals/rc-property"
            />
          </label>

          <label>
            Image URL
            <input
              value={itemImageUrl}
              onChange={(event) => setItemImageUrl(event.target.value)}
              placeholder="/images/example.jpg"
            />
          </label>

          <label>
            Location
            <input
              value={itemLocation}
              onChange={(event) => setItemLocation(event.target.value)}
              placeholder="Dhaka, Bangladesh"
            />
          </label>

          <label>
            Visit Website URL
            <input
              value={itemWebsiteUrl}
              onChange={(event) => setItemWebsiteUrl(event.target.value)}
              placeholder="https://example.com"
            />
          </label>

          <label>
            Description
            <textarea
              value={itemDescription}
              onChange={(event) => setItemDescription(event.target.value)}
              placeholder="Short description for this business vertical item."
              rows={4}
            />
          </label>

          <label>
            Display Order
            <input
              type="number"
              value={itemOrder}
              onChange={(event) => setItemOrder(event.target.value)}
            />
          </label>

          <label className={styles.checkRow}>
            <input
              type="checkbox"
              checked={editingItemActive}
              onChange={(event) => setEditingItemActive(event.target.checked)}
            />
            Active
          </label>

          <button type="submit" disabled={loading}>
            {editingItemId ? "Update Sub Category" : "Add Sub Category"}
          </button>
        </form>
      </div>

      {message ? <p className={styles.message}>{message}</p> : null}

      <div className={`${styles.bvCard} listCard`}>
        <div className={styles.listHeader}>
          <div>
            <h2>Business Vertical List</h2>
            <p>Current dynamic categories and sub-categories.</p>
          </div>
          <span>{categories.length} Categories</span>
        </div>

        {categories.length === 0 ? (
          <div className={styles.emptyState}>
            No category added yet. Add categories and sub-categories from the forms above.
          </div>
        ) : (
          <div className={styles.categoryList}>
            {categories.map((category) => (
              <div className={styles.categoryBox} key={category.id}>
                <div className={styles.categoryHead}>
                  <div>
                    <h3>{category.label}</h3>
                    <p>
                      Order: {category.displayOrder} | Status:{" "}
                      {category.isActive ? "Active" : "Hidden"}
                    </p>
                  </div>

                  <div className={styles.actions}>
                    <button type="button" onClick={() => editCategory(category)}>
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        sendAction({
                          action: "updateCategory",
                          id: category.id,
                          label: category.label,
                          displayOrder: category.displayOrder,
                          isActive: !category.isActive,
                        })
                      }
                    >
                      {category.isActive ? "Hide" : "Show"}
                    </button>

                    <button
                      type="button"
                      className={styles.danger}
                      onClick={() => {
                        if (confirm("Delete this category and its sub-categories?")) {
                          sendAction({ action: "deleteCategory", id: category.id });
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {category.items.length === 0 ? (
                  <p className={styles.noItem}>No sub-category added.</p>
                ) : (
                  <div className={styles.itemList}>
                    {category.items.map((item) => (
                      <div className={styles.itemRow} key={item.id}>
                        <div>
                          <strong>{item.label}</strong>
                          <span>
                            {item.targetUrl ||
                              (item.enterpriseSlug
                                ? `/business-verticals/${item.enterpriseSlug}`
                                : "No link")}
                          </span>
                          {item.location ? <small>Location: {item.location}</small> : null}
                          {item.websiteUrl ? <small>Website: {item.websiteUrl}</small> : null}
                          {item.imageUrl ? <small>Image: {item.imageUrl}</small> : null}
                          {item.description ? <small>Description: {item.description}</small> : null}
                          <small>
                            Order: {item.displayOrder} | Status:{" "}
                            {item.isActive ? "Active" : "Hidden"}
                          </small>
                        </div>

                        <div className={styles.actions}>
                          <button type="button" onClick={() => editItem(category.id, item)}>
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              sendAction({
                                action: "updateItem",
                                id: item.id,
                                label: item.label,
                                enterpriseSlug: item.enterpriseSlug,
                                targetUrl: item.targetUrl,
                                imageUrl: item.imageUrl,
                                description: item.description,
                                location: item.location,
                                websiteUrl: item.websiteUrl,
                                displayOrder: item.displayOrder,
                                isActive: !item.isActive,
                              })
                            }
                          >
                            {item.isActive ? "Hide" : "Show"}
                          </button>

                          <button
                            type="button"
                            className={styles.danger}
                            onClick={() => {
                              if (confirm("Delete this sub-category?")) {
                                sendAction({ action: "deleteItem", id: item.id });
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      
    </div>
  );
}
