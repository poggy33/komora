"use client";

import { useMemo, useState } from "react";
import type { EditablePropertyMediaItem } from "lib/properties";
import {
  deletePropertyImageFromSupabase,
  setPropertyCoverImageInSupabase,
  uploadAdditionalPropertyImages,
} from "lib/properties";

type Props = {
  propertyId: string;
  initialMedia: EditablePropertyMediaItem[];
  initialCoverImageUrl: string | null;
};

export default function PropertyPhotoManager({
  propertyId,
  initialMedia,
  initialCoverImageUrl,
}: Props) {
  const [media, setMedia] = useState<EditablePropertyMediaItem[]>(initialMedia);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(
    initialCoverImageUrl,
  );
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [busyMediaId, setBusyMediaId] = useState<string | null>(null);

  const totalCount = media.length + pendingFiles.length;
  const canAddMore = totalCount < 10;

  const handleFilesChange = (files: FileList | null) => {
    if (!files) return;

    const incoming = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );

    const oversized = incoming.find((file) => file.size > 5 * 1024 * 1024);
    if (oversized) {
      alert(`Файл "${oversized.name}" більший за 5 MB`);
      return;
    }

    setPendingFiles((prev) => {
      const next = [...prev, ...incoming];

      const deduped = next.filter((file, index, arr) => {
        return (
          arr.findIndex(
            (item) =>
              item.name === file.name &&
              item.size === file.size &&
              item.lastModified === file.lastModified,
          ) === index
        );
      });

      return deduped.slice(0, Math.max(0, 10 - media.length));
    });
  };

  const removePendingFile = (indexToRemove: number) => {
    setPendingFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleUploadPending = async () => {
    if (pendingFiles.length === 0) return;

    try {
      setIsUploading(true);

      const uploaded = await uploadAdditionalPropertyImages(
        propertyId,
        pendingFiles,
        media.length,
      );

      const nextMedia = [...media, ...uploaded].sort(
        (a, b) => a.position - b.position,
      );

      setMedia(nextMedia);
      setPendingFiles([]);
    } catch (error) {
      console.error(error);
      alert("Не вдалося завантажити нові фото");
    } finally {
      setIsUploading(false);
    }
  };

  const handleMakeCover = async (item: EditablePropertyMediaItem) => {
    try {
      setBusyMediaId(item.id);
      await setPropertyCoverImageInSupabase(propertyId, item.publicUrl);
      setCoverImageUrl(item.publicUrl);
    } catch (error) {
      console.error(error);
      alert("Не вдалося оновити головне фото");
    } finally {
      setBusyMediaId(null);
    }
  };

  const handleDelete = async (item: EditablePropertyMediaItem) => {
    if (media.length <= 1) {
      alert("У оголошення має залишитися хоча б одне фото");
      return;
    }

    const confirmed = window.confirm("Видалити це фото?");
    if (!confirmed) return;

    try {
      setBusyMediaId(item.id);
      await deletePropertyImageFromSupabase(propertyId, item.id);

      const nextMedia = media.filter((m) => m.id !== item.id);
      setMedia(nextMedia);

      if (coverImageUrl === item.publicUrl) {
        setCoverImageUrl(nextMedia[0]?.publicUrl ?? null);
      }
    } catch (error) {
      console.error(error);
      alert("Не вдалося видалити фото");
    } finally {
      setBusyMediaId(null);
    }
  };

  return (
    <div style={wrapperStyle}>
      <div style={headerStyle}>
        <div>
          <div style={titleStyle}>Фото оголошення</div>
          <div style={hintStyle}>
            Від 1 до 10 фото. Перше або вибране фото буде головним.
          </div>
        </div>

        <div style={counterStyle}>{media.length}/10</div>
      </div>

      {media.length > 0 && (
        <div style={gridStyle}>
          {media.map((item, index) => {
            const isCover = coverImageUrl === item.publicUrl;

            return (
              <div key={item.id} style={cardStyle}>
                <div style={imageWrapStyle}>
                  <img
                    src={item.publicUrl}
                    alt={`Property image ${index + 1}`}
                    style={imageStyle}
                  />
                </div>

                <div style={cardMetaStyle}>
                  <div style={badgeRowStyle}>
                    <span style={indexBadgeStyle}>Фото {index + 1}</span>
                    {isCover && <span style={coverBadgeStyle}>Головне</span>}
                  </div>

                  <div style={actionsRowStyle}>
                    {!isCover ? (
                      <button
                        type="button"
                        onClick={() => handleMakeCover(item)}
                        disabled={busyMediaId === item.id}
                        style={makeCoverButtonStyle}
                      >
                        {busyMediaId === item.id ? "..." : "Зробити головним"}
                      </button>
                    ) : (
                      <div style={coverPlaceholderStyle}>Головне фото</div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      disabled={busyMediaId === item.id || media.length <= 1}
                      style={trashButtonStyle}
                      aria-label="Видалити фото"
                      title="Видалити фото"
                    >
                      {busyMediaId === item.id ? "..." : "🗑"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={uploadBoxStyle}>
        <div style={uploadTitleStyle}>Додати нові фото</div>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            handleFilesChange(e.target.files);
            e.currentTarget.value = "";
          }}
          disabled={!canAddMore}
          style={fileInputStyle}
        />

        <div style={hintStyle}>
          Можна додати ще {Math.max(0, 10 - media.length)} фото.
        </div>

        {pendingFiles.length > 0 && (
          <div style={pendingListStyle}>
            {pendingFiles.map((file, index) => (
              <div key={`${file.name}-${index}`} style={pendingItemStyle}>
                <div style={pendingNameStyle}>{file.name}</div>
                <button
                  type="button"
                  onClick={() => removePendingFile(index)}
                  style={removePendingStyle}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={handleUploadPending}
          disabled={pendingFiles.length === 0 || isUploading}
          style={{
            ...primaryButtonStyle,
            opacity: pendingFiles.length === 0 || isUploading ? 0.6 : 1,
            cursor:
              pendingFiles.length === 0 || isUploading
                ? "not-allowed"
                : "pointer",
          }}
        >
          {isUploading ? "Завантажуємо..." : "Завантажити фото"}
        </button>
      </div>
    </div>
  );
}

const wrapperStyle: React.CSSProperties = {
  display: "grid",
  gap: "18px",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
  flexWrap: "wrap",
};

const titleStyle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 800,
  color: "#111",
};

const hintStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#666",
  lineHeight: 1.5,
};

const counterStyle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 700,
  color: "#444",
  padding: "8px 10px",
  borderRadius: "999px",
  background: "#f5f5f5",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
  gap: "12px",
};

const cardStyle: React.CSSProperties = {
  border: "1px solid #ececec",
  borderRadius: "16px",
  overflow: "hidden",
  background: "#fff",
  display: "grid",
};

const imageWrapStyle: React.CSSProperties = {
  width: "100%",
  aspectRatio: "4 / 3",
  background: "#f3f3f3",
};

const imageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

const cardMetaStyle: React.CSSProperties = {
  padding: "10px",
  display: "grid",
  gap: "8px",
};

const badgeRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "6px",
  flexWrap: "wrap",
  alignItems: "center",
};

const indexBadgeStyle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 700,
  color: "#444",
  background: "#f5f5f5",
  borderRadius: "999px",
  padding: "6px 10px",
};

const coverBadgeStyle: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 700,
  color: "#166534",
  background: "#ecfdf3",
  border: "1px solid #bbf7d0",
  borderRadius: "999px",
  padding: "5px 8px",
};

const actionsRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "8px",
};

const uploadBoxStyle: React.CSSProperties = {
  border: "1px dashed #d1d5db",
  borderRadius: "16px",
  padding: "16px",
  display: "grid",
  gap: "12px",
  background: "#fafafa",
};

const uploadTitleStyle: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: 700,
  color: "#111",
};

const fileInputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: "12px",
  border: "1px solid #ddd",
  padding: "10px 12px",
  fontSize: "14px",
  background: "#fff",
  boxSizing: "border-box",
};

const pendingListStyle: React.CSSProperties = {
  display: "grid",
  gap: "8px",
};

const pendingItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "10px",
  padding: "10px 12px",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  background: "#fff",
};

const pendingNameStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#333",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const removePendingStyle: React.CSSProperties = {
  width: "28px",
  height: "28px",
  borderRadius: "999px",
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer",
};

const primaryButtonStyle: React.CSSProperties = {
  height: "44px",
  border: "none",
  borderRadius: "12px",
  background: "#111",
  color: "#fff",
  fontSize: "14px",
  fontWeight: 700,
};

const makeCoverButtonStyle: React.CSSProperties = {
  height: "34px",
  padding: "0 10px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  background: "#fff",
  color: "#111",
  fontSize: "11px",
  fontWeight: 700,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const coverPlaceholderStyle: React.CSSProperties = {
  height: "34px",
  display: "inline-flex",
  alignItems: "center",
  fontSize: "12px",
  fontWeight: 700,
  color: "#166534",
};

const trashButtonStyle: React.CSSProperties = {
  width: "34px",
  height: "34px",
  border: "1px solid #fecaca",
  borderRadius: "10px",
  background: "#fff5f5",
  color: "#b91c1c",
  fontSize: "14px",
  fontWeight: 700,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};
