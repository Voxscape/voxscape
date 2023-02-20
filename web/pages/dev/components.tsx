import { ChakraDemo } from '../../src/components/dev/chakra-demo';
import { LayoutHeader } from '../../src/components/layout/header';

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
