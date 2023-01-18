import { useOne } from "@pankod/refine-core";

const JoinColumnFetch = ({ resource, id, fieldToShow }: any): JSX.Element => {
  const { data: response } = useOne({
    resource,
    id,
  });

  const data = response?.data as any;

  return data ? <>{data[fieldToShow]}</> : <>{"loading..."}</>;

};

export default JoinColumnFetch;
