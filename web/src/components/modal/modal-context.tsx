import React, { createRef, Fragment, ReactChild, ReactElement, useContext, useState } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useConst,
} from '@chakra-ui/react';
import { Deferred } from '@jokester/ts-commonutil/lib/concurrency/deferred';

type ModalResult<T> =
  | {
      result: 'complete';
      value: T;
      error?: null;
    }
  | {
      result: 'cancelled';
      value?: null;
      error?: null;
    }
  | {
      result: 'exception';
      value?: null;
      error: unknown;
    };

/**
 * @private
 */
const CANCEL_SENTRY = Symbol('modal-context-cancel-sentry');

interface ModalInput<T> {
  deferred: Deferred<T>;
  onClose(): void;
}

class ModalApi {
  private _current: null | { deferred: Deferred<unknown> } = null;
  constructor(private setModalElem: React.Dispatch<null | React.ReactElement>) {}

  get isShowing(): boolean {
    return !!this._current;
  }

  async dismiss() {
    this._current?.deferred.reject(CANCEL_SENTRY);
  }

  alert(
    title: string,
    body: string | React.ReactElement,
    buttonText = 'OK',
    options?: { closeOnOverlayClick?: boolean },
  ): Promise<ModalResult<void>> {
    const okButtonRef = createRef<HTMLButtonElement>();
    return this.showElement<void>((input) => {
      const onOk = () => input.deferred.fulfill(undefined);
      const onDismiss = () => input.deferred.reject(CANCEL_SENTRY);
      return (
        <AlertDialog
          motionPreset="slideInBottom"
          leastDestructiveRef={okButtonRef}
          closeOnOverlayClick={options?.closeOnOverlayClick ?? false}
          onClose={onDismiss}
          isOpen
          isCentered
        >
          <AlertDialogOverlay />

          <AlertDialogContent>
            <AlertDialogHeader>{title}</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>{body}</AlertDialogBody>
            <AlertDialogFooter>
              <Button colorScheme="blue" onClick={onOk} ref={okButtonRef}>
                {buttonText}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    });
  }

  confirm(
    title: string,
    body: string | React.ReactElement,
    options?: { destructive?: boolean; confirmButtonText?: string },
  ): Promise<ModalResult<boolean>> {
    return this.showElement<boolean>((input) => {
      const cancelButtonRef = createRef<HTMLButtonElement>();
      const onOk = () => input.deferred.fulfill(true);
      const onCancel = () => input.deferred.fulfill(false);
      const onDismiss = () => input.deferred.reject(CANCEL_SENTRY);

      return (
        <AlertDialog
          motionPreset="slideInBottom"
          leastDestructiveRef={cancelButtonRef}
          onClose={onDismiss}
          isOpen
          isCentered
        >
          <AlertDialogOverlay />

          <AlertDialogContent>
            <AlertDialogHeader>{title}</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>{body}</AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onCancel} ref={cancelButtonRef}>
                Cancel
              </Button>
              <Button colorScheme={options?.destructive ? 'red' : 'blue'} onClick={onOk} ml={3}>
                {options?.confirmButtonText ?? 'OK'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    });
  }

  showCustom<T>(
    builder: (input: ModalInput<T>) => {
      title?: null | ReactChild;
      body?: null | ReactChild;
      footer?: null | ReactChild;
    },
    options?: {
      noCloseButton?: boolean;
      closeOnOverlayClick?: boolean;
    },
  ): Promise<ModalResult<T>> {
    return this.showElement((input) => {
      const built = builder(input);
      const cancelButtonRef = createRef<HTMLButtonElement>();
      const onDismiss = () => input.deferred.reject(CANCEL_SENTRY);

      return (
        <AlertDialog
          motionPreset="slideInBottom"
          leastDestructiveRef={cancelButtonRef}
          onClose={onDismiss}
          closeOnOverlayClick={options?.closeOnOverlayClick}
          isOpen
          isCentered
          blockScrollOnMount
        >
          <AlertDialogOverlay />

          <AlertDialogContent>
            <AlertDialogHeader>{built.title || null}</AlertDialogHeader>
            {!options?.noCloseButton && <AlertDialogCloseButton />}
            <AlertDialogBody>{built.body || null}</AlertDialogBody>
            <AlertDialogFooter>{built.footer || null}</AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    });
  }

  private async showElement<T>(builder: (input: ModalInput<T>) => React.ReactElement): Promise<ModalResult<T>> {
    if (this._current) {
      return Promise.reject('modal slot in use');
    }
    const d = new Deferred<T>();
    this._current = { deferred: d as Deferred<unknown> };
    const elem = builder({
      deferred: d,
      onClose() {
        // TODO
      },
    });
    this.setModalElem(elem);

    try {
      return {
        result: 'complete',
        value: await d,
      };
    } catch (e) {
      if (e === CANCEL_SENTRY) {
        return {
          result: 'cancelled',
        };
      } else {
        return {
          result: 'exception',
          error: e,
        };
      }
    } finally {
      this.setModalElem(null);
      this._current = null;
    }
  }
}
const ModalContext = React.createContext<ModalApi>(null!);

export const ModalHolder: React.FC<React.PropsWithChildren> = (props) => {
  const [modalElem, setModalElem] = useState<null | React.ReactElement>(null);
  const modalApi = useConst(() => new ModalApi(setModalElem));

  return (
    <>
      <ModalContext.Provider value={modalApi}>{props.children}</ModalContext.Provider>
      <Fragment key="model-provider-value">{modalElem}</Fragment>
    </>
  );
};

export const useModalApi = () => useContext(ModalContext);
