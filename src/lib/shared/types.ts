// export type NormalizedFontFamily = { name: string; styles: string[]; };

type FontName = {
  family: string;
  style: string;
};

export type PresetData = {
  id?: string;
  updatedAt: number;
  name: string;
  cjkFontName: FontName;
  latinFontName: FontName;
  // flat to determine whether add space between CJK and Latin words
  spacing: boolean;
};
