import { useShow, useOne } from "@pankod/refine-core";
import { Show, Typography, Tag, NumberField } from "@pankod/refine-antd";

const { Title, Text } = Typography;

export const PostShow = () => {
    const { queryResult } = useShow();
    const { data, isLoading } = queryResult;
    const record = data?.data;

    return (
        <Show isLoading={isLoading}>
            <Title level={5}>Title</Title>
            <Text>{record?.title}</Text>

            <Title level={5}>Status</Title>
            <Text>
                <Tag>{record?.status}</Tag>
            </Text>
        </Show>
    );
};