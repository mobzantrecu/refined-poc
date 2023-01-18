import { TextField } from "@pankod/refine-antd";
import { ShowFieldsType } from "./decorators/AntdEntity";

type ShowComponentProps = {value: any, record: any, index?: number}

// TODO: refactor names. This component probably should mutate to something more general or based on the class metadata and definitions from decorators
// TODO: edge case: props null
export const ShowComp: React.FC<ShowComponentProps> = (props: ShowComponentProps, context?: any) => {
  const Componente = props.record?.metadata?.renderTag;

  return (
    <div key={props.record.key}>
      <div style={{ backgroundColor: "red" }}>
        <TextField
          value={
            `${props.index} ` + (props.record?.metadata?.title && props.record.metadata.title.toString()) ??
            null
          }
        />
      </div>
      <br />
      {/**
       * Componente references the React component defiend in the class Render decorator
       */}
      <Componente>{(props.value && props.value.toString()) ?? null}</Componente>
    </div>
  );
};

// TODO: refactor names. Explain what this is doing, find if it's optimizable.
export const ShowAllFields = (props: { fields: ShowFieldsType }) => {
  return (
    <>
      {Object.entries(props.fields).map(([fieldName, field], index) =>
        field.render()
      )}
    </>
  );
};
