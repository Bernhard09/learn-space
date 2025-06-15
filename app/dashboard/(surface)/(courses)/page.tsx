// app/dashboard/(surface)/(courses)/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useSWR, { mutate } from 'swr'; // 1. Import mutate from SWR

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/dashboard/card';
import { Skeleton } from '@/components/ui/skeleton';

// A simple fetcher function for SWR to use
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CoursesPage() {
    const router = useRouter();
    // 2. Destructure mutate from the useSWR hook
    const { data: courses, error, isLoading, mutate: mutateCourses } = useSWR('/api/course', fetcher);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [newCourseTitle, setNewCourseTitle] = useState('');
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newCourseDescription, setNewCourseDescription] = useState('');
    const [newCourseThumbnail, setNewCourseThumbnail] = useState('');

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newCourseTitle }),
      });

      if (!response.ok) {
        // Handle both validation and other server errors
        const errorData = await response.json().catch(() => ({})); // Gracefully handle non-JSON responses
        throw new Error(errorData.errors?.title?._errors[0] || 'Failed to create course. Please try again.');
      }
      
      // 3. Tell SWR to re-fetch the course list to get the latest data
      mutateCourses();

      setDialogOpen(false); // Close the dialog
      setNewCourseTitle(''); // Reset the input
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Courses</h1>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button>Add New Course</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleCreateCourse}>
                <DialogHeader>
                    <DialogTitle>Add a New Course</DialogTitle>
                    <DialogDescription>
                    Give your new course a title to get started.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                        Title
                    </Label>
                    <Input
                        id="title"
                        value={newCourseTitle}
                        onChange={(e) => setNewCourseTitle(e.target.value)}
                        className="col-span-3"
                        required
                        disabled={isSubmitting}
                    />
                    </div>
                    {formError && <p className="text-sm text-red-600 col-span-4 text-center">{formError}</p>}
                </div>
                <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Course'}
                    </Button>
                </DialogFooter>
                </form>
            </DialogContent>
            </Dialog>
        </div>

        {error && <div className="text-red-500">Failed to load courses. Please try again.</div>}
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isLoading && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
            
            {courses && courses.map((course: any) => (
            <Link key={course.id} href={`/dashboard/course/${course.id}`}>
                <Card title={course.title} />
            </Link>
            ))}
        </div>

        {courses && courses.length === 0 && !isLoading && (
            <div className="text-center py-12 text-gray-500">
            <p>You haven't created any courses yet.</p>
            <p>Click "Add New Course" to begin!</p>
            </div>
        )}
        </div>
    );
}
