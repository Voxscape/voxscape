import { FC } from 'react';
import { RefModelIndexEntry } from './ref-models';
import { Button, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';
import { DemoModelLink } from "./demo-model-link";

export const RefModelsTable: FC<{
  files: RefModelIndexEntry[];
  onClick?(f: RefModelIndexEntry, index: number): void;
}> = (props) => {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>path</Th>
            <Th>index</Th>
            <Th>#models</Th>
            <Th>#voxels</Th>
            <Th>#warning</Th>
            <Th>operation</Th>
          </Tr>
        </Thead>
        <Tbody>
          {props.files.flatMap((f) => {
            return f.models.map((model, i) => {
              return (
                <Tr key={`${f.path}-${i}`}>
                  <Td>{f.path}</Td>
                  <Td isNumeric>{i} </Td>
                  <Td isNumeric>{f.models.length}</Td>
                  <Td isNumeric>{model.numVoxels}</Td>
                  <Td isNumeric>{f.warnings.length}</Td>
                  <Td>
                    <DemoModelLink entry={f} index={i} />
                  </Td>
                </Tr>
              );
            });
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
