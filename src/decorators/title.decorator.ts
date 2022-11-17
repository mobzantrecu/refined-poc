import "reflect-metadata";

export const titleMetadataKey = Symbol("title");
function title(name: string) {
  return Reflect.metadata(titleMetadataKey, {
    title: name,
  });
}

export default title;
