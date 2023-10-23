import { FC, Fragment } from 'react';
import { RefModelIndexEntry } from './ref-models';
import { Button, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';
import { DemoModelLink } from './demo-model-link';

export const RefModelsTable: FC<{
  files: RefModelIndexEntry[];
  onClick?(f: RefModelIndexEntry, index: number): void;
}> = (props) => {
  return (
    <TableContainer>
      <Table variant="simple" className="w-full">
        <Thead>
          <Tr>
            <Th>file</Th>
            <Th>#models</Th>
            <Th>#voxels</Th>
            <Th>#warnings</Th>
            <Th>link to viewer</Th>
          </Tr>
        </Thead>
        <Tbody>
          {props.files.flatMap((f) => (
            <Tr key={f.path}>
              <Td>{f.path}</Td>
              <Td>{f.models.length}</Td>
              <Td>
                {f.models.map((m, modelIndex) => (
                  <p key={modelIndex}>{m.numVoxels}</p>
                ))}
              </Td>
              <Td>{f.warnings.length}</Td>
              <Td className="space-y-4 space-x-2">
                <DemoModelLink entry={f}>Open in viewer</DemoModelLink>
              </Td>
            </Tr>
          ))}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>file</Th>
            <Th>#models</Th>
            <Th>#voxels</Th>
            <Th>#warnings</Th>
            <Th>link to viewer</Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
};
