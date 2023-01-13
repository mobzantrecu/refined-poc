import { TextField } from "@pankod/refine-antd";
import { ShowFieldsType } from "./decorators/AntdEntity";
import React from "react";

// TODO: refactor names. This component probably should mutate to something more general or based on the class metadata and definitions from decorators
export const ShowComp: React.FC = (value: any, record: any, index?: number) => {
  const Componente = record?.metadata?.renderTag;

  return (
    <div key={record.key}>
      <div style={{backgroundColor: 'red'}}>
        <TextField
          value={
            (record?.metadata?.title && record.metadata.title.toString()) ?? null
          }
        />
      </div>
      <br />
      {/**
       * Componente references the React component defiend in the class Render decorator
       */}
      <Componente>{(value && value.toString()) ?? null}</Componente>
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
