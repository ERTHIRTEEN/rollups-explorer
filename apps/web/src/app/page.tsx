"use client";
import { FC } from "react";
import {
    Anchor,
    Breadcrumbs,
    Card,
    Group,
    Stack,
    Table,
    Text,
    Title,
} from "@mantine/core";
import { TbApps, TbInbox } from "react-icons/tb";
import { useInputsQuery, useStatsQuery } from "../graphql/index";
import InputRow from "../components/inputRow";

const Explorer: FC = (props) => {
    const [{ data: stats }] = useStatsQuery();
    const [{ data }] = useInputsQuery();
    return (
        <Stack>
            <Breadcrumbs>
                <Anchor>Home</Anchor>
            </Breadcrumbs>
            <Group>
                <Card w={200} radius="md" shadow="sm">
                    <Group gap={5}>
                        <TbInbox size={20} />
                        <Text c="dimmed">Inputs</Text>
                    </Group>
                    <Text fw={800} size="xl">
                        {stats?.inputsConnection.totalCount}
                    </Text>
                </Card>
                <Card w={200} radius="md" shadow="sm">
                    <Group gap={5}>
                        <TbApps />
                        <Text c="dimmed">Applications</Text>
                    </Group>
                    <Text fw={800} size="xl">
                        {stats?.applicationsConnection.totalCount}
                    </Text>
                </Card>
            </Group>
            <Group>
                <TbInbox size={40} />
                <Title order={3}>Inputs</Title>
            </Group>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>From</Table.Th>
                        <Table.Th></Table.Th>
                        <Table.Th>To</Table.Th>
                        <Table.Th>Method</Table.Th>
                        <Table.Th>Index</Table.Th>
                        <Table.Th>Age</Table.Th>
                        <Table.Th>Data</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {data?.inputs.map((input) => (
                        <InputRow key={input.id} input={input} />
                    ))}
                </Table.Tbody>
            </Table>
        </Stack>
    );
};

export default Explorer;