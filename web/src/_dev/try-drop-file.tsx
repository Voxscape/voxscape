import React, { CSSProperties } from 'react';

const logger = console;

const style: CSSProperties = {
  display: 'inline-block',
  height: 48,
  width: 144,
  background: 'white',
  outline: '1px dotted red',
};

function onMaybeFile(evDataTransfer: DataTransferItemList) {
  if (evDataTransfer && evDataTransfer.length) {
    const files: File[] = Array.from(evDataTransfer)
      .filter((i) => i.kind === 'file')
      .map((i) => /* only got non-null in drop event */ i.getAsFile()!)
      .filter((_) => !!_);
    logger.debug('files', files);
  }
}
export const TryDropFile: React.FC = (props) => {
  const [dragging, setDragging] = React.useState(false);
  logger.debug('dragging = ', dragging);
  const onDragOver = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    setDragging(true);
    logger.debug('onDragOver', ev);
    onMaybeFile(ev.dataTransfer.items);
  };
  const onDrop = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    setDragging(false);
    logger.debug('onDrop', ev);
    onMaybeFile(ev.dataTransfer.items);
  };
  const onDragLeave = (ev: React.DragEvent<HTMLDivElement>) => {
    setDragging(false);
    logger.debug('onDragLeave', ev);
    onMaybeFile(ev.dataTransfer.items);
  };
  const onDragEnter = (ev: React.DragEvent<HTMLDivElement>) => {
    setDragging(true);
    logger.debug('onDragEnter', ev);
    onMaybeFile(ev.dataTransfer.items);
  };
  return (
    <div onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave} onDragEnter={onDragEnter} style={style}>
      drag here
    </div>
  );
};
