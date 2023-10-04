import clsx from 'clsx';
import { ChakraDemo } from '../../src/_dev/chakra-demo';
import { LayoutHeader } from '../../src/layout/header';
import { pixelBorders } from '../../src/styles/pixelBorders';
import { createDebugLogger } from '../../shared/logger';

const logger = createDebugLogger(__filename)

const ComponentsDemoPage = () => {

  logger('pixelBorders', pixelBorders)

  return (
    <div>
      <LayoutHeader />
      <hr className="my-2" />
      <div className='container'>
        <div className={clsx(pixelBorders.box.light)}>box-light</div>

      </div>
      <hr className="my-2" />
      <ChakraDemo />
    </div>
  );
};
export default ComponentsDemoPage;
