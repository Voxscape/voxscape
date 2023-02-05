import { FC } from 'react';
import { RefModelIndexEntry } from './ref-models';
import { Button, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';

export const RefModelsTable: FC<{ models: RefModelIndexEntry[]; onClick?(entry: RefModelIndexEntry): void }> = (
  props,
) => {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>path</Th>
            <Th>#models</Th>
            <Th>#bytes</Th>
            <Th>#warning</Th>
            <Th>operation</Th>
          </Tr>
        </Thead>
        <Tbody>
          {props.models.map((m) => {
            return (
              <Tr key={m.path}>
                <Td>{m.path}</Td>
                <Td isNumeric>{m.size}</Td>
                <Td isNumeric>{m.numModels}</Td>
                <Td isNumeric>{m.numWarnings}</Td>
                <Td>
                  <Button type="button" onClick={() => props.onClick?.(m)}>
                    Open
                  </Button>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>path</Th>
            <Th>#models</Th>
            <Th>#bytes</Th>
            <Th>#warning</Th>
            <Th>operation</Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
};
