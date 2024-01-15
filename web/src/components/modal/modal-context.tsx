import React, { createRef, Fragment, ReactNode, RefObject, useContext, useState } from 'react';
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
import styles from './modal.module.scss';

type ModalResult<T> =
  | {
      result: 'complete';
      value: T;
      error?: null;
    }
  | {
      result: 'dismissed';
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
const DISMISS_SENTRY = Symbol('modal-context-dismiss-sentry');

export interface ModalHandle<T> {
  deferred: Deferred<T>;
  dismiss(): void;
  leastDestructiveRef: RefObject<HTMLButtonElement>;
}

interface ModalOptions {
  closeOnOverlayClick?: boolean;
}

class ModalApi {
  private _current: null | { deferred: Deferred<unknown> } = null;
  constructor(private readonly setModalElem: React.Dispatch<null | React.ReactElement>) {}

  get isShowing(): boolean {
    return !!this._current;
  }

  async dismiss() {
    this._current?.deferred.reject(DISMISS_SENTRY);
  }

  /**
   * An alert modal with a single OK button.
   */
  alert(
    title: string,
    body: string | React.ReactElement,
    buttonText = 'OK',
    options?: ModalOptions,
  ): Promise<ModalResult<void>> {
    return this.showElement<void>((handle) => {
      const onOk = () => handle.deferred.fulfill(undefined);
      return (
        <AlertDialog
          motionPreset="slideInBottom"
          leastDestructiveRef={handle.leastDestructiveRef}
          closeOnOverlayClick={options?.closeOnOverlayClick /* defaults to true */}
          onClose={handle.dismiss}
          isOpen
          isCentered
          useInert
        >
          <AlertDialogOverlay />

          <AlertDialogContent>
            <AlertDialogHeader>{title}</AlertDialogHeader>
            <AlertDialogCloseButton onClick={handle.dismiss} ref={handle.leastDestructiveRef} />
            <AlertDialogBody>{body}</AlertDialogBody>
            <AlertDialogFooter>
              <Button colorScheme="blue" onClick={onOk}>
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
      const onOk = () => input.deferred.fulfill(true);
      const onCancel = () => input.deferred.fulfill(false);

      return (
        <AlertDialog
          motionPreset="slideInBottom"
          leastDestructiveRef={input.leastDestructiveRef}
          onClose={input.dismiss}
          isOpen
          isCentered
          useInert
        >
          <AlertDialogOverlay />

          <AlertDialogContent className={styles.modalContent}>
            <AlertDialogHeader>{title}</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody className={styles.modalBody}>{body}</AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onCancel} ref={input.leastDestructiveRef}>
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

  build<T = unknown>(
    builder: (handle: ModalHandle<T>) => {
      title?: ReactNode;
      body?: ReactNode;
      footer?: ReactNode;
    },
    options?: {
      noCloseButton?: boolean;
      closeOnOverlayClick?: boolean;
    },
  ): Promise<ModalResult<T>> {
    return this.showElement((handle) => {
      const built = builder(handle);

      return (
        <AlertDialog
          motionPreset="slideInBottom"
          leastDestructiveRef={handle.leastDestructiveRef}
          onClose={handle.dismiss}
          closeOnOverlayClick={options?.closeOnOverlayClick}
          isOpen
          isCentered
          blockScrollOnMount
          useInert
        >
          <AlertDialogOverlay />

          <AlertDialogContent>
            <AlertDialogHeader>{built.title}</AlertDialogHeader>
            {!options?.noCloseButton && (
              <AlertDialogCloseButton onClick={handle.dismiss} ref={handle.leastDestructiveRef} />
            )}
            <AlertDialogBody>{built.body}</AlertDialogBody>
            <AlertDialogFooter>{built.footer}</AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    });
  }

  private async showElement<T>(builder: (handle: ModalHandle<T>) => React.ReactElement): Promise<ModalResult<T>> {
    if (this._current) {
      return Promise.reject('modal slot in use');
    }
    const d = new Deferred<T>();
    this._current = { deferred: d as Deferred<unknown> };
    const leastDestructiveRef = createRef<HTMLButtonElement>();
    const elem = builder({
      deferred: d,
      dismiss() {
        d.reject(DISMISS_SENTRY);
      },
      leastDestructiveRef,
    });
    this.setModalElem(elem);

    try {
      return {
        result: 'complete',
        value: await d,
      };
    } catch (e) {
      if (e === DISMISS_SENTRY) {
        return {
          result: 'dismissed',
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

export const useModalApi = (): ModalApi => useContext(ModalContext);
