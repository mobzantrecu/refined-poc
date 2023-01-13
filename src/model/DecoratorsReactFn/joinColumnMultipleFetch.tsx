import { useMany, useOne } from "@pankod/refine-core";

const JoinColumnMultipleFetch = ({ resource, id, fieldToShow }: any) => {
  const { data: response } = useMany({
    resource: resource,
    ids: id,
  });

  const data = response?.data as any[];

  const filteredData = data?.map((x) => x[fieldToShow]);

  return data ? filteredData.join(", ") : "loading...";
};

export default JoinColumnMultipleFetch;
