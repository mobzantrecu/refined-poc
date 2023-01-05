import "reflect-metadata";

export const renderMetadataKey = Symbol("renderTag");
export const renderKey = "renderTag";

function render(component: React.ComponentType) {
  return Reflect.metadata(renderMetadataKey, component);
}

export default render;
