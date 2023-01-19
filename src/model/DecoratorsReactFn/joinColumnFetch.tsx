import { BaseRecord, useOne } from "@pankod/refine-core";

function JoinColumnFetch<T extends BaseRecord> ({ resource, id, fieldToShow }: any): JSX.Element {
  const { data: response, isLoading } = useOne<T>({
    resource,
    id,
  });

  const data = response?.data as any;

  return isLoading ? <>{"loading..."}</> : <>{data[fieldToShow]}</>;

};

export default JoinColumnFetch;
