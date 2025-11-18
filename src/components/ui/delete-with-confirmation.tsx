'use client';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface DeleteButtonProps {
  onDeleteUrl: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export function DeleteWithConfirmation({ onDeleteUrl, className = '', size = 'default' }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = async () => {
    if (confirm('Are you sure you want to delete this item?')) {
      setIsDeleting(true);
      try {
        const response = await fetch(onDeleteUrl, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          // Redirect to the partners page after successful deletion
          window.location.href = '/admin/partners';
        } else {
          console.error('Deletion failed:', await response.text());
        }
      } catch (error) {
        console.error('Deletion failed:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Button
      variant="ghost"
      size={size}
      className={`text-red-500 hover:text-red-700 ${className}`}
      onClick={handleClick}
      disabled={isDeleting}
    >
      {isDeleting ? (
        <span className="h-4 w-4">...</span>
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  );
}