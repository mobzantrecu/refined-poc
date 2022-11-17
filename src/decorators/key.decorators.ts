import "reflect-metadata";

export const keyMetadataKey = Symbol("key");
function key(key: string) {
  return Reflect.metadata(keyMetadataKey, {
    key: key,
  });
}

export default key;
