"use client";

import {
    useImperativeHandle,
    useRef,
    useState,
    type Ref,
    type RefObject,
} from "react";

export interface ModalHandle<T = void> {
    open: (payload: T) => void;
    close: () => void;
    setLoading: (loading: boolean) => void;
}

export interface ModalRefProps<T = void> {
    ref?: Ref<ModalHandle<T>>;
}

interface ModalState<T> {
    isOpen: boolean;
    isLoading: boolean;
    payload: T | null;
    onOpenChange: (open: boolean) => void;
}

export function useModalState<T = void>(
    ref: Ref<ModalHandle<T>> | undefined,
): ModalState<T> {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [payload, setPayload] = useState<T | null>(null);

    useImperativeHandle(
        ref,
        () => ({
            open: (p: T) => {
                setPayload(p);
                setIsLoading(false);
                setIsOpen(true);
            },
            close: () => setIsOpen(false),
            setLoading: setIsLoading,
        }),
        [],
    );

    return { isOpen, isLoading, payload, onOpenChange: setIsOpen };
}

// Calling `ref.current.x()` before the dialog mounts throws instead of silently no-oping.
export function defineDialogTrigger<T = void>() {
    return function useDialogTrigger(): RefObject<ModalHandle<T>> {
        return useRef<ModalHandle<T>>(unmountedHandle as ModalHandle<T>);
    };
}

const unmountedHandle: ModalHandle<unknown> = {
    open: () => {
        throw new Error("Dialog trigger called before its dialog was mounted");
    },
    close: () => {
        throw new Error("Dialog trigger called before its dialog was mounted");
    },
    setLoading: () => {
        throw new Error("Dialog trigger called before its dialog was mounted");
    },
};
