import { ChakraDemo } from '../../src/_dev/chakra-demo';
import { LayoutHeader } from '../../src/layout/header';

const ComponentsDemoPage = () => {
  return (
    <div>
      <LayoutHeader />
      <hr className="my-2" />
      <ChakraDemo />
    </div>
  );
};
export default ComponentsDemoPage;
