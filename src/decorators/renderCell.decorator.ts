import "reflect-metadata";

export const renderCellMetadataKey = Symbol("renderCell");
function renderCell(renderFn: Function) {
  return Reflect.metadata(renderCellMetadataKey, renderFn);
}

export default renderCell;
