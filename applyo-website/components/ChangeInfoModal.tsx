"use client";

import React, { Fragment, useEffect } from "react";
import { createPortal } from "react-dom";
import { Dialog, Transition, DialogPanel, DialogTitle, TransitionChild } from "@headlessui/react";

type ModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: React.ReactNode;
  children?: React.ReactNode;
};

const Modal = ({ isModalOpen, setIsModalOpen, title, children }: ModalProps) => {
  // ensure we only render on client when `document` exists
  const [mounted, setMounted] = React.useState(false);
  useEffect(() => setMounted(true), []);

  const modalContent = (
    <Transition appear show={isModalOpen} as={Fragment}>
      <Dialog
        as="div"
        // make the dialog fixed at viewport level and very high z-index
        className="fixed inset-0 z-[9999] flex items-start md:items-center justify-center p-4"
        onClose={() => setIsModalOpen(false)}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {/* dark, opaque overlay */}
          <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
        </TransitionChild>

        <div className="relative z-[10000] w-full max-w-3xl">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="relative transform overflow-auto max-h-[90vh] rounded-xl bg-white p-6 md:p-8 shadow-2xl transition-all">
              <div className="flex items-start justify-between gap-4 mb-4">
                <DialogTitle as="h3" className="text-lg font-semibold">
                  {title}
                </DialogTitle>

                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md p-1 hover:bg-neutral-100"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close modal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              </div>

              <div className="prose max-w-none">
                {children}
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );

  if (!mounted) return null;
  return createPortal(modalContent, document.body);
};

export default Modal;