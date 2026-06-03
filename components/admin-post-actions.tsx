"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Pencil, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { deletePost, togglePublished } from "@/app/actions/blog"

interface Post {
  id: number
  title: string
  slug: string
  published: boolean
}

export function AdminPostActions({ post }: { post: Post }) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    await deletePost(post.id)
    setShowDeleteDialog(false)
    setIsDeleting(false)
    router.refresh()
  }

  async function handleTogglePublished() {
    await togglePublished(post.id, !post.published)
    router.refresh()
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2edcf] bg-white/60 text-[#6b7f5e] transition-colors hover:border-[#84cc16] hover:text-[#1a2e0a]">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="!border-[#e2edcf] !bg-white"
        >
          <DropdownMenuItem asChild className="!text-[#1a2e0a] hover:!bg-[#84cc16]/10">
            <Link href={`/admin/posts/${post.id}`}>
              <Pencil className="mr-2 h-4 w-4 text-[#84cc16]" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleTogglePublished}
            className="!text-[#1a2e0a] hover:!bg-[#84cc16]/10"
          >
            {post.published ? (
              <>
                <EyeOff className="mr-2 h-4 w-4 text-amber-500" />
                Unpublish
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4 text-emerald-500" />
                Publish
              </>
            )}
          </DropdownMenuItem>
          {post.published && (
            <DropdownMenuItem asChild className="!text-[#1a2e0a] hover:!bg-[#84cc16]/10">
              <Link href={`/blog/${post.slug}`} target="_blank">
                <ExternalLink className="mr-2 h-4 w-4 text-[#84cc16]" />
                View
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator className="!bg-[#e2edcf]" />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="!text-red-600 hover:!bg-red-50"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="!border-[#e2edcf] !bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="!text-[#1a2e0a]">
              Delete Post
            </AlertDialogTitle>
            <AlertDialogDescription className="!text-[#6b7f5e]">
              Are you sure you want to delete &ldquo;{post.title}&rdquo;? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="!border-[#e2edcf] !text-[#6b7f5e] hover:!bg-[#84cc16]/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="!bg-red-600 !text-white hover:!bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
