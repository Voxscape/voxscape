interface DummyImageProps {
  className?: string;
  width?: number;
  height?: number;
  text?: string;
}

function createUrl(props: DummyImageProps): string {
  return `https://dummyimage.com/${props.width ?? 600}x${props.height ?? 400}/000/fff&text=${props.text ?? ''}`;
}

export function DummyImage(props: DummyImageProps): React.ReactElement {
  const url = createUrl(props);
  return <img className={props.className} src={url} alt={props.text} />;
}
