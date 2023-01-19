import { BaseKey, BaseRecord, useMany } from '@pankod/refine-core';

function JoinColumnMultipleFetch<T extends BaseRecord>({
    resource,
    id,
    fieldToShow,
}: {
    resource: string;
    id: BaseKey[];
    fieldToShow: string;
}): JSX.Element {
    const { data: response, isLoading } = useMany<T>({
        resource: resource,
        ids: id,
    });

    const data = response?.data;

    const filteredData = data?.map((x) => x[fieldToShow]);

    return isLoading ? <>{'loading...'}</> : <>{filteredData?.join(', ')}</>;
}

export default JoinColumnMultipleFetch;
