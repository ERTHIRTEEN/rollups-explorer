"use client";
import {
    ActionIcon,
    Badge,
    Collapse,
    JsonInput,
    Table,
    Tabs,
    Text,
    Textarea,
} from "@mantine/core";
import { FC } from "react";
import prettyMilliseconds from "pretty-ms";
import { Hex, getAddress, hexToString } from "viem";
import {
    TbAlphabetLatin,
    TbArrowRight,
    TbX,
    TbFileText,
    TbJson,
} from "react-icons/tb";
import { useDisclosure } from "@mantine/hooks";
import { InputItemFragment } from "../graphql";
import Address from "./address";
import { erc20PortalAddress, etherPortalAddress } from "../contracts";

export type InputCardProps = {
    input: InputItemFragment;
};

export type MethodResolver = (
    input: InputItemFragment,
) => string | undefined | false;

const etherDepositResolver: MethodResolver = (input) =>
    getAddress(input.msgSender) === etherPortalAddress && "depositEther";
const erc20PortalResolver: MethodResolver = (input) =>
    getAddress(input.msgSender) === erc20PortalAddress && "depositERC20Tokens";

const resolvers: MethodResolver[] = [etherDepositResolver, erc20PortalResolver];
const methodResolver: MethodResolver = (input) => {
    for (const resolver of resolvers) {
        const method = resolver(input);
        if (method) return method;
    }
    return undefined;
};

const InputRow: FC<InputCardProps> = ({ input }) => {
    const [opened, { toggle }] = useDisclosure(false);
    const age = prettyMilliseconds(Date.now() - input.timestamp * 1000, {
        unitCount: 2,
        verbose: true,
    });

    const from = input.msgSender as Address;
    const to = input.application.id as Address;

    const method = (
        <Badge variant="default" style={{ textTransform: "none" }}>
            {methodResolver(input) ?? "?"}
        </Badge>
    );
    return (
        <>
            <Table.Tr>
                <Table.Td>
                    <Address value={from} icon />
                </Table.Td>
                <Table.Td>
                    <TbArrowRight />
                </Table.Td>
                <Table.Td>
                    <Address value={to} icon href={`/applications/${to}`} />
                </Table.Td>
                <Table.Td>{method}</Table.Td>
                <Table.Td>
                    <Text>{input.index}</Text>
                </Table.Td>
                <Table.Td>
                    <Text>{age} ago</Text>
                </Table.Td>
                <Table.Td>
                    <ActionIcon variant="default" onClick={toggle}>
                        {opened ? <TbX /> : <TbFileText />}
                    </ActionIcon>
                </Table.Td>
            </Table.Tr>
            <Table.Tr></Table.Tr>
            <Table.Tr>
                <Table.Td colSpan={8} p={0}>
                    <Collapse in={opened}>
                        <Tabs defaultValue="raw">
                            <Tabs.List>
                                <Tabs.Tab
                                    value="raw"
                                    leftSection={<TbFileText />}
                                >
                                    Raw
                                </Tabs.Tab>
                                <Tabs.Tab
                                    value="text"
                                    leftSection={<TbAlphabetLatin />}
                                >
                                    As Text
                                </Tabs.Tab>
                                <Tabs.Tab value="json" leftSection={<TbJson />}>
                                    As JSON
                                </Tabs.Tab>
                            </Tabs.List>

                            <Tabs.Panel value="raw">
                                <Textarea rows={10}>{input.payload}</Textarea>
                            </Tabs.Panel>

                            <Tabs.Panel value="text">
                                <Textarea
                                    rows={10}
                                    value={hexToString(input.payload as Hex)}
                                />
                            </Tabs.Panel>

                            <Tabs.Panel value="json">
                                <JsonInput
                                    rows={10}
                                    value={hexToString(input.payload as Hex)}
                                />
                            </Tabs.Panel>
                        </Tabs>
                    </Collapse>
                </Table.Td>
            </Table.Tr>
        </>
    );
};

export default InputRow;