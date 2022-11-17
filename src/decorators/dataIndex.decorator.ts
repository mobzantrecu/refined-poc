import "reflect-metadata";

export const dataIndexMetadataKey = Symbol("dataIndex");
function dataIndex(name: string) {
  return Reflect.metadata(dataIndexMetadataKey, {
    dataIndex: name,
  });
}

export default dataIndex;
