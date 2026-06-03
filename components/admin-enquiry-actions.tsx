"use client"

import { useState } from "react"
import {
  MoreHorizontal,
  Mail,
  MailOpen,
  Trash2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toggleEnquiryRead, deleteEnquiry } from "@/app/actions/contact"

interface Enquiry {
  id: number
  name: string
  email: string
  company: string | null
  message: string
  read: boolean
  createdAt: Date
}

export function AdminEnquiryActions({ enquiry }: { enquiry: Enquiry }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  async function handleToggleRead() {
    setIsProcessing(true)
    await toggleEnquiryRead(enquiry.id, !enquiry.read)
    setIsProcessing(false)
  }

  async function handleDelete() {
    setIsProcessing(true)
    await deleteEnquiry(enquiry.id)
    setShowDeleteDialog(false)
    setIsProcessing(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded-lg p-2 text-[#6b7f5e] transition-colors hover:bg-[#84cc16]/10 hover:text-[#1a2e0a]">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={handleToggleRead}
            disabled={isProcessing}
            className="cursor-pointer"
          >
            {enquiry.read ? (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Mark as Unread
              </>
            ) : (
              <>
                <MailOpen className="mr-2 h-4 w-4" />
                Mark as Read
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Enquiry?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the enquiry from{" "}
              <strong>{enquiry.name}</strong>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
