import { z } from 'zod';
import { useInputState } from '@mantine/hooks';
import { Checkbox, Input, TextInput } from '@mantine/core';
import { useEffect } from 'react';
import type { createModelRequest } from '../../../server/api/routes/model/vox';

export type ModelMetaFormValue = Pick<z.infer<typeof createModelRequest>, 'title' | 'isPrivate' | 'desc'>;

export function ModelMetaForm({
  initial,
  onChange,
}: {
  initial?: ModelMetaFormValue;
  onChange?(value: ModelMetaFormValue): void;
}) {
  const [title, setTitle] = useInputState(initial?.title ?? '');
  const [desc, setDesc] = useInputState(initial?.desc ?? '');
  const [isPrivate, setIsPrivate] = useInputState(initial?.isPrivate ?? false);

  useEffect(() => {
    onChange?.({ title, desc, isPrivate });
  }, [title, desc, isPrivate, onChange]);

  return (
    <>
      <TextInput label="Title" value={title} onChange={setTitle} />
      <TextInput label="Description" value={desc} onChange={setDesc} />
      <Checkbox
        label="Private (anyone with URL can still view it)"
        checked={isPrivate}
        onChange={setIsPrivate}
      ></Checkbox>
    </>
  );
}
