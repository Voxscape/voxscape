import React from 'react';

interface Props {
  onFileSelected?(f: File): void;

  accept?: string;
  buttonTitle?: string;
}

export const FilePicker: React.FunctionComponent<Props> = (props) => {
  const [file, setFile] = React.useState<null | File>(null);

  return (
    <>
      <input
        type="file"
        accept={props.accept}
        onChange={(ev) => setFile((ev.target.files && ev.target.files[0]) || null)}
      />
      <button
        type="button"
        disabled={!file}
        onInput={(ev) => file && props.onFileSelected && props.onFileSelected(file)}
      >
        {props.buttonTitle || 'Open'}
      </button>
    </>
  );
};
