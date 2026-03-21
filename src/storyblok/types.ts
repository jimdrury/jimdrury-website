export type StoryblokAssetMetaData = {
  alt?: string;
  title?: string;
  source?: string;
  copyright?: string;
};

export type StoryblokAsset = {
  id?: number;
  filename?: string;
  alt?: string;
  name?: string;
  focus?: string;
  title?: string;
  source?: string;
  copyright?: string;
  fieldtype?: "asset";
  meta_data?: StoryblokAssetMetaData;
  is_external_url?: boolean;
};
