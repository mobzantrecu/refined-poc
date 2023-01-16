import "reflect-metadata";

// TODO: revisar para qué está?
export const renderCellMetadataKey = Symbol("renderCell");
function renderCell(renderFn: Function) {
  return Reflect.metadata(renderCellMetadataKey, renderFn);
}

export default renderCell;
