import "reflect-metadata";

export const titleMetadataKey = Symbol("title");
export const titleKey = "title";

function title(name: string) {
  return Reflect.metadata(titleMetadataKey, name);
}

export default title;
