'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';
import { Plus, Edit, Trash2, Share2, Eye } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const fetcher = (url: string) => fetch(url).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
});

export default function PresentationsPage({ params }) {
    const router = useRouter();
    const { id }: { id: string } = React.use(params);
    
    // Fetch course data
    const { data: courseData, error: courseError, isLoading: courseLoading } = useSWR(`/api/course/${id}`, fetcher);
    
    // Fetch presentations for this course
    const { data: presentations, error: presentationsError, isLoading: presentationsLoading, mutate: mutatePresentation } = 
        useSWR(`/api/presentation?courseId=${id}`, fetcher);
    
    const [newPresentationTitle, setNewPresentationTitle] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [presentationToDelete, setPresentationToDelete] = useState(null);

    // Handle creating a new presentation
    const handleCreatePresentation = async (e) => {
        e.preventDefault();
        if (!newPresentationTitle.trim()) {
            toast.error('Please enter a title for the presentation');
            return;
        }

        setIsCreating(true);
        try {
            const response = await fetch('/api/presentation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newPresentationTitle,
                    courseId: id,
                    // If there's a default presentation, copy its blockIds
                    blockIds: courseData?.course?.presentationBlockIds || []
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create presentation');
            }

            const newPresentation = await response.json();
            toast.success('Presentation created successfully');
            setNewPresentationTitle('');
            setDialogOpen(false);
            mutatePresentation();
        } catch (error) {
            toast.error('Failed to create presentation');
            console.error('Error creating presentation:', error);
        } finally {
            setIsCreating(false);
        }
    };

    // Handle deleting a presentation
    const handleDeletePresentation = async () => {
        if (!presentationToDelete) return;

        try {
            const response = await fetch(`/api/presentation/${presentationToDelete.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete presentation');
            }

            toast.success('Presentation deleted successfully');
            setDeleteDialogOpen(false);
            setPresentationToDelete(null);
            mutatePresentation();
        } catch (error) {
            toast.error('Failed to delete presentation');
            console.error('Error deleting presentation:', error);
        }
    };

    // Handle sharing a presentation
    const handleSharePresentation = (presentation) => {
        const url = `${window.location.origin}/presentation/${presentation.id}`;
        navigator.clipboard.writeText(url).then(() => {
            toast.success('Link copied to clipboard!');
        }).catch(err => {
            toast.error('Failed to copy link.');
            console.error('Failed to copy text: ', err);
        });
    };

    // Loading state
    if (courseLoading || presentationsLoading) {
        return (
            <div className="p-8 space-y-4">
                <Skeleton className="h-10 w-1/4" />
                <Skeleton className="h-8 w-1/2" />
                <Separator className="my-4" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    // Error state
    if (courseError || presentationsError) {
        return (
            <div className="p-8 text-red-500">
                <p>Error: {courseError?.message || presentationsError?.message}</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Presentations</h1>
                    <p className="text-muted-foreground">Manage presentations for {courseData?.course?.title}</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="mt-4 sm:mt-0">
                            <Plus className="mr-2 h-4 w-4" /> Add Presentation
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Presentation</DialogTitle>
                            <DialogDescription>
                                Add a new presentation to your course.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreatePresentation}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="title" className="text-right">
                                        Title
                                    </Label>
                                    <Input
                                        id="title"
                                        value={newPresentationTitle}
                                        onChange={(e) => setNewPresentationTitle(e.target.value)}
                                        className="col-span-3"
                                        placeholder="Enter presentation title"
                                        required
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isCreating}>
                                    {isCreating ? 'Creating...' : 'Create Presentation'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <Separator className="mb-6" />

            {presentations?.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {presentations.map((presentation) => (
                            <TableRow key={presentation.id}>
                                <TableCell className="font-medium">{presentation.title}</TableCell>
                                <TableCell>{new Date(presentation.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(presentation.updatedAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleSharePresentation(presentation)}
                                            title="Share"
                                        >
                                            <Share2 className="h-4 w-4" />
                                        </Button>
                                        <Link href={`/dashboard/course/${id}/presentations/${presentation.id}/preview`}>
                                            <Button variant="outline" size="icon" title="Preview">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link href={`/dashboard/course/${id}/presentations/${presentation.id}`}>
                                            <Button variant="outline" size="icon" title="Edit">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                                setPresentationToDelete(presentation);
                                                setDeleteDialogOpen(true);
                                            }}
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>No Presentations</CardTitle>
                        <CardDescription>
                            You haven't created any presentations for this course yet.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Create your first presentation to start sharing your content.</p>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => setDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Create Presentation
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Presentation</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{presentationToDelete?.title}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeletePresentation}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}