'use client';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

interface DeleteTestimonialButtonProps {
  id: string;
}

export default function DeleteTestimonialButton({ id }: DeleteTestimonialButtonProps) {
  const { pending } = useFormStatus();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }
    
    // Submit the form that contains this button
    const form = (e.target as HTMLElement).closest('form');
    if (form) {
      form.requestSubmit();
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-red-500 hover:text-red-700"
      onClick={handleDelete}
      disabled={pending}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}