"use client";

import { FC } from "react";
import { Dialog,DialogContent, DialogHeader, DialogDescription, DialogTitle } from "./dialog";


interface ModelProps {
  title: string;
  desc: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}
export const Modal: React.FC<ModelProps> = ({
  title,
  desc,
  isOpen,
  onClose,
  children,
}) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    {title}
                </DialogTitle>
                <DialogDescription>

                    {desc}
                </DialogDescription>

            </DialogHeader>

            <div>
                {children}
            </div>
        </DialogContent>

    </Dialog>
  )
};
