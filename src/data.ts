import fullData from "../public/data.json";

function getCategories(data: typeof fullData) {
  let _categories = data.emoticon_format.map((cate) => ({
    ...cate,
    value: cate.value.map((emo) => {
      const ext = emo.url.slice(emo.url.lastIndexOf("."));
      const url = `/emoticon/${emo.value}${ext}`;
      return {
        ...emo,
        originalUrl: emo.url,
        url,
      };
    }),
  }));

  let _emoticonsUrlToData = new Map(
    _categories.flatMap((c) => c.value.map((emo) => [emo.originalUrl, emo]))
  );

  const categories = _categories.map((c) => ({
    ...c,
    url: _emoticonsUrlToData.get(c.url)?.url,
  }));

  return categories;
}

export const categories = getCategories(fullData);

export type EmoticonCategoryData = typeof categories[number];

export type Emoticon = EmoticonCategoryData["value"][number];

const valueMap = new Map(
  categories.flatMap((cate) => cate.value.map((v) => [v.value, v]))
);

export function getByValue(value: string): Emoticon | undefined {
  return valueMap.get(value);
}
