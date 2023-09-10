import { FC } from 'react';
import { RefModelIndexEntry } from './ref-models';
import { Button, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';
import { DemoModelLink } from './demo-model-link';

export const RefModelsTable: FC<{
  files: RefModelIndexEntry[];
  onClick?(f: RefModelIndexEntry, index: number): void;
}> = (props) => {
  return (
    <TableContainer>
      <Table variant="simple" className="w-full" style={{ tableLayout: 'fixed' }}>
        <Thead>
          <Tr>
            <Th>file</Th>
            <Th>models</Th>
            <Th>#warnings</Th>
          </Tr>
        </Thead>
        <Tbody>
          {props.files.flatMap((f) => (
            <Tr key={f.path}>
              <Td>{f.path}</Td>
              <Td className="space-y-4 space-x-2">
                {f.models.map((model, i) => (
                  <>
                    <DemoModelLink entry={f} index={i}>
                      Model #{i}
                    </DemoModelLink>
                    {(i + 1) % 4 === 0 && <br />}
                  </>
                ))}
              </Td>
              <Td>{f.warnings.length}</Td>
            </Tr>
          ))}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>file</Th>
            <Th>models</Th>
            <Th>#warnings</Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
};
