export type ModerationResult = {
  status: "passed" | "flagged";
  reason?: string;
};

const SUSPICIOUS_WORDS = [
  "казино",
  "ставки",
  "крипта",
  "інтим",
  "еротика",
  "порно",
  "наркотики",
  "зброя",
];

const BAD_WORDS = [
  "блядь",
  "сука",
  "хуй",
  "пизда",
  "пиздець",
  "єб",
  "еб",
];

const REAL_ESTATE_WORDS = [
  "квартира",
  "будинок",
  "ділянка",
  "земля",
  "оренда",
  "продаж",
  "кімнат",
  "м2",
  "м²",
  "поверх",
  "нерухомість",
  "житло",
];

export function moderatePropertyText(input: {
  title: string;
  description?: string;
  city?: string;
  addressLine?: string;
}): ModerationResult {
  const title = input.title.trim();
  const description = input.description?.trim() ?? "";

  const text = [
    title,
    description,
    input.city ?? "",
    input.addressLine ?? "",
  ]
    .join(" ")
    .toLowerCase();

    const hasLink =
    text.includes("http://") ||
    text.includes("https://") ||
    text.includes("t.me/") ||
    text.includes("telegram") ||
    text.includes("instagram.com") ||
    text.includes("facebook.com");

    const hasBadWord = BAD_WORDS.some((word) => text.includes(word));

    const hasSuspiciousWord = SUSPICIOUS_WORDS.some((word) =>
        text.includes(word),
    );
    const looksLikeRealEstate = REAL_ESTATE_WORDS.some((word) =>
        text.includes(word),
    );

    if (hasBadWord) {
    return { status: "flagged", reason: "Нецензурна лексика" };
    }

    if (hasSuspiciousWord) {
    return { status: "flagged", reason: "Підозрілий зміст" };
    }

    if (hasLink) {
    return { status: "flagged", reason: "Посилання або сторонні контакти" };
    }

    if (title.length < 8) {
    return { status: "flagged", reason: "Занадто коротка назва" };
    }

    if (description.length < 30) {
    return { status: "flagged", reason: "Занадто короткий опис" };
    }

  if (!looksLikeRealEstate) {
    return {
      status: "flagged",
      reason: "Оголошення може не стосуватись нерухомості",
    };
  }

  return {
    status: "passed",
  };
}