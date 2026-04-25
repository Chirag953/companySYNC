import type { Document, DocumentCategory } from "@/lib/types";

export const mockDocumentCategories: DocumentCategory[] = [
  { id: "dc-pan", name: "PAN Card" },
  { id: "dc-aadhaar", name: "Aadhaar" },
  { id: "dc-offer", name: "Offer Letter" },
  { id: "dc-contract", name: "Contract" },
  { id: "dc-cert", name: "Certificates" },
];

const owners = [
  "user-emp-1",
  "user-emp-2",
  "user-emp-3",
  "user-emp-4",
  "user-emp-5",
];

const cats = mockDocumentCategories;

export const mockDocuments: Document[] = Array.from({ length: 22 }).map((_, i) => {
  const ownerId = owners[i % owners.length];
  const categoryId = cats[i % cats.length].id;
  const expiring = i % 5 === 0;
  const expired = i % 11 === 0;
  const expiryDate = expired
    ? "2025-12-01"
    : expiring
      ? "2026-05-10"
      : "2027-01-01";
  const expiryStatus = expired
    ? "expired"
    : expiring
      ? "expiring_soon"
      : "valid";
  return {
    id: `doc-${i + 1}`,
    ownerId,
    categoryId,
    fileName: `document-${i + 1}.pdf`,
    uploadDate: `2026-03-${String((i % 28) + 1).padStart(2, "0")}`,
    expiryDate,
    expiryStatus,
  };
});
