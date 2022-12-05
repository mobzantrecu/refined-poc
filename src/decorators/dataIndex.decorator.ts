import "reflect-metadata";

export const dataIndexMetadataKey = Symbol("dataIndex");
export const dataIndexKey = 'dataIndex';
function dataIndex(name: string): PropertyDecorator {
  return Reflect.metadata(dataIndexMetadataKey, name);
}

export default dataIndex;
